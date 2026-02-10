"use server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@/lib/store";
import { Prisma } from "@prisma/client";

export async function createOrder(
  cartItems: CartItem[], 
  paypalOrderId: string, 
  customerEmail: string
) {
  try {
    // 1. Start a Database Transaction
    // This ensures that if ANY step fails (e.g., out of stock), EVERYTHING rolls back.
    const order = await prisma.$transaction(async (tx) => {
      
      let calculatedTotal = 0;
      const orderItemsData = [];

      // 2. Iterate through items to validate Price and Stock
      for (const item of cartItems) {
        // Fetch the REAL product from DB
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Producto no encontrado: ${item.name}`);
        }

        // Check Stock (Concurrency Guard)
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para: ${product.name}`);
        }

        // Calculate price using DB value (Security)
        const itemTotal = Number(product.price) * item.quantity;
        calculatedTotal += itemTotal;

        // Prepare OrderItem data
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // Snapshot the price at time of purchase
        });

        // 3. Decrement Stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 4. Create the Order Record
      const newOrder = await tx.order.create({
        data: {
          paypalOrderId: paypalOrderId,
          customerEmail: customerEmail, // In a real app, this comes from Auth
          totalAmount: new Prisma.Decimal(calculatedTotal),
          status: "PAID",
          items: {
            create: orderItemsData,
          },
        },
      });

      return newOrder;
    });





    
    return { success: true, orderId: order.id };

  } catch (error) {
    console.error("Transaction Failed DETAILED ERROR:", error); 
    const message = error instanceof Error ? error.message : "Error desconocido en el servidor";   
    return { success: false, error: message };
  }
}
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartStore } from "@/lib/store";
import { createOrder } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function PayPalCheckout() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity, 
    0
  );
  const finalAmount = (totalAmount * 1.15).toFixed(2);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="relative z-0">
        
        {/* 
           FIX: The Spinner is now an OVERLAY. 
           The PayPal buttons remain in the DOM underneath, preventing the crash.
        */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center border rounded-lg backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm font-medium text-primary">Procesando...</p>
          </div>
        )}

        <PayPalButtons
          className={isProcessing ? "opacity-50 pointer-events-none" : ""}
          style={{ layout: "vertical", shape: "rect" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: finalAmount,
                  },
                  description: "Compra en PrototypeStore",
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setIsProcessing(true); // Show overlay
              
              // 1. Capture Payment
              const details = await actions.order?.capture();
              if (!details) throw new Error("No details received");

              // 2. Create Order in DB
              const email = details.payer?.email_address || "guest@example.com";
              const result = await createOrder(items, data.orderID, email);

              console.log("Server Result:", result); // Debugging log

              if (result.success && result.orderId) {
                // 3. SUCCESS!
                clearCart(); 
                
                window.location.href = `/track/${result.orderId}?success=true`;
                
              } else {
                throw new Error(result.error || "Error al guardar la orden");
              }

            } catch (error) {
              console.error("Checkout Error:", error);
              setIsProcessing(false);
            const message = error instanceof Error ? error.message : "Error desconocido al procesar el pago";
            alert(`Error: ${message}`);
            }
          }}
          onError={(err) => {
            console.error("PayPal SDK Error:", err);
            alert("Error de conexión con PayPal");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
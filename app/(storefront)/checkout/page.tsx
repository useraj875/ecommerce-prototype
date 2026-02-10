"use client";

import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PayPalCheckout } from "@/components/checkout/paypal-button";
import { ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  // Redirect if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        
        {/* Left: Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Impuestos (15%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total a Pagar</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-700 text-sm">
            <ShieldCheck className="h-5 w-5 hrink-0" />
            <p>
              Esta es una transacción segura simulada. No se realizarán cargos reales a su tarjeta.
              Usando <strong>PayPal Sandbox</strong>.
            </p>
          </div>
        </div>

        {/* Right: Payment Button */}
        <div>
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Método de Pago</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PayPalCheckout />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Dynamic export to prevent hydration issues
export default dynamic(() => Promise.resolve(CheckoutPage), {
  ssr: false,
});
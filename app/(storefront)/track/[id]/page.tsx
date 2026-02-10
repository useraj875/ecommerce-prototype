import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Calendar, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true, // We need the product details for the image/name
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return order;
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { success } = await searchParams;
  const order = await getOrder(id);

  // Format date
  const date = new Date(order.createdAt).toLocaleDateString("es-ES", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      
      {/* Success Banner (Only shows if redirected from checkout) */}
      {success === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-green-800">¡Pago Exitoso!</h2>
            <p className="text-green-700">
              Gracias por tu compra. Hemos enviado un recibo a <strong>{order.customerEmail}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalles del Pedido</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{order.id}</span>
          </p>
        </div>
        <Badge variant={order.status === "PAID" ? "default" : "secondary"} className="text-lg px-4 py-1">
          {order.status === "PAID" ? "Pagado" : "Pendiente"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Artículos ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(Number(item.price))}</p>
                    <p className="text-xs text-muted-foreground">unitario</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Fecha
                </span>
                <span className="text-sm text-right">{date}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Método
                </span>
                <span className="text-sm">PayPal</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(Number(order.totalAmount))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Tienda
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
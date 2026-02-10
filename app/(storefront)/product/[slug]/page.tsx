import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ShoppingCart, PackageX, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

// 1. Define the Params Type
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 2. Fetch Logic
async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound(); // Triggers the Next.js 404 page
  }

  return product;
}

// 3. Dynamic SEO Metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Prototype Store`,
    description: product.description,
  };
}

// 4. The Page Component
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority // Load this image immediately (LCP optimization)
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="text-lg py-2 px-4" variant="secondary">Agotado</Badge>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(Number(product.price))}
            </p>
            
            {isLowStock && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                ¡Solo quedan {product.stock}!
              </Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="pt-6 border-t">
            {isOutOfStock ? (
              <Button size="lg" disabled className="w-full md:w-auto text-lg px-8">
                <PackageX className="mr-2 h-5 w-5" />
                No Disponible
              </Button>
            ) : (
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                  stock: product.stock
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Decimal } from "@prisma/client/runtime/library"; 

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: Decimal; 
    image: string;
    stock: number;
    category: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock < 20 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {isLowStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Solo quedan {product.stock}!
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Fuera de Stock
          </Badge>
        )}
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{product.category.name}</p>
            <CardTitle className="text-lg font-bold line-clamp-1">{product.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 grow">
        <p className="text-xl font-bold text-primary">
          {formatCurrency(Number(product.price))}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={isOutOfStock}>
          <Link href={`/product/${product.slug}`}>
            {isOutOfStock ? "No disponible" : "Ver Detalles"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
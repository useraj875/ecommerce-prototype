"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      maxStock: product.stock,
    });

    // Feedback visual temporal
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button 
      size="lg" 
      className="w-full md:w-auto text-lg px-8 transition-all"
      onClick={handleAdd}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          ¡Agregado!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Carrito
        </>
      )}
    </Button>
  );
}
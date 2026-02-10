"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const NavbarCart = dynamic(
  () => import("@/components/layout/navbar-cart").then((mod) => mod.NavbarCart),
  { 
    ssr: false,
    loading: () => (
      <Button variant="ghost" size="icon" disabled>
        <ShoppingCart className="h-5 w-5" />
      </Button>
    )
  }
);

export function CartWrapper() {
  return <NavbarCart />;
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useCallback, useState, useEffect, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  categories: Category[];
}

export function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize state from URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const currentCategory = searchParams.get("cat");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (currentQ === query) return;

      const params = new URLSearchParams(searchParams.toString());
      
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams]);

  // Handle Category Click
  const toggleCategory = useCallback((categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCat = params.get("cat");

    if (currentCat === categoryName) {
      params.delete("cat");
    } else {
      params.set("cat", categoryName);
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }, [searchParams, router]);

  const clearAll = () => {
    setQuery("");
    startTransition(() => {
      router.push("/");
    });
  };

  const hasActiveFilters = query || currentCategory;

  return (
    <div className="space-y-6 mb-8">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <div className={cn("flex flex-wrap gap-2 items-center transition-opacity", isPending ? "opacity-50" : "opacity-100")}>
        <span className="text-sm text-muted-foreground mr-2">Filtros:</span>
        
        {categories.map((cat) => {
          const isActive = currentCategory === cat.name;
          return (
            <Badge
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 px-3 py-1 transition-colors"
              onClick={() => toggleCategory(cat.name)}
            >
              {cat.name}
            </Badge>
          );
        })}

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-6 px-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
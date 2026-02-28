"use client";

import Image from "next/image";
import { useCart, type Product } from "@/lib/cart-context";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted mb-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
        {product.badge && (
          <div className="absolute top-5 left-5 z-10 bg-background/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-foreground">
            {product.badge.toUpperCase()}
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add Button */}
        <div className="absolute bottom-5 left-5 right-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAdd}
            className={`w-full backdrop-blur-md py-4 rounded-2xl font-medium shadow-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${added
                ? "bg-primary text-primary-foreground"
                : "bg-background/95 text-foreground hover:bg-background"
              }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Adicionado!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Adicionar ao Carrinho
              </>
            )}
          </button>
        </div>
      </div>

      <h3 className="font-serif text-2xl text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
        {product.name}
      </h3>
      <p className="text-muted-foreground/80 font-medium text-lg">
        {product.priceFormatted}
      </p>
    </div>
  );
}

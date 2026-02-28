"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-24 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-3xl title text-primary">Casa do Bolo</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-[15px] font-medium tracking-wide text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <Link href="/cardapio" className="hover:text-primary transition-colors">Cardápio</Link>
            <a href="#sobre" className="hover:text-primary transition-colors">Sobre Nós</a>
            <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/carrinho"
              className="p-3 hover:bg-muted/50 rounded-full transition-colors relative group cursor-pointer"
              aria-label="Ver carrinho"
            >
              <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-[10px] font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-3 hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-8">
          <div className="flex justify-between items-center mb-16">
            <span className="text-3xl title text-primary">Casa do Bolo</span>
            <button
              className="p-3 hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            {[
              { href: "/", label: "Início" },
              { href: "/cardapio", label: "Cardápio" },
              { href: "/carrinho", label: "Carrinho" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-5xl title text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

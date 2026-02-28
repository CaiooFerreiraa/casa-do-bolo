"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { totalItems, toast, clearToast } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-16 sm:h-24 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-xl sm:text-3xl title text-primary">Casa do Bolo</span>
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

      {/* Global Cart Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[320px] z-[200] bg-[#2D2723] text-[#F5F1EE] px-5 py-4 rounded-2xl shadow-2xl border border-[#4E4038] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-start gap-4 mx-auto sm:mx-0">
          <div className="w-10 h-10 rounded-full bg-[#D7A684] flex-shrink-0 flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-5 h-5 text-[#2D2723]" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-bold leading-tight">{toast}</p>
            <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Carrinho atualizado</p>
          </div>
          <button onClick={clearToast} className="p-1 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0">
            <X className="w-4 h-4 opacity-40 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${mobileOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar content */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] bg-background p-8 shadow-2xl transition-transform duration-500 ease-out border-l border-border/40 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-16">
            <span className="text-2xl title text-primary">Casa do Bolo</span>
            <button
              className="p-3 hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {[
              { href: "/", label: "Início" },
              { href: "/cardapio", label: "Cardápio" },
              { href: "/carrinho", label: "Carrinho" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl title text-foreground hover:text-primary transition-all flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 active:scale-[0.98]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                <ChevronRight className="w-5 h-5 text-primary opacity-40" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-16 border-t border-border/40 text-muted-foreground">
            <p className="text-sm font-light leading-relaxed">Bolos feitos com afeto para momentos especiais.</p>
          </div>
        </div>
      </div>
    </>
  );
}

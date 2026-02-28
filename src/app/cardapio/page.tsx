"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { useAdmin } from "@/lib/admin-context";
import { ProductCard } from "@/components/product-card";
import { Search, SlidersHorizontal } from "lucide-react";

export default function CardapioPage() {
  const { products } = useAdmin();
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === "todos" || p.category === activeCategory;
    const matchesSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1607478900766-efe13248b125?q=80&w=1600&auto=format&fit=crop"
          alt="Mesa de bolos artesanais"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-24">
          <h1 className="text-5xl md:text-6xl title text-white drop-shadow-lg mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-white/80 text-lg font-light max-w-md">
            Cada bolo é uma obra feita com amor e ingredientes selecionados.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-24 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`category-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              id="search-product"
              placeholder="Buscar bolo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
              <SlidersHorizontal className="w-12 h-12 text-muted-foreground/50" />
              <div>
                <p className="text-2xl title text-foreground mb-2">Nenhum resultado</p>
                <p className="text-muted-foreground">
                  Tente outro filtro ou busca diferente.
                </p>
              </div>
              <button
                onClick={() => { setActiveCategory("todos"); setSearch(""); }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium cursor-pointer hover:bg-primary/80 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-10">
                {filtered.length} {filtered.length === 1 ? "bolo encontrado" : "bolos encontrados"}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

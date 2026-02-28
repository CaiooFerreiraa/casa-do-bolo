"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Lock, ShoppingBag, Utensils } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const { products } = useAdmin();
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="max-w-2xl space-y-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Confeitaria Artesanal Premium</span>
            </div>

            <h1 className="text-6xl lg:text-[5.5rem] title leading-[1.05] text-foreground">
              Bolos feitos com <span className="text-primary italic font-light">muito afeto</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-light">
              Desperte memórias com nossas receitas exclusivas. Ingredientes selecionados e muito cuidado em cada fatia que chega à sua mesa.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/cardapio"
                className="bg-primary text-primary-foreground px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold tracking-tight hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-primary/20 text-sm sm:text-base"
              >
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                Ver Cardápio
              </Link>
              <Link
                href="/carrinho"
                className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold tracking-tight text-foreground hover:bg-muted/50 transition-colors cursor-pointer text-sm sm:text-base text-center border-2 border-border/20 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Meu Carrinho
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] sm:h-[600px] lg:h-[750px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 order-first lg:order-last">
            <Image
              src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1200&auto=format&fit=crop"
              alt="Bolo artesanal decorado com frutas frescas e flores comestíveis"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-[1.5s] ease-out"
              priority
            />
            <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 sm:py-32 px-6 bg-accent/40 rounded-t-[3rem] sm:rounded-t-[4rem] relative mt-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 sm:mb-20">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl title text-foreground">Nossos Destaques</h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-md font-light">
                Descubra os sabores mais amados pelos nossos clientes.
              </p>
            </div>
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors font-medium border-b border-primary/20 hover:border-primary/70 pb-1 cursor-pointer"
            >
              Ver cardápio completo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-16">
            {(featured.length >= 4 ? featured : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-primary text-primary-foreground py-8 px-6 relative overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem] -mt-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 md:gap-12 relative z-10">
          <div className="md:col-span-5">
            <h4 className="text-2xl sm:text-3xl title mb-4 sm:mb-6">Casa do Bolo</h4>
            <p className="text-primary-foreground/80 max-w-sm text-sm sm:text-base font-light leading-relaxed">
              Criando momentos doces e memórias inesquecíveis através da autêntica confeitaria artesanal, desde 1990.
            </p>
          </div>
          <div id="sobre" className="md:col-span-2">
            <h5 className="font-serif text-lg mb-4 sm:mb-6 opacity-90">Navegação</h5>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-block text-sm">Início</Link></li>
              <li><Link href="/cardapio" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-block text-sm">Cardápio</Link></li>
              <li><Link href="/carrinho" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-block text-sm">Carrinho</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="font-serif text-lg mb-4 sm:mb-6 opacity-90">Admin</h5>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/admin"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Lock className="w-3 h-3" />
                  Painel Admin
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h5 className="font-serif text-lg mb-4 sm:mb-6 opacity-90">Contato</h5>
            <ul className="space-y-2 sm:space-y-3 text-primary-foreground/70 text-sm">
              <li className="flex items-start gap-3">
                <span className="opacity-60 mt-1">Av.</span>
                <span>Rua dos Doces, 123<br />Centro - São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-60">Tel.</span>
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-60">Em.</span>
                <span>contato@casadobolo.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-primary-foreground/20 text-center text-primary-foreground/50 text-[10px] font-light tracking-wide">
          <p>&copy; {new Date().getFullYear()} Casa do Bolo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const shipping = totalPrice > 0 ? (totalPrice >= 150 ? 0 : 15.9) : 0;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center gap-8 pt-24">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/60" />
        </div>
        <div>
          <h1 className="text-4xl title text-foreground mb-3">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground text-lg font-light max-w-sm">
            Explore nosso cardápio e adicione os bolos que você ama!
          </p>
        </div>
        <Link
          href="/cardapio"
          className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-medium text-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl shadow-primary/20"
        >
          Explorar Cardápio
          <ChevronRight className="w-5 h-5" />
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Continuar comprando
            </Link>
            <h1 className="text-5xl title text-foreground">Meu Carrinho</h1>
          </div>
          <button
            id="clear-cart"
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer hidden sm:block"
          >
            Limpar carrinho
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 p-5 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl text-foreground leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 font-light line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <button
                      id={`remove-${item.id}`}
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors cursor-pointer flex-shrink-0"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                      <button
                        id={`decrease-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        id={`increase-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-serif text-xl font-semibold text-foreground">
                      {(item.price * item.quantity).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
              <h2 className="text-2xl title text-foreground mb-8">Resumo do Pedido</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} itens)</span>
                  <span className="text-foreground font-medium">
                    {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrega</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-foreground font-medium"}>
                    {shipping === 0 ? "Grátis 🎉" : shipping.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground bg-muted p-3 rounded-xl">
                    Frete grátis em pedidos acima de R$ 150,00
                  </p>
                )}
              </div>

              <div className="border-t border-border/60 mt-6 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl title text-primary">
                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>

              <Link
                href="/pagamento"
                id="checkout-button"
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-medium text-lg hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-primary/20"
              >
                Finalizar Pedido
                <ChevronRight className="w-5 h-5" />
              </Link>

              <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
                Pagamento 100% seguro. <br /> Aceitamos Pix, cartão de crédito e débito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

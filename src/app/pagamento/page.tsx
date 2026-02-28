"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAdmin } from "@/lib/admin-context";
import {
  ArrowLeft, CreditCard, QrCode, Landmark, CheckCircle2,
  Lock, MapPin, ChevronDown, Loader2
} from "lucide-react";
import { type Neighborhood } from "@/lib/neighborhoods";

type PaymentMethod = "pix" | "credit" | "debit";
type Step = "form" | "success";

export default function PagamentoPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { neighborhoods } = useAdmin();

  const [step, setStep] = useState<Step>("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState("");
  const [customNeighborhood, setCustomNeighborhood] = useState("");

  const selectedNeighborhood = neighborhoods.find((n) => n.id === selectedNeighborhoodId);
  const shipping = selectedIdToFee();
  const total = shipping !== null ? totalPrice + shipping : null;

  // Group neighborhoods by city for the select input
  const groupedNeighborhoods = neighborhoods.reduce((acc, n) => {
    if (!acc[n.city]) acc[n.city] = [];
    acc[n.city].push(n);
    return acc;
  }, {} as Record<string, Neighborhood[]>);

  function selectedIdToFee() {
    if (selectedNeighborhoodId === "outro") return 15.0;
    return selectedNeighborhood ? selectedNeighborhood.fee : null;
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    city: "Vitória da Conquista",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // CEP Lookup
  useEffect(() => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      handleCepLookup(cep);
    }
  }, [form.cep]);

  async function handleCepLookup(cep: string) {
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          address: data.logradouro || prev.address,
          city: data.localidade || prev.city,
        }));

        if (data.bairro) {
          const normalizedBairro = data.bairro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const match = neighborhoods.find(n =>
            n.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedBairro
          );

          if (match) {
            setSelectedNeighborhoodId(match.id);
            setCustomNeighborhood("");
          } else {
            setSelectedNeighborhoodId("outro");
            setCustomNeighborhood(data.bairro);
          }
        }
      }
    } catch (err) {
      console.error("Erro no CEP:", err);
    } finally {
      setCepLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNeighborhoodId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      clearCart();
    }, 2200);
  }

  if (items.length === 0 && step !== "success") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center gap-6 pt-24 px-6">
        <p className="text-2xl title">Seu carrinho está vazio</p>
        <Link href="/cardapio" className="bg-primary text-primary-foreground px-8 py-4 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
          Ver Cardápio
        </Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center gap-8 px-6 pt-24 pb-24">
        <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <div className="max-w-lg space-y-4">
          <h1 className="text-5xl title text-foreground">Pedido Confirmado!</h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Seu bolo está no forno! 🎂<br />Entrega prevista para <strong>{selectedNeighborhoodId === 'outro' ? customNeighborhood : selectedNeighborhood?.name} ({selectedNeighborhoodId === 'outro' ? form.city : selectedNeighborhood?.city})</strong>.
          </p>
        </div>
        <Link href="/" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-medium cursor-pointer shadow-xl shadow-primary/20">
          Voltar ao início
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/carrinho" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao carrinho
          </Link>
          <h1 className="text-5xl title text-foreground">Finalizar Compra</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-8">
            <fieldset className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
              <legend className="text-xl title text-foreground mb-2 px-1">Dados de Entrega</legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">Nome completo *</label>
                  <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Como deseja ser chamado?"
                    className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>

                <div className="relative">
                  <label htmlFor="cep" className="block text-sm text-muted-foreground mb-2">CEP *</label>
                  <div className="relative">
                    <input id="cep" name="cep" required value={form.cep} onChange={handleChange} placeholder="00000-000"
                      className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                    {cepLoading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-muted-foreground mb-2">WhatsApp/Telefone *</label>
                  <input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="(77) 99999-9999"
                    className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm text-muted-foreground mb-2">Endereço (Rua, Número) *</label>
                  <input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="Rua exemplo, 123"
                    className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>

                {/* City (Editable for custom/other cities) */}
                <div>
                  <label htmlFor="city" className="block text-sm text-muted-foreground mb-2">Cidade *</label>
                  <input id="city" name="city" required value={form.city} onChange={handleChange} placeholder="Ex: Vitória da Conquista"
                    className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                </div>

                {/* Dynamic Neighborhood Selector Grouped by City */}
                <div className="">
                  <label htmlFor="neighborhood-select" className="block text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Bairro de Entrega *
                  </label>
                  <div className="relative">
                    <select id="neighborhood-select" required value={selectedNeighborhoodId} onChange={(e) => setSelectedNeighborhoodId(e.target.value)}
                      className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none cursor-pointer pr-10">
                      <option value="">Selecione o bairro...</option>
                      {Object.entries(groupedNeighborhoods).map(([city, neighbors]) => (
                        <optgroup key={city} label={city}>
                          {neighbors.map(n => (
                            <option key={n.id} value={n.id}>
                              {n.name} {n.id !== 'outro' && `— R$ ${n.fee.toFixed(2).replace(".", ",")}`}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {selectedNeighborhoodId === "outro" && (
                  <div className="sm:col-span-2 animate-in slide-in-from-top-1">
                    <label htmlFor="custom-neighborhood" className="block text-sm text-muted-foreground mb-2">Digite seu bairro *</label>
                    <input id="custom-neighborhood" required value={customNeighborhood} onChange={(e) => setCustomNeighborhood(e.target.value)}
                      placeholder="Nome do bairro" className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Payment Method */}
            <fieldset className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
              <legend className="text-xl title text-foreground mb-2 px-1">Pagamento</legend>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "pix" as PaymentMethod, label: "Pix", icon: <QrCode className="w-5 h-5" /> },
                  { id: "credit" as PaymentMethod, label: "Crédito", icon: <CreditCard className="w-5 h-5" /> },
                  { id: "debit" as PaymentMethod, label: "Débito", icon: <Landmark className="w-5 h-5" /> },
                ].map((m) => (
                  <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === m.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    {m.icon}
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <div className="h-fit lg:sticky lg:top-32 space-y-4">
            <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
              <h2 className="text-xl title text-foreground mb-6">Resumo do Pedido</h2>
              <div className="border-t border-border/50 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrega</span>
                  {shipping === null ? (
                    <span className="text-muted-foreground/60 italic text-xs">Selecione o bairro</span>
                  ) : (
                    <span className={shipping === 0 ? "text-green-600 font-bold" : "text-foreground font-medium"}>
                      {shipping === 0 ? "Grátis 🎉" : shipping.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/40 mt-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl title text-primary">
                    {(total || totalPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !selectedNeighborhoodId || (selectedNeighborhoodId === 'outro' && !customNeighborhood)}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-medium text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-primary/20 disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Confirmar Pedido</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

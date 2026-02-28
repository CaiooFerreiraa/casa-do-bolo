"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { type Product } from "@/lib/cart-context";
import { type Neighborhood, ZONE_LABELS } from "@/lib/neighborhoods";
import { useSession, signOut } from "next-auth/react";
import {
  Package, LogOut, Plus, Pencil, Trash2,
  X, Save, ChevronRight, ImageIcon, Home,
  MapPin, Truck, ChevronDown, Globe, Settings2, FolderPlus, Tags, Upload, Layers
} from "lucide-react";

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  price: 0,
  priceFormatted: "",
  image: "",
  category: "classicos",
  badge: "",
  description: "",
};

const EMPTY_NEIGHBOR: Omit<Neighborhood, "id"> = {
  name: "",
  city: "",
  fee: 0,
  zone: "media",
};

export default function AdminDashboard() {
  const {
    products, addProduct, updateProduct, deleteProduct,
    neighborhoods, addNeighborhood, updateNeighborhood, deleteNeighborhood,
    cities, addCity, updateCity, deleteCity,
    categories, addCategory, deleteCategory
  } = useAdmin();

  const router = useRouter();
  const { status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"products" | "shipping" | "settings">("products");
  const [modal, setModal] = useState<"closed" | "add" | "edit" | "add_neighbor" | "edit_neighbor" | "add_city" | "edit_city" | "add_cat">("closed");

  // States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [editingNeighbor, setEditingNeighbor] = useState<Neighborhood | null>(null);
  const [neighborForm, setNeighborForm] = useState<Omit<Neighborhood, "id">>(EMPTY_NEIGHBOR);
  const [editingCityName, setEditingCityName] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Grouped logic - Neighborhoods
  const groupedNeighborhoods = neighborhoods.reduce((acc, n) => {
    if (!acc[n.city]) acc[n.city] = [];
    acc[n.city].push(n);
    return acc;
  }, {} as Record<string, Neighborhood[]>);

  // Grouped logic - Products
  const groupedProducts = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin");
  }, [status, router]);

  // Expand all groups by default on load
  useEffect(() => {
    if (activeTab === 'products') {
      setExpandedGroups(categories.map(c => c.id));
    } else if (activeTab === 'shipping') {
      setExpandedGroups(cities);
    }
  }, [activeTab, categories, cities]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleGroup(id: string) {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  // File Upload Logic
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Imagem muito grande! Tente uma imagem menor que 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Modals
  function closeModal() {
    setModal("closed");
    setEditingProduct(null);
    setEditingNeighbor(null);
    setEditingCityName("");
    setNewCityName("");
    setNewCatName("");
    setSaving(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (modal === "add") addProduct(form);
      else if (modal === "edit" && editingProduct) updateProduct({ ...form, id: editingProduct.id });
      else if (modal === "add_neighbor") addNeighborhood(neighborForm);
      else if (modal === "edit_neighbor" && editingNeighbor) updateNeighborhood({ ...neighborForm, id: editingNeighbor.id });
      else if (modal === "add_city") addCity(newCityName);
      else if (modal === "edit_city") updateCity(editingCityName, newCityName);
      else if (modal === "add_cat") addCategory(newCatName);

      showToast("Sucesso!");
      closeModal();
    }, 500);
  }

  if (status !== "authenticated") return null;

  return (
    <div className="min-h-screen flex" style={{ background: "#1a1410", color: "#F5F1EE" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] px-5 py-3.5 rounded-2xl text-sm font-medium shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-2"
          style={{ background: "#D7A684", color: "#2D2723" }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r flex flex-col sticky top-0 h-screen" style={{ background: "#2D2723", borderColor: "#4E4038" }}>
        <div className="p-8 border-b" style={{ borderColor: "#4E4038" }}>
          <h2 className="text-2xl font-serif font-semibold text-[#D7A684]">Painel Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<Package />} label="Cardápio" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <NavItem icon={<Truck />} label="Entregas" active={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')} />
          <NavItem icon={<Settings2 />} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div className="pt-8 mb-2 px-3 text-[10px] uppercase tracking-widest opacity-30">Site</div>
          <Link href="/" className="px-3 py-2 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"><Home className="w-4 h-4" /> Voltar à Loja</Link>
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "#4E4038" }}>
          <button onClick={() => signOut()} className="cursor-pointer w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /> Sair</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-8 py-6 border-b flex items-center justify-between" style={{ background: "#1a1410", borderColor: "#4E4038" }}>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              {activeTab === 'products' ? "Produtos por Categoria" : activeTab === 'shipping' ? "Bairros por Cidade" : "Ajustes Globais"}
            </h1>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'products') { setForm(EMPTY_FORM); setModal("add"); }
              else if (activeTab === 'shipping') { setNeighborForm({ ...EMPTY_NEIGHBOR, city: cities[0] || "" }); setModal("add_neighbor"); }
              else { setModal("add_city"); }
            }}
            className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-full text-base font-bold bg-[#D7A684] text-[#2D2723] hover:opacity-90 shadow-xl shadow-[#D7A684]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'products' ? 'Novo Produto' : activeTab === 'shipping' ? 'Novo Bairro' : 'Nova Pasta'}
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "products" && (
            <div className="space-y-6">
              {categories.filter(c => c.id !== 'todos').map(cat => (
                <div key={cat.id} className="rounded-3xl border overflow-hidden transition-all" style={{ borderColor: "#4E4038", background: expandedGroups.includes(cat.id) ? "#2D2723" : "transparent" }}>
                  <button onClick={() => toggleGroup(cat.id)} className="w-full flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-5 text-left">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#413833] shadow-inner"><Layers className="w-6 h-6 text-[#D7A684]" /></div>
                      <div><h3 className="font-serif font-bold text-xl">{cat.label}</h3><p className="text-xs opacity-40">{(groupedProducts[cat.id] || []).length} itens no cardápio</p></div>
                    </div>
                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expandedGroups.includes(cat.id) ? "rotate-180" : "opacity-40"}`} />
                  </button>

                  {expandedGroups.includes(cat.id) && (
                    <div className="p-6 bg-[#1a1410]/40 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 border-t border-[#4E4038] animate-in slide-in-from-top-2">
                      {(groupedProducts[cat.id] || []).map(p => (
                        <div key={p.id} className="p-4 rounded-3xl border bg-[#1a1410] flex flex-col group relative" style={{ borderColor: "#4E4038" }}>
                          <div className="aspect-square rounded-2xl overflow-hidden bg-[#2D2723] mb-4 border border-white/5 relative">
                            {p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : <ImageIcon className="w-full h-full p-8 opacity-10" />}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setForm(p); setEditingProduct(p); setModal("edit") }} className="cursor-pointer p-2 bg-black/60 backdrop-blur-md rounded-lg hover:text-[#D7A684] text-white"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteProduct(p.id)} className="cursor-pointer p-2 bg-black/60 backdrop-blur-md rounded-lg hover:text-red-400 text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm leading-tight mb-1">{p.name}</h4>
                            <p className="text-[#D7A684] font-serif text-lg">{p.priceFormatted}</p>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setForm({ ...EMPTY_FORM, category: cat.id }); setModal("add") }} className="aspect-square rounded-3xl border-2 border-dashed border-[#4E4038] flex flex-col items-center justify-center gap-3 opacity-30 hover:opacity-100 transition-all cursor-pointer hover:bg-white/5 hover:border-[#D7A684]/40">
                        <Plus className="w-8 h-8" /> <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7A684]">Novo {cat.label}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              {cities.map(city => (
                <div key={city} className="rounded-3xl border overflow-hidden transition-all" style={{ borderColor: "#4E4038", background: expandedGroups.includes(city) ? "#2D2723" : "transparent" }}>
                  <button onClick={() => toggleGroup(city)} className="w-full flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-5 text-left">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#413833]"><Globe className="w-6 h-6 text-[#D7A684]" /></div>
                      <div><h3 className="font-serif font-bold text-xl">{city}</h3><p className="text-xs opacity-40">{(groupedNeighborhoods[city] || []).length} bairros</p></div>
                    </div>
                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expandedGroups.includes(city) ? "rotate-180" : "opacity-40"}`} />
                  </button>
                  {expandedGroups.includes(city) && (
                    <div className="p-6 bg-[#1a1410]/40 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-[#4E4038] animate-in slide-in-from-top-2">
                      {(groupedNeighborhoods[city] || []).map(n => (
                        <div key={n.id} className="p-6 rounded-2xl border bg-[#1a1410] flex flex-col justify-between group relative" style={{ borderColor: "#4E4038" }}>
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-bold">{n.name}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setNeighborForm(n); setEditingNeighbor(n); setModal("edit_neighbor") }} className="cursor-pointer p-1.5 hover:bg-white/5 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => deleteNeighborhood(n.id)} className="cursor-pointer p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[9px] uppercase font-bold text-[#BCAAA4]">{ZONE_LABELS[n.zone]}</span>
                            <span className="text-[#D7A684] font-serif font-bold text-lg">R$ {n.fee.toFixed(2).replace(".", ",")}</span>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setNeighborForm({ ...EMPTY_NEIGHBOR, city }); setModal("add_neighbor") }} className="p-8 rounded-2xl border-2 border-dashed border-[#4E4038] flex flex-col items-center justify-center gap-3 opacity-30 hover:opacity-100 transition-all cursor-pointer">
                        <Plus className="w-6 h-6" /> <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7A684]">Novo Bairro</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid md:grid-cols-2 gap-12">
              {/* Same Settings UI for Cities/Cats */}
              <div className="space-y-8">
                <h3 className="text-2xl font-serif font-bold flex items-center gap-4 text-[#D7A684]"><Globe className="w-6 h-6" /> Gerenciar Cidades</h3>
                <div className="space-y-3">
                  {cities.map(city => (
                    <div key={city} className="flex items-center justify-between p-5 rounded-2xl bg-[#2D2723] border border-[#4E4038] group">
                      <span className="font-bold">{city}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCityName(city); setNewCityName(city); setModal("edit_city") }} className="cursor-pointer p-2.5 hover:bg-white/5 rounded-xl"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteCity(city)} className="cursor-pointer p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setModal("add_city")} className="w-full py-5 rounded-2xl border-2 border-dashed border-[#4E4038] flex items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-all cursor-pointer"><Plus className="w-5 h-5" /> <span className="font-bold text-sm">Nova Cidade</span></button>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-2xl font-serif font-bold flex items-center gap-4 text-[#D7A684]"><Tags className="w-6 h-6" /> Gerenciar Categorias</h3>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#2D2723] border border-[#4E4038] group">
                      <span className="font-bold">{cat.label}</span>
                      {cat.id !== 'todos' && <button onClick={() => deleteCategory(cat.id)} className="cursor-pointer p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  ))}
                  <button onClick={() => setModal("add_cat")} className="w-full py-5 rounded-2xl border-2 border-dashed border-[#4E4038] flex items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-all cursor-pointer"><Plus className="w-5 h-5" /> <span className="font-bold text-sm">Nova Categoria</span></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FORM MODAL (PRODUCT) */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={closeModal} />
          <form onSubmit={handleSave} className="relative w-full max-w-2xl rounded-[40px] border border-[#4E4038] bg-[#2D2723] shadow-3xl overflow-hidden p-10 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-serif font-bold text-[#D7A684] mb-8">{modal === 'add' ? 'Criar Novo Bolo' : 'Editar Produto'}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-3xl border-2 border-dashed border-[#4E4038] bg-[#1a1410] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-[#D7A684]/50 transition-all">
                  {form.image ? <><Image src={form.image} alt="Preview" fill className="object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="w-8 h-8 text-white" /></div></> : <><div className="w-16 h-16 rounded-full bg-[#2D2723] flex items-center justify-center mb-4"><Upload className="w-6 h-6 text-[#D7A684]" /></div><p className="text-xs font-bold opacity-40">Adicionar Foto</p></>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
              <div className="space-y-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Bolo de Brigadeiro" className="w-full px-5 py-4 bg-[#1a1410] rounded-2xl outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" step="0.01" required value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value), priceFormatted: `R$ ${parseFloat(e.target.value).toFixed(2).replace('.', ',')}` })} placeholder="Preço" className="w-full px-5 py-4 bg-[#1a1410] rounded-2xl outline-none" />
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-5 py-4 bg-[#1a1410] rounded-2xl outline-none cursor-pointer">
                    {categories.filter(c => c.id !== 'todos').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição do bolo..." className="w-full px-5 py-4 bg-[#1a1410] rounded-2xl outline-none resize-none" />
              </div>
            </div>
            <button type="submit" className="w-full mt-10 py-5 rounded-2xl bg-[#D7A684] text-[#2D2723] font-bold shadow-xl shadow-[#D7A684]/20 hover:opacity-90 transition-all cursor-pointer">
              {saving ? 'Processando...' : 'Confirmar Tudo'}
            </button>
          </form>
        </div>
      )}

      {/* FORM MODAL (OTHERS) */}
      {(modal === 'add_city' || modal === 'edit_city' || modal === 'add_cat' || modal === 'add_neighbor' || modal === 'edit_neighbor') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeModal} />
          <form onSubmit={handleSave} className="relative w-full max-w-lg rounded-3xl border border-[#4E4038] bg-[#2D2723] shadow-2xl p-8 animate-in zoom-in-95">
            <h2 className="text-xl font-serif font-bold mb-8 text-[#D7A684]">Configuração</h2>
            <div className="space-y-5">
              {(modal.includes("city") || modal === "add_cat") && (
                <input required value={modal.includes("city") ? newCityName : newCatName} onChange={(e) => modal.includes("city") ? setNewCityName(e.target.value) : setNewCatName(e.target.value)} className="w-full px-4 py-3.5 bg-[#413833] rounded-xl outline-none" placeholder="Digite o nome aqui..." />
              )}
              {modal.includes("neighbor") && (
                <>
                  <select required value={neighborForm.city} onChange={(e) => setNeighborForm({ ...neighborForm, city: e.target.value })} className="w-full px-4 py-3.5 bg-[#413833] rounded-xl"><option value="">Selecione a Cidade</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
                  <input required value={neighborForm.name} onChange={(e) => setNeighborForm({ ...neighborForm, name: e.target.value })} className="w-full px-4 py-3.5 bg-[#413833] rounded-xl outline-none" placeholder="Nome do Bairro" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.5" required value={neighborForm.fee} onChange={(e) => setNeighborForm({ ...neighborForm, fee: parseFloat(e.target.value) })} className="w-full px-4 py-3.5 bg-[#413833] rounded-xl" />
                    <select value={neighborForm.zone} onChange={(e) => setNeighborForm({ ...neighborForm, zone: e.target.value as any })} className="w-full px-4 py-3.5 bg-[#413833] rounded-xl">
                      {Object.entries(ZONE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="w-full mt-10 py-4 rounded-2xl bg-[#D7A684] text-[#2D2723] font-bold hover:opacity-90 transition-all cursor-pointer">Confirmar</button>
          </form>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full px-4 py-3.5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${active ? 'bg-[#4E4038] text-[#D7A684] shadow-xl' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}>
      <span className="scale-110">{icon}</span>
      <span className="text-sm font-bold tracking-wide">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );
}

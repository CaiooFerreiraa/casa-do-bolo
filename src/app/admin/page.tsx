"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, router]);

  if (!mounted) return null;
  if (status === "authenticated") return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Senha incorreta. Tente novamente.");
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1410] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-primary" style={{ color: "#D7A684" }} />
          </div>
          <h1 className="text-4xl font-serif font-semibold text-white tracking-tight">
            Painel Admin
          </h1>
          <p className="text-sm" style={{ color: "#BCAAA4" }}>
            Casa do Bolo — Acesso restrito
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border p-8 space-y-6"
          style={{ background: "#2D2723", borderColor: "#4E4038" }}
        >
          <div>
            <label htmlFor="admin-password" className="block text-sm mb-2" style={{ color: "#BCAAA4" }}>
              Senha de Administrador
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-white/30 pr-12 focus:outline-none focus:ring-2 transition-shadow"
                style={{ background: "#413833", borderColor: "#4E4038", outlineColor: "#D7A684" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded-lg transition-colors"
                style={{ color: "#BCAAA4" }}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-medium text-base flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "#D7A684", color: "#2D2723" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#2D2723]/40 border-t-[#2D2723] rounded-full animate-spin" />
            ) : (
              "Entrar no Painel"
            )}
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "#BCAAA4" }}>
          Área exclusiva para administradores.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMerchant, type MerchantProfile } from "@/contexts/MerchantContext";

interface LoginFormProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

export function LoginForm({ onLogin, onGoToRegister }: LoginFormProps) {
  const { dispatch, toast } = useMerchant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    if (!email.includes("@") || password.length < 6) {
      setError("E-mail ou senha invalidos");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const profile: MerchantProfile = {
        id: `MERC-${Date.now()}`,
        ownerName: "Comerciante iDrink",
        storeName: "Adega Premium",
        email,
        phone: "(11) 99999-9999",
        docType: "cnpj",
        doc: "12.345.678/0001-90",
        rating: parseFloat((3 + Math.random() * 1.2).toFixed(1)),
        storeDescription: "A melhor selecao de bebidas da regiao",
        storeBanner: null,
        storeLogo: null,
        openTime: "08:00",
        closeTime: "22:00",
        deliveryTime: "30-45 min",
        deliveryRadius: 5,
        pixKeyType: "",
        pixKey: "",
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "LOGIN", payload: profile });
      toast("Login realizado com sucesso!", "success");
      setLoading(false);
      onLogin();
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#9999aa] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </Link>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6 shadow-[0_0_60px_rgba(230,57,70,0.06)] md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e63946]/10">
              <LogIn className="h-6 w-6 text-[#e63946]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Entrar como Parceiro</h1>
              <p className="text-sm text-[#9999aa]">Acesse seu painel</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-10 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9999aa] hover:text-white"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-center text-xs text-[#e63946]">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-full bg-[#e63946] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>

            <p className="text-center text-sm text-[#9999aa]">
              Nao tem conta?{" "}
              <button
                onClick={onGoToRegister}
                className="font-medium text-[#00b4d8] hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

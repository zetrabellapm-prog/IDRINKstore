"use client";

import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useMerchant, type MerchantProfile } from "@/contexts/MerchantContext";

interface RegisterFormProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskCNPJ(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function RegisterForm({ onRegister, onGoToLogin }: RegisterFormProps) {
  const { dispatch, toast } = useMerchant();
  const [docType, setDocType] = useState<"cpf" | "cnpj">("cpf");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    ownerName: "",
    storeName: "",
    email: "",
    phone: "",
    doc: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.ownerName.trim()) e.ownerName = "Nome obrigatorio";
    if (!form.storeName.trim()) e.storeName = "Nome da loja obrigatorio";
    if (!form.email.includes("@")) e.email = "E-mail invalido";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone invalido";
    const docDigits = form.doc.replace(/\D/g, "");
    if (docType === "cpf" && docDigits.length !== 11) e.doc = "CPF invalido";
    if (docType === "cnpj" && docDigits.length !== 14) e.doc = "CNPJ invalido";
    if (form.password.length < 6) e.password = "Minimo 6 caracteres";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Senhas nao coincidem";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const profile: MerchantProfile = {
        id: `MERC-${Date.now()}`,
        ownerName: form.ownerName,
        storeName: form.storeName,
        email: form.email,
        phone: form.phone,
        docType,
        doc: form.doc,
        rating: parseFloat((3 + Math.random() * 1.2).toFixed(1)),
        storeDescription: "",
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
      toast("Conta criada com sucesso!", "success");
      setLoading(false);
      onRegister();
    }, 1200);
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link
          href="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#9999aa] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </Link>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6 shadow-[0_0_60px_rgba(230,57,70,0.06)] md:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e63946]/10">
              <Store className="h-6 w-6 text-[#e63946]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Cadastro de Parceiro</h1>
              <p className="text-sm text-[#9999aa]">
                Crie sua conta e comece a vender
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Owner Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Nome completo do responsavel
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.ownerName && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.ownerName}</p>
              )}
            </div>

            {/* Store Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Nome do estabelecimento
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="Nome da sua loja"
                />
              </div>
              {errors.storeName && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.storeName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", maskPhone(e.target.value))}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.phone}</p>
              )}
            </div>

            {/* Doc type toggle + input */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Documento
              </label>
              <div className="mb-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDocType("cpf");
                    setForm((p) => ({ ...p, doc: "" }));
                  }}
                  className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                    docType === "cpf"
                      ? "bg-[#e63946] text-white"
                      : "border border-[#2a2a3a] bg-[#0a0a0f] text-[#9999aa] hover:text-white"
                  }`}
                >
                  CPF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDocType("cnpj");
                    setForm((p) => ({ ...p, doc: "" }));
                  }}
                  className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                    docType === "cnpj"
                      ? "bg-[#e63946] text-white"
                      : "border border-[#2a2a3a] bg-[#0a0a0f] text-[#9999aa] hover:text-white"
                  }`}
                >
                  CNPJ
                </button>
              </div>
              <input
                type="text"
                value={form.doc}
                onChange={(e) =>
                  handleChange(
                    "doc",
                    docType === "cpf"
                      ? maskCPF(e.target.value)
                      : maskCNPJ(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                placeholder={docType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
              />
              {errors.doc && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.doc}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-10 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="Minimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9999aa] hover:text-white"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-3 pl-10 pr-10 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                  placeholder="Repita sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9999aa] hover:text-white"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-[#e63946]">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#e63946] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Criando conta...
                </span>
              ) : (
                "Criar minha conta de parceiro"
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-[#9999aa]">
              Ja tem conta?{" "}
              <button
                onClick={onGoToLogin}
                className="font-medium text-[#00b4d8] hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

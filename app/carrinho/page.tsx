"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft,
  MapPin, CreditCard, QrCode, Banknote, Ticket, ChevronDown,
  ChevronUp, User, Phone, Copy, Check, Loader2, Truck
} from "lucide-react";

// --- Input masks ---
function maskCep(v: string) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}
function maskCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function maskExpiry(v: string) {
  return v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
}

// --- Coupons ---
const coupons: Record<string, { type: "percent" | "fixed" | "frete"; value: number }> = {
  IDRINK10: { type: "percent", value: 10 },
  BEMVINDO: { type: "fixed", value: 5 },
  FRETEGRATIS: { type: "frete", value: 0 },
};

type PaymentMethod = "pix" | "card" | "cash" | "vale";

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
function Accordion({ title, icon, open, onToggle, children }: AccordionProps) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#2a2a3a] bg-[#12121a]">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ea1d2c]/10">{icon}</div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-[#9999aa]" /> : <ChevronDown className="h-5 w-5 text-[#9999aa]" />}
      </button>
      {open && <div className="border-t border-[#2a2a3a] p-5">{children}</div>}
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, increaseQuantity, decreaseQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  // Accordion sections
  const [openSections, setOpenSections] = useState({ address: true, receiver: false, payment: false, coupon: false });
  const toggleSection = (key: keyof typeof openSections) => setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  // Address
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [addressLabel, setAddressLabel] = useState<"home" | "work" | "other">("home");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // Receiver
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [isSelf, setIsSelf] = useState(false);
  const [noContact, setNoContact] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [installments, setInstallments] = useState(1);
  const [changeAmount, setChangeAmount] = useState("");
  const [valeBrand, setValeBrand] = useState("alelo");
  const [pixCopied, setPixCopied] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  // Submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch address from ViaCEP
  const fetchCep = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP nao encontrado");
      } else {
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(`${data.localidade}/${data.uf}` || "");
      }
    } catch {
      setCepError("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  }, []);

  const handleCepChange = (v: string) => {
    const masked = maskCep(v);
    setCep(masked);
    if (masked.replace(/\D/g, "").length === 8) fetchCep(masked);
  };

  // Coupon logic
  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    if (coupons[code]) {
      setAppliedCoupon(code);
    } else {
      setCouponError("Cupom invalido");
    }
  };

  // Totals
  const deliveryFee = totalPrice >= 80 ? 0 : 5.99;
  let discount = 0;
  let freeDelivery = false;
  if (appliedCoupon && coupons[appliedCoupon]) {
    const c = coupons[appliedCoupon];
    if (c.type === "percent") discount = totalPrice * (c.value / 100);
    else if (c.type === "fixed") discount = c.value;
    else if (c.type === "frete") freeDelivery = true;
  }
  const finalDelivery = freeDelivery ? 0 : deliveryFee;
  const total = totalPrice - discount + finalDelivery;

  const pixKey = `iDrink-PIX-${Date.now()}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const changeValue = parseFloat(changeAmount) || 0;
  const changeReturn = changeValue > total ? changeValue - total : 0;

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));

    const order = {
      id: `#iDK-${Math.floor(1000 + Math.random() * 9000)}`,
      storeName: items[0]?.product.storeId
        ? items[0].product.storeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Loja",
      storeId: items[0]?.product.storeId || "",
      items: items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price, id: i.product.id })),
      total,
      address: `${street}, ${number}${complement ? ` - ${complement}` : ""} - ${neighborhood}, ${city}`,
      paymentMethod,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("idrink_orders") || "[]");
    localStorage.setItem("idrink_orders", JSON.stringify([order, ...existing]));
    clearCart();
    setIsSubmitting(false);
    router.push(`/pedidos/confirmacao?id=${encodeURIComponent(order.id)}`);
  };

  // --- EMPTY CART ---
  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#12121a]">
          <ShoppingBag className="h-10 w-10 text-[#9999aa]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Seu carrinho esta vazio</h1>
        <p className="mt-2 text-[#9999aa]">Adicione produtos ao seu carrinho para continuar</p>
        <Link
          href="/home"
          className="mt-6 inline-flex items-center gap-2 rounded-[50px] bg-[#ea1d2c] px-6 py-3 font-semibold text-white transition-all hover:opacity-90 red-glow"
        >
          Explorar Lojas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const storeName = items[0]?.product.storeId
    ? items[0].product.storeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/home" className="mb-2 inline-flex items-center gap-2 text-sm text-[#9999aa] hover:text-[#ea1d2c]">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </Link>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Seu Carrinho</h1>
          <p className="mt-1 text-sm text-[#9999aa]">{storeName} · {totalItems} {totalItems === 1 ? "item" : "itens"}</p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 rounded-xl border border-[#2a2a3a] px-4 py-2 text-sm text-[#9999aa] transition-colors hover:border-[#ea1d2c]/50 hover:text-[#ea1d2c]"
        >
          <Trash2 className="h-4 w-4" /> Esvaziar
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* LEFT COLUMN - Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="group flex overflow-hidden rounded-[14px] border border-[#2a2a3a] bg-[#12121a] transition-all hover:border-[#2a2a3a]">
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center bg-gradient-to-br from-[#1a1a26] to-[#12121a] text-2xl font-bold text-white/5 sm:h-28 sm:w-28">
                {item.product.name.charAt(0)}
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-semibold text-white line-clamp-1">{item.product.name}</h3>
                  <p className="mt-0.5 text-sm text-[#9999aa] line-clamp-1">{item.product.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#ea1d2c]">{formatCurrency(item.product.price * item.quantity)}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQuantity(item.product.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a3a] text-white hover:border-[#ea1d2c]/50" aria-label="Diminuir">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.product.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ea1d2c] text-white hover:opacity-90" aria-label="Aumentar">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => removeItem(item.product.id)} className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-[#9999aa] opacity-0 transition-opacity hover:text-[#ea1d2c] group-hover:opacity-100" aria-label="Remover">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link href={`/store/${items[0]?.product.storeId || ""}`} className="mt-2 inline-flex items-center gap-2 text-sm text-[#00b4d8] hover:underline">
            <Plus className="h-4 w-4" /> Adicionar mais itens
          </Link>
        </div>

        {/* RIGHT COLUMN - Checkout */}
        <div className="w-full space-y-4 lg:w-[420px]">
          {/* Address */}
          <Accordion title="Endereco de Entrega" icon={<MapPin className="h-4 w-4 text-[#ea1d2c]" />} open={openSections.address} onToggle={() => toggleSection("address")}>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-[#9999aa]">CEP</label>
                <div className="relative">
                  <input value={cep} onChange={(e) => handleCepChange(e.target.value)} placeholder="00000-000" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 pl-4 pr-10 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  {cepLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#ea1d2c]" />}
                </div>
                {cepError && <p className="mt-1 text-xs text-[#ea1d2c]">{cepError}</p>}
              </div>
              {street && (
                <div className="animate-fade-in space-y-3">
                  <div>
                    <label className="mb-1 block text-sm text-[#9999aa]">Rua</label>
                    <input value={street} readOnly className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white/70" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#9999aa]">Bairro</label>
                    <input value={neighborhood} readOnly className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white/70" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#9999aa]">Cidade</label>
                    <input value={city} readOnly className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white/70" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-sm text-[#9999aa]">Numero</label>
                      <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="123" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-sm text-[#9999aa]">Complemento</label>
                      <input value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, bloco..." className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#9999aa]">Ponto de referencia</label>
                    <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Proximo ao..." className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  </div>
                  <div className="flex gap-2">
                    {(["home", "work", "other"] as const).map((l) => (
                      <button key={l} type="button" onClick={() => setAddressLabel(l)} className={`rounded-full px-3 py-1.5 text-sm transition-all ${addressLabel === l ? "bg-[#ea1d2c] text-white" : "border border-[#2a2a3a] text-[#9999aa] hover:border-[#ea1d2c]/30"}`}>
                        {l === "home" ? "Casa" : l === "work" ? "Trabalho" : "Outro"}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#00b4d8]/10 px-3 py-2 text-sm text-[#00b4d8]">
                    <Truck className="h-4 w-4" />
                    <span>Entrega estimada: 30-45 min</span>
                  </div>
                </div>
              )}
            </div>
          </Accordion>

          {/* Receiver */}
          <Accordion title="Dados de Quem Vai Receber" icon={<User className="h-4 w-4 text-[#ea1d2c]" />} open={openSections.receiver} onToggle={() => toggleSection("receiver")}>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={isSelf} onChange={(e) => { setIsSelf(e.target.checked); if (e.target.checked) { const n = localStorage.getItem("idrink_user_name") || ""; setReceiverName(n); } }} className="accent-[#ea1d2c]" />
                Sou eu mesmo
              </label>
              <div>
                <label className="mb-1 block text-sm text-[#9999aa]">Nome completo</label>
                <input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Nome de quem vai receber" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#9999aa]">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
                  <input value={receiverPhone} onChange={(e) => setReceiverPhone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#9999aa]">
                <input type="checkbox" checked={noContact} onChange={(e) => setNoContact(e.target.checked)} className="accent-[#ea1d2c]" />
                Deixar na portaria / Sem contato
              </label>
            </div>
          </Accordion>

          {/* Payment */}
          <Accordion title="Forma de Pagamento" icon={<CreditCard className="h-4 w-4 text-[#ea1d2c]" />} open={openSections.payment} onToggle={() => toggleSection("payment")}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "pix" as const, label: "Pix", icon: <QrCode className="h-5 w-5" />, accent: "border-green-500 bg-green-500/10" },
                  { key: "card" as const, label: "Cartao", icon: <CreditCard className="h-5 w-5" /> },
                  { key: "cash" as const, label: "Dinheiro", icon: <Banknote className="h-5 w-5" /> },
                  { key: "vale" as const, label: "Vale Refeicao", icon: <Ticket className="h-5 w-5" /> },
                ]).map((opt) => (
                  <button key={opt.key} type="button" onClick={() => setPaymentMethod(opt.key)} className={`flex flex-col items-center gap-1.5 rounded-[14px] border p-3 transition-all ${paymentMethod === opt.key ? (opt.accent || "border-[#ea1d2c] bg-[#ea1d2c]/10") : "border-[#2a2a3a] hover:border-[#ea1d2c]/30"}`}>
                    <span className={paymentMethod === opt.key ? (opt.key === "pix" ? "text-green-400" : "text-[#ea1d2c]") : "text-[#9999aa]"}>{opt.icon}</span>
                    <span className={`text-xs font-medium ${paymentMethod === opt.key ? (opt.key === "pix" ? "text-green-400" : "text-[#ea1d2c]") : "text-[#9999aa]"}`}>{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Pix */}
              {paymentMethod === "pix" && (
                <div className="animate-fade-in space-y-3 rounded-[14px] border border-green-500/20 bg-green-500/5 p-4 text-center">
                  <p className="text-sm text-green-400">Aprovacao imediata - Sem taxas</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="QR Code Pix" className="mx-auto rounded-xl" width={160} height={160} />
                  <p className="break-all text-xs text-[#9999aa]">{pixKey}</p>
                  <button type="button" onClick={handleCopyPix} className={`mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${pixCopied ? "bg-green-500/20 text-green-400" : "bg-[#2a2a3a] text-white hover:bg-[#2a2a3a]/80"}`}>
                    {pixCopied ? <><Check className="h-4 w-4" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar codigo Pix</>}
                  </button>
                </div>
              )}

              {/* Card */}
              {paymentMethod === "card" && (
                <div className="animate-fade-in space-y-3">
                  <div className="flex gap-2">
                    {(["credit", "debit"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setCardType(t)} className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${cardType === t ? "bg-[#ea1d2c] text-white" : "border border-[#2a2a3a] text-[#9999aa]"}`}>
                        {t === "credit" ? "Credito" : "Debito"}
                      </button>
                    ))}
                  </div>
                  <input value={cardNumber} onChange={(e) => setCardNumber(maskCard(e.target.value))} placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Nome no cartao" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  <div className="flex gap-3">
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(maskExpiry(e.target.value))} placeholder="MM/AA" className="flex-1 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" className="w-24 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  </div>
                  {cardType === "credit" && (
                    <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white focus:border-[#ea1d2c]/50 focus:outline-none">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n}x {formatCurrency(total / n)} {n === 1 ? "sem juros" : ""}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Cash */}
              {paymentMethod === "cash" && (
                <div className="animate-fade-in space-y-3">
                  <p className="text-sm text-[#9999aa]">Precisa de troco?</p>
                  <input value={changeAmount} onChange={(e) => setChangeAmount(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Troco para R$___" className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  {changeReturn > 0 && <p className="text-sm text-green-400">Seu troco: {formatCurrency(changeReturn)}</p>}
                </div>
              )}

              {/* Vale */}
              {paymentMethod === "vale" && (
                <div className="animate-fade-in space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {["alelo", "ticket", "sodexo", "vr"].map((b) => (
                      <button key={b} type="button" onClick={() => setValeBrand(b)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${valeBrand === b ? "bg-[#ea1d2c] text-white" : "border border-[#2a2a3a] text-[#9999aa]"}`}>
                        {b.charAt(0).toUpperCase() + b.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Accordion>

          {/* Coupon */}
          <Accordion title="Cupom de Desconto" icon={<Ticket className="h-4 w-4 text-[#ea1d2c]" />} open={openSections.coupon} onToggle={() => toggleSection("coupon")}>
            <div className="space-y-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-green-500/10 px-4 py-3">
                  <span className="text-sm font-medium text-green-400">
                    Cupom aplicado! Voce economizou {discount > 0 ? formatCurrency(discount) : "o frete"}
                  </span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-xs text-[#9999aa] hover:text-[#ea1d2c]">Remover</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Codigo do cupom" className="flex-1 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />
                  <button onClick={handleApplyCoupon} className="rounded-xl bg-[#ea1d2c] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Aplicar</button>
                </div>
              )}
              {couponError && <p className="text-xs text-[#ea1d2c]">{couponError}</p>}
            </div>
          </Accordion>

          {/* Summary (sticky) */}
          <div className="rounded-[14px] border border-[#2a2a3a] bg-[#12121a] p-5 lg:sticky lg:top-20">
            <h3 className="mb-4 font-semibold text-white">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#9999aa]">
                <span>Subtotal dos itens</span>
                <span className="text-white">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[#9999aa]">
                <span>Taxa de entrega</span>
                <span className={finalDelivery === 0 ? "text-green-400" : "text-white"}>{finalDelivery === 0 ? "GRATIS" : formatCurrency(finalDelivery)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto cupom</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="border-t border-[#2a2a3a] pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#ea1d2c]">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[50px] bg-[#ea1d2c] py-4 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 red-glow"
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processando...</>
              ) : (
                <><ShoppingBag className="h-5 w-5" /> Fazer Pedido · {formatCurrency(total)}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

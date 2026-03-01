"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { CheckCircle2, Clock, ChefHat, Truck, Package, Home } from "lucide-react";

const steps = [
  { label: "Pedido recebido", icon: CheckCircle2 },
  { label: "Loja confirmando...", icon: Clock },
  { label: "Em preparo", icon: ChefHat },
  { label: "Saiu para entrega", icon: Truck },
  { label: "Entregue", icon: Package },
];

function Confetti() {
  const colors = ["#ea1d2c", "#00b4d8", "#22c55e", "#eab308", "#f97316"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="animate-confetti absolute h-3 w-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "#iDK-0000";
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  interface OrderData {
    id: string;
    storeName: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    address: string;
    paymentMethod: string;
  }

  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("idrink_orders") || "[]");
    const found = orders.find((o: OrderData) => o.id === orderId);
    if (found) setOrder(found);
  }, [orderId]);

  // Animate tracker
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(1), 3000);
    const t2 = setTimeout(() => setCurrentStep(2), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Hide confetti after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const paymentLabels: Record<string, string> = {
    pix: "Pix",
    card: "Cartao de Credito/Debito",
    cash: "Dinheiro",
    vale: "Vale Refeicao/Alimentacao",
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {showConfetti && <Confetti />}

      {/* Animated check icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 animate-check-scale">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-white md:text-3xl">Pedido confirmado!</h1>
      <p className="mt-2 text-lg text-[#9999aa]">Numero do pedido: <span className="font-bold text-white">{orderId}</span></p>

      {/* Order summary */}
      {order && (
        <div className="mt-6 w-full rounded-[14px] border border-[#2a2a3a] bg-[#12121a] p-5 text-left">
          <p className="mb-2 text-sm font-medium text-[#9999aa]">
            {order.storeName}
          </p>
          <div className="space-y-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#9999aa]">{item.quantity}x {item.name}</span>
                <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-[#2a2a3a] pt-3 text-sm">
            <span className="font-medium text-[#9999aa]">Total</span>
            <span className="font-bold text-[#ea1d2c]">{formatCurrency(order.total)}</span>
          </div>
          <div className="mt-2 text-xs text-[#9999aa]">
            <p>Endereco: {order.address}</p>
            <p>Pagamento: {paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
          </div>
        </div>
      )}

      {/* Tracker */}
      <div className="mt-8 w-full rounded-[14px] border border-[#2a2a3a] bg-[#12121a] p-5">
        <div className="space-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isDone = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${isDone ? "bg-green-500/20 text-green-500" : "bg-[#2a2a3a] text-[#9999aa]"} ${isCurrent ? "animate-pulse-dot" : ""}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-6 w-0.5 transition-colors duration-500 ${isDone ? "bg-green-500/50" : "bg-[#2a2a3a]"}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium transition-colors duration-500 ${isDone ? "text-white" : "text-[#9999aa]"}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-[#00b4d8]">Chega em ~35 min</p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/pedidos"
          className="flex flex-1 items-center justify-center gap-2 rounded-[50px] bg-[#ea1d2c] py-3 font-semibold text-white transition-all hover:opacity-90 red-glow"
        >
          Acompanhar Pedido
        </Link>
        <Link
          href="/home"
          className="flex flex-1 items-center justify-center gap-2 rounded-[50px] border border-[#2a2a3a] py-3 font-medium text-[#9999aa] transition-all hover:border-[#ea1d2c]/30 hover:text-white"
        >
          <Home className="h-4 w-4" />
          Voltar ao Inicio
        </Link>
      </div>
    </div>
  );
}

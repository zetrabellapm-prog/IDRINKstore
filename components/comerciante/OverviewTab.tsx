"use client";

import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { useMerchant } from "@/contexts/MerchantContext";

const revenueData = [
  { day: "Seg", value: 520 },
  { day: "Ter", value: 680 },
  { day: "Qua", value: 430 },
  { day: "Qui", value: 790 },
  { day: "Sex", value: 910 },
  { day: "Sab", value: 1120 },
  { day: "Dom", value: 830 },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.value));

const statusColors: Record<string, string> = {
  novo: "bg-[#00b4d8]/20 text-[#00b4d8]",
  preparando: "bg-yellow-500/20 text-yellow-400",
  entregue: "bg-emerald-500/20 text-emerald-400",
  cancelado: "bg-[#e63946]/20 text-[#e63946]",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  preparando: "Preparando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export function OverviewTab() {
  const { state } = useMerchant();
  const profile = state.profile;
  const orders = state.orders;

  const todayOrders = orders.filter((o) => o.date === "2026-02-28").length;
  const monthRevenue = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((sum, o) => sum + o.total, 0);
  const avgTicket =
    orders.filter((o) => o.status !== "cancelado").length > 0
      ? monthRevenue / orders.filter((o) => o.status !== "cancelado").length
      : 0;
  const newCustomers = 8;

  const metrics = [
    {
      label: "Pedidos Hoje",
      value: todayOrders.toString(),
      icon: ShoppingBag,
      color: "#00b4d8",
    },
    {
      label: "Faturamento do Mes",
      value: `R$ ${monthRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "#22c55e",
    },
    {
      label: "Ticket Medio",
      value: `R$ ${avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "#eab308",
    },
    {
      label: "Clientes Novos",
      value: newCustomers.toString(),
      icon: Users,
      color: "#a855f7",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Visao Geral</h1>
        <p className="text-sm text-[#9999aa]">
          Bem-vindo de volta, {profile?.ownerName || "Parceiro"}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-[#9999aa]">
                  {m.label}
                </span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${m.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: m.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Faturamento - Ultimos 7 dias
        </h2>
        <div className="flex items-end gap-3" style={{ height: 180 }}>
          {revenueData.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-[#9999aa]">
                R$ {d.value}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#e63946] to-[#e63946]/60 transition-all"
                style={{
                  height: `${(d.value / maxRevenue) * 140}px`,
                  minHeight: 8,
                }}
              />
              <span className="text-xs text-[#9999aa]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Pedidos Recentes
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {order.id}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#9999aa]">
                    {order.customerName} - {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#9999aa]">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Rating */}
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Sua Avaliacao Publica
          </h2>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/10">
              <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">
                {profile?.rating || "—"}
              </p>
              <div className="mt-1 flex items-center justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.floor(profile?.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : s <= Math.ceil(profile?.rating || 0)
                        ? "fill-yellow-400/50 text-yellow-400/50"
                        : "text-[#2a2a3a]"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-[#9999aa]">
                Baseado nas avaliacoes dos clientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

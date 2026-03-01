"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useMerchant, type Order } from "@/contexts/MerchantContext";

type FilterTab = "todos" | "novo" | "preparando" | "entregue" | "cancelado";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "novo", label: "Novos" },
  { id: "preparando", label: "Em Preparo" },
  { id: "entregue", label: "Entregues" },
  { id: "cancelado", label: "Cancelados" },
];

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

export function OrdersTab() {
  const { state, dispatch, toast } = useMerchant();
  const [filter, setFilter] = useState<FilterTab>("todos");

  const filtered =
    filter === "todos"
      ? state.orders
      : state.orders.filter((o) => o.status === filter);

  function updateStatus(id: string, status: Order["status"]) {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
    toast(
      `Pedido ${id} atualizado para "${statusLabels[status]}"`,
      "success"
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-sm text-[#9999aa]">Gerencie todos os pedidos</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              filter === tab.id
                ? "bg-[#e63946] text-white"
                : "border border-[#2a2a3a] bg-[#12121a] text-[#9999aa] hover:text-white"
            }`}
          >
            {tab.label}
            {tab.id !== "todos" && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({state.orders.filter((o) =>
                  tab.id === "todos" ? true : o.status === tab.id
                ).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2a2a3a] bg-[#12121a] py-12">
            <ShoppingBag className="h-10 w-10 text-[#2a2a3a]" />
            <p className="text-sm text-[#9999aa]">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4 transition-all hover:border-[#2a2a3a]/80"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {order.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <span className="text-xs text-[#9999aa]">
                      {order.date} as {order.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#9999aa]">
                    <span className="text-white">{order.customerName}</span>{" "}
                    — {order.customerEmail}
                  </p>
                  <div className="mt-2">
                    {order.items.map((item, i) => (
                      <span
                        key={i}
                        className="mr-2 inline-block rounded-lg bg-[#0a0a0f] px-2 py-1 text-xs text-[#9999aa]"
                      >
                        {item.qty}x {item.name} (R$ {item.price.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Total + actions */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-bold text-white">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.status === "novo" && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, "preparando")}
                          className="flex items-center gap-1.5 rounded-lg bg-[#00b4d8]/10 px-3 py-1.5 text-xs font-medium text-[#00b4d8] transition-all hover:bg-[#00b4d8]/20"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Aceitar
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "cancelado")}
                          className="flex items-center gap-1.5 rounded-lg bg-[#e63946]/10 px-3 py-1.5 text-xs font-medium text-[#e63946] transition-all hover:bg-[#e63946]/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Recusar
                        </button>
                      </>
                    )}
                    {order.status === "preparando" && (
                      <button
                        onClick={() => updateStatus(order.id, "entregue")}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Marcar como Pronto
                      </button>
                    )}
                    {order.status === "entregue" && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Entregue
                      </span>
                    )}
                    {order.status === "cancelado" && (
                      <span className="flex items-center gap-1.5 text-xs text-[#e63946]">
                        <XCircle className="h-3.5 w-3.5" />
                        Cancelado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

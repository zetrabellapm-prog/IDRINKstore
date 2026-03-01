"use client";

import { useState, useMemo } from "react";
import { Search, Users, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { useMerchant } from "@/contexts/MerchantContext";

export function CustomersTab() {
  const { state } = useMerchant();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      state.customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [state.customers, search]
  );

  const selected = state.customers.find((c) => c.id === selectedId);

  // Find orders for selected customer
  const customerOrders = useMemo(() => {
    if (!selected) return [];
    return state.orders.filter(
      (o) => o.customerName === selected.name
    );
  }, [selected, state.orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <p className="text-sm text-[#9999aa]">Historico de clientes</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full rounded-xl border border-[#2a2a3a] bg-[#12121a] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customer list */}
        <div className="space-y-2 lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2a2a3a] bg-[#12121a] py-12">
              <Users className="h-10 w-10 text-[#2a2a3a]" />
              <p className="text-sm text-[#9999aa]">Nenhum cliente encontrado</p>
            </div>
          ) : (
            filtered.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedId(customer.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  selectedId === customer.id
                    ? "border-[#e63946]/50 bg-[#e63946]/5"
                    : "border-[#2a2a3a] bg-[#12121a] hover:border-[#2a2a3a]/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a26] text-sm font-bold text-white">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {customer.name}
                    </p>
                    <p className="text-xs text-[#9999aa]">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-xs text-[#9999aa]">Pedidos</p>
                    <p className="text-sm font-semibold text-white">
                      {customer.orders}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-[#9999aa]">Total gasto</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      R$ {customer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Customer detail */}
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
          {selected ? (
            <>
              <div className="mb-4 flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a26] text-xl font-bold text-white">
                  {selected.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-xs text-[#9999aa]">{selected.email}</p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <ShoppingBag className="mx-auto mb-1 h-4 w-4 text-[#00b4d8]" />
                  <p className="text-lg font-bold text-white">{selected.orders}</p>
                  <p className="text-[10px] text-[#9999aa]">Pedidos</p>
                </div>
                <div className="rounded-xl bg-[#0a0a0f] p-3 text-center">
                  <DollarSign className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
                  <p className="text-lg font-bold text-white">
                    R$ {selected.totalSpent.toFixed(0)}
                  </p>
                  <p className="text-[10px] text-[#9999aa]">Total</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#0a0a0f] p-3">
                <Calendar className="h-4 w-4 text-[#9999aa]" />
                <span className="text-xs text-[#9999aa]">
                  Ultima compra: {selected.lastOrder}
                </span>
              </div>

              {/* Customer's orders */}
              {customerOrders.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-[#9999aa]">
                    Historico de pedidos
                  </p>
                  <div className="space-y-2">
                    {customerOrders.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between rounded-lg bg-[#0a0a0f] p-2"
                      >
                        <span className="text-xs text-white">{o.id}</span>
                        <span className="text-xs font-medium text-emerald-400">
                          R$ {o.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12">
              <Users className="h-10 w-10 text-[#2a2a3a]" />
              <p className="text-center text-sm text-[#9999aa]">
                Selecione um cliente para ver detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

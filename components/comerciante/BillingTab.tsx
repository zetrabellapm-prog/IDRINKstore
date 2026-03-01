"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ArrowDownToLine,
  Calendar,
  X,
} from "lucide-react";
import { useMerchant } from "@/contexts/MerchantContext";

const months = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weeklyData = [
  { week: "Sem 1", value: 980 },
  { week: "Sem 2", value: 1240 },
  { week: "Sem 3", value: 850 },
  { week: "Sem 4", value: 1210 },
];

const maxWeekly = Math.max(...weeklyData.map((d) => d.value));

export function BillingTab() {
  const { state, toast } = useMerchant();
  const [selectedMonth, setSelectedMonth] = useState(1); // Fevereiro (0-indexed)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const validOrders = state.orders.filter((o) => o.status !== "cancelado");
  const grossTotal = validOrders.reduce((s, o) => s + o.total, 0);
  const platformFee = grossTotal * 0.1;
  const netTotal = grossTotal - platformFee;

  const transactions = validOrders.map((o) => ({
    date: o.date,
    orderId: o.id,
    gross: o.total,
    fee: o.total * 0.1,
    net: o.total * 0.9,
  }));

  function handleWithdraw() {
    toast("Solicitacao de saque enviada com sucesso!", "success");
    setShowWithdrawModal(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Faturamento</h1>
        <p className="text-sm text-[#9999aa]">Acompanhe suas receitas</p>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-[#9999aa]" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="rounded-xl border border-[#2a2a3a] bg-[#12121a] px-4 py-2 text-sm text-white focus:border-[#e63946] focus:outline-none"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m} 2026
            </option>
          ))}
        </select>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
          <p className="text-xs text-[#9999aa]">Total Bruto</p>
          <p className="mt-1 text-2xl font-bold text-white">
            R$ {grossTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
          <p className="text-xs text-[#9999aa]">Taxa iDrink (10%)</p>
          <p className="mt-1 text-2xl font-bold text-[#e63946]">
            - R$ {platformFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="text-xs text-emerald-400">Liquido a Receber</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            R$ {netTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Faturamento por Semana
        </h2>
        <div className="flex items-end gap-6" style={{ height: 180 }}>
          {weeklyData.map((d) => (
            <div key={d.week} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-[#9999aa]">
                R$ {d.value}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#00b4d8] to-[#00b4d8]/40 transition-all"
                style={{
                  height: `${(d.value / maxWeekly) * 140}px`,
                  minHeight: 8,
                }}
              />
              <span className="text-xs text-[#9999aa]">{d.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Transacoes</h2>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 rounded-full bg-[#e63946] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#d12f3c]"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Solicitar Saque
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3a] text-xs text-[#9999aa]">
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Pedido</th>
                <th className="pb-3 font-medium text-right">Bruto</th>
                <th className="pb-3 font-medium text-right">Taxa</th>
                <th className="pb-3 font-medium text-right">Liquido</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-[#2a2a3a]/50">
                  <td className="py-3 text-[#9999aa]">{t.date}</td>
                  <td className="py-3 text-white">{t.orderId}</td>
                  <td className="py-3 text-right text-white">
                    R$ {t.gross.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-[#e63946]">
                    - R$ {t.fee.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-medium text-emerald-400">
                    R$ {t.net.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Solicitar Saque</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-[#9999aa] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs text-emerald-400">Valor Disponivel</p>
              <p className="mt-1 text-3xl font-bold text-emerald-400">
                R$ {netTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <p className="mb-4 text-center text-xs text-[#9999aa]">
              O valor sera transferido para sua chave Pix cadastrada em ate 2
              dias uteis.
            </p>
            <button
              onClick={handleWithdraw}
              className="w-full rounded-full bg-[#e63946] py-3 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c]"
            >
              Confirmar Saque
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

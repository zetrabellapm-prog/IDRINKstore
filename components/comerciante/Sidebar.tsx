"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Star,
} from "lucide-react";
import { useMerchant } from "@/contexts/MerchantContext";

export type DashboardTab =
  | "overview"
  | "orders"
  | "billing"
  | "customers"
  | "products"
  | "settings";

const tabs: { id: DashboardTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visao Geral", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", icon: ShoppingBag },
  { id: "billing", label: "Faturamento", icon: DollarSign },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "products", label: "Produtos", icon: Package },
  { id: "settings", label: "Configuracoes", icon: Settings },
];

interface SidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
}

export function Sidebar({ currentTab, onTabChange, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { state } = useMerchant();
  const profile = state.profile;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#2a2a3a] bg-[#0d0d14] transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Profile section */}
        <div className="flex items-center gap-3 border-b border-[#2a2a3a] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-sm font-bold text-white">
            {profile?.storeName?.charAt(0) || "L"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {profile?.storeName || "Minha Loja"}
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-[#9999aa]">
                  {profile?.rating || "—"} 
                </span>
                <span className="text-xs text-[#00b4d8]">Parceiro</span>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "border-r-2 border-[#e63946] bg-[#e63946]/10 text-white"
                    : "text-[#9999aa] hover:bg-[#1a1a26] hover:text-white"
                }`}
                title={collapsed ? tab.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#2a2a3a] p-3">
          <button
            onClick={onLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#9999aa] transition-all hover:bg-[#e63946]/10 hover:text-[#e63946] ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-1 flex w-full items-center justify-center rounded-lg p-2 text-[#9999aa] hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#2a2a3a] bg-[#0d0d14]/95 backdrop-blur-lg md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-2.5 transition-colors ${
                isActive ? "text-[#e63946]" : "text-[#9999aa]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

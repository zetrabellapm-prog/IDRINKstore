"use client";

import { useState } from "react";
import { useMerchant } from "@/contexts/MerchantContext";
import { TermsModal } from "@/components/comerciante/TermsModal";
import { RegisterForm } from "@/components/comerciante/RegisterForm";
import { LoginForm } from "@/components/comerciante/LoginForm";
import { Sidebar, type DashboardTab } from "@/components/comerciante/Sidebar";
import { OverviewTab } from "@/components/comerciante/OverviewTab";
import { OrdersTab } from "@/components/comerciante/OrdersTab";
import { BillingTab } from "@/components/comerciante/BillingTab";
import { CustomersTab } from "@/components/comerciante/CustomersTab";
import { ProductsTab } from "@/components/comerciante/ProductsTab";
import { SettingsTab } from "@/components/comerciante/SettingsTab";

type AuthScreen = "terms" | "register" | "login";

export default function ComerciantePage() {
  const { state, dispatch, toast } = useMerchant();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("terms");
  const [currentTab, setCurrentTab] = useState<DashboardTab>("overview");

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    setAuthScreen("terms");
    toast("Voce saiu da sua conta", "info");
  }

  // ─── Not Logged In ─── //
  if (!state.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        {authScreen === "terms" && (
          <TermsModal onAccept={() => setAuthScreen("register")} />
        )}
        {authScreen === "register" && (
          <RegisterForm
            onRegister={() => {}}
            onGoToLogin={() => setAuthScreen("login")}
          />
        )}
        {authScreen === "login" && (
          <LoginForm
            onLogin={() => {}}
            onGoToRegister={() => setAuthScreen("register")}
          />
        )}
      </div>
    );
  }

  // ─── Dashboard ─── //
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
          <div
            key={currentTab}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {currentTab === "overview" && <OverviewTab />}
            {currentTab === "orders" && <OrdersTab />}
            {currentTab === "billing" && <BillingTab />}
            {currentTab === "customers" && <CustomersTab />}
            {currentTab === "products" && <ProductsTab />}
            {currentTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

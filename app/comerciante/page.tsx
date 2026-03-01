"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIDrink } from "@/lib/context";

export default function ComerciantePage() {
  const router = useRouter();
  const { comercianteLogado } = useIDrink();

  useEffect(() => {
    if (comercianteLogado) {
      router.replace("/comerciante/dashboard");
    } else {
      router.replace("/comerciante/cadastro");
    }
  }, [comercianteLogado, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2a3a] border-t-[#e63946]" />
    </div>
  );
}

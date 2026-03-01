"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/carrinho");
  }, [router]);
  return null;
}

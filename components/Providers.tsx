'use client'
import { IDrinkProvider } from '@/lib/context'
import { CartProvider } from '@/contexts/CartContext'
import { ToastContainer } from '@/components/Toast'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  console.log("[v0] Providers rendering")
  return (
    <IDrinkProvider>
      <CartProvider>
        {children}
      </CartProvider>
      <ToastContainer />
    </IDrinkProvider>
  )
}

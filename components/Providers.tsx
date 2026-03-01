// components/Providers.tsx
// Este arquivo existe APENAS para envolver o IDrinkProvider + CartProvider + ToastContainer
// O layout.tsx importa este componente e mantém o 'use server' implícito + metadata intactos

'use client'
import { IDrinkProvider } from '@/lib/context'
import { CartProvider } from '@/contexts/CartContext'
import { ToastContainer } from '@/components/Toast'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <IDrinkProvider>
      <CartProvider>
        {children}
      </CartProvider>
      <ToastContainer />
    </IDrinkProvider>
  )
}

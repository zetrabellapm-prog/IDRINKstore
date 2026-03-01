'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useIDrink } from '@/lib/context'
import { formatarMoeda } from '@/lib/utils'
import { CheckCircle, Package, Home, Clock, Truck, ChefHat, CircleCheck } from 'lucide-react'
import { Suspense } from 'react'

function ConfirmacaoContent() {
  const searchParams = useSearchParams()
  const pedidoId = searchParams.get('id')
  const { pedidos, lojas } = useIDrink()

  const pedido = pedidos.find(p => p.id === pedidoId)
  const loja = pedido ? lojas.find(l => l.id === pedido.lojaId) : null

  if (!pedido) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-[#9999aa]">Pedido nao encontrado.</p>
        <Link href="/home" className="mt-4 text-[#00b4d8] hover:underline">Voltar ao inicio</Link>
      </div>
    )
  }

  const statusSteps = [
    { label: 'Pedido recebido', icon: CircleCheck, active: true },
    { label: 'Aguardando loja...', icon: Clock, active: pedido.status === 'Novo', pulsing: pedido.status === 'Novo' },
    { label: 'Confirmado', icon: CircleCheck, active: ['Confirmado', 'Em Preparo', 'Saiu para Entrega', 'Entregue'].includes(pedido.status) },
    { label: 'Em preparo', icon: ChefHat, active: ['Em Preparo', 'Saiu para Entrega', 'Entregue'].includes(pedido.status) },
    { label: 'Saiu para entrega', icon: Truck, active: ['Saiu para Entrega', 'Entregue'].includes(pedido.status) },
    { label: 'Entregue', icon: CircleCheck, active: pedido.status === 'Entregue' },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Success Icon */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Pedido confirmado!</h1>
        <p className="mt-1 text-lg font-semibold text-[#e63946]">#{pedido.id}</p>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#9999aa]">Loja</span>
            <span className="text-white">{pedido.lojaNome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9999aa]">Total</span>
            <span className="font-bold text-[#e63946]">{formatarMoeda(pedido.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9999aa]">Pagamento</span>
            <span className="text-white">{pedido.pagamento}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9999aa]">Endereco</span>
            <span className="text-right text-white text-xs max-w-[200px]">{pedido.endereco.rua}, {pedido.endereco.numero} - {pedido.endereco.bairro}</span>
          </div>
        </div>
      </div>

      {/* Estimated time */}
      {loja && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-3">
          <Clock className="h-4 w-4 text-[#00b4d8]" />
          <span className="text-sm text-[#9999aa]">Chega em ~{loja.tempoEntrega}</span>
        </div>
      )}

      {/* Status Tracker */}
      <div className="mb-6 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
        <h3 className="mb-4 text-sm font-semibold text-white">Acompanhamento</h3>
        <div className="flex flex-col gap-4">
          {statusSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.active ? 'bg-green-500/15 text-green-400' : 'bg-[#1a1a26] text-[#9999aa]'} ${step.pulsing ? 'animate-pulse' : ''}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-sm ${step.active ? 'font-medium text-white' : 'text-[#9999aa]'}`}>{step.label}</span>
                {i < statusSteps.length - 1 && (
                  <div className="sr-only">proximo</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link href="/pedidos" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e63946] py-3.5 font-semibold text-white hover:opacity-90">
          <Package className="h-5 w-5" /> Acompanhar Pedido
        </Link>
        <Link href="/home" className="flex w-full items-center justify-center gap-2 rounded-full border border-[#2a2a3a] py-3.5 font-medium text-[#9999aa] hover:text-white">
          <Home className="h-5 w-5" /> Voltar ao Inicio
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2a3a] border-t-[#e63946]" /></div>}>
      <ConfirmacaoContent />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIDrink } from '@/lib/context'
import { formatarMoeda } from '@/lib/utils'
import {
  Package, ArrowRight, Star, RefreshCw, Clock, ChevronDown, ChevronUp, X
} from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'Novo': { label: 'Novo', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  'Confirmado': { label: 'Confirmado', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  'Em Preparo': { label: 'Em Preparo', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  'Saiu para Entrega': { label: 'A caminho', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  'Entregue': { label: 'Entregue', color: 'text-green-400', bg: 'bg-green-500/15' },
  'Cancelado': { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-500/15' },
}

const progressSteps = ['Novo', 'Confirmado', 'Em Preparo', 'Saiu para Entrega', 'Entregue']

export default function PedidosPage() {
  const router = useRouter()
  const { pedidos, usuarioLogado, lojas, adicionarAoCarrinho, atualizarLoja, addToast } = useIDrink()
  const [expandido, setExpandido] = useState<string | null>(null)
  const [avaliacaoModal, setAvaliacaoModal] = useState<string | null>(null)
  const [estrelas, setEstrelas] = useState(0)
  const [avaliacaoTexto, setAvaliacaoTexto] = useState('')

  const meusPedidos = pedidos.filter(p => p.usuarioId === (usuarioLogado?.id || 'user-1'))
  const pedidosAtivos = meusPedidos.filter(p => !['Entregue', 'Cancelado'].includes(p.status))
  const pedidosAnteriores = meusPedidos.filter(p => ['Entregue', 'Cancelado'].includes(p.status))

  function pedirNovamente(pedido: typeof meusPedidos[0]) {
    const loja = lojas.find(l => l.id === pedido.lojaId)
    if (!loja) return
    pedido.itens.forEach(item => {
      const produto = loja.produtos.find(p => p.nome === item.nome)
      if (produto) adicionarAoCarrinho(loja.id, loja.nome, produto)
    })
    addToast('Itens adicionados ao carrinho')
    router.push('/carrinho')
  }

  function enviarAvaliacao(lojaId: string) {
    if (estrelas === 0) { addToast('Selecione uma nota', 'erro'); return }
    const loja = lojas.find(l => l.id === lojaId)
    if (loja) {
      const novaMedia = ((loja.avaliacao * loja.totalAvaliacoes) + estrelas) / (loja.totalAvaliacoes + 1)
      atualizarLoja(lojaId, { avaliacao: Math.round(novaMedia * 10) / 10, totalAvaliacoes: loja.totalAvaliacoes + 1 })
    }
    addToast('Obrigado pela avaliacao!')
    setAvaliacaoModal(null)
    setEstrelas(0)
    setAvaliacaoTexto('')
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  if (meusPedidos.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 rounded-full bg-[#1a1a26] p-6">
          <Package className="h-12 w-12 text-[#9999aa]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Nenhum pedido ainda</h1>
        <p className="mt-2 text-[#9999aa]">Seus pedidos aparecerao aqui depois da sua primeira compra</p>
        <Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e63946] px-6 py-3 font-semibold text-white">
          Explorar Lojas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold text-white">Meus Pedidos</h1>
      <p className="mb-6 text-[#9999aa]">Acompanhe o status dos seus pedidos</p>

      {/* Active Orders */}
      {pedidosAtivos.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Em andamento</h2>
          <div className="flex flex-col gap-4">
            {pedidosAtivos.map(pedido => {
              const stepIdx = progressSteps.indexOf(pedido.status)
              const cfg = statusConfig[pedido.status] || statusConfig['Novo']
              return (
                <div key={pedido.id} className="rounded-2xl border border-[#e63946]/30 bg-[#12121a] p-5" style={{ animation: 'pulse-border 2s infinite' }}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">#{pedido.id}</p>
                      <p className="text-xs text-[#9999aa]">{pedido.lojaNome} - {formatDate(pedido.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-3 flex gap-1">
                    {progressSteps.map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? 'bg-[#e63946]' : 'bg-[#2a2a3a]'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-[#9999aa]">
                    {pedido.itens.map((item, i) => <span key={i}>{i > 0 ? ', ' : ''}{item.quantidade}x {item.nome}</span>)}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-[#e63946]">{formatarMoeda(pedido.total)}</span>
                    <Link href={`/confirmacao?id=${pedido.id}`} className="text-sm text-[#00b4d8] hover:underline">Detalhes</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Previous Orders */}
      {pedidosAnteriores.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Anteriores</h2>
          <div className="flex flex-col gap-3">
            {pedidosAnteriores.map(pedido => {
              const cfg = statusConfig[pedido.status] || statusConfig['Entregue']
              const isExpanded = expandido === pedido.id
              return (
                <div key={pedido.id} className="rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
                  <button onClick={() => setExpandido(isExpanded ? null : pedido.id)} className="flex w-full items-center justify-between p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">#{pedido.id}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-[#9999aa]">{pedido.lojaNome} - {formatDate(pedido.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#e63946]">{formatarMoeda(pedido.total)}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                      <div className="flex flex-col gap-1 text-sm text-[#9999aa]">
                        {pedido.itens.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{item.quantidade}x {item.nome}</span>
                            <span>{formatarMoeda(item.preco * item.quantidade)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        {pedido.status === 'Entregue' && (
                          <>
                            <button onClick={() => pedirNovamente(pedido)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e63946] py-2.5 text-sm font-semibold text-white hover:opacity-90">
                              <RefreshCw className="h-4 w-4" /> Pedir Novamente
                            </button>
                            <button onClick={() => { setAvaliacaoModal(pedido.lojaId); setEstrelas(0) }} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2a2a3a] py-2.5 text-sm font-medium text-[#9999aa] hover:text-white">
                              <Star className="h-4 w-4" /> Avaliar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {avaliacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#2a2a3a] bg-[#0a0a0f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Avaliar Loja</h3>
              <button onClick={() => setAvaliacaoModal(null)} className="text-[#9999aa] hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setEstrelas(n)} className="transition-transform hover:scale-110">
                  <Star className={`h-8 w-8 ${n <= estrelas ? 'fill-yellow-400 text-yellow-400' : 'text-[#2a2a3a]'}`} />
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {['Rapido', 'Bem embalado', 'Otimos produtos', 'Entrega pontual'].map(chip => (
                <button key={chip} onClick={() => setAvaliacaoTexto(prev => prev ? `${prev}, ${chip}` : chip)} className="rounded-full border border-[#2a2a3a] px-3 py-1 text-xs text-[#9999aa] hover:border-[#e63946] hover:text-white">
                  {chip}
                </button>
              ))}
            </div>
            <textarea
              value={avaliacaoTexto}
              onChange={e => setAvaliacaoTexto(e.target.value)}
              placeholder="Comentario (opcional)"
              className="mb-4 w-full rounded-xl border border-[#2a2a3a] bg-[#12121a] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none"
              rows={3}
            />
            <button onClick={() => enviarAvaliacao(avaliacaoModal)} className="w-full rounded-full bg-[#e63946] py-3 font-semibold text-white hover:opacity-90">
              Enviar Avaliacao
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

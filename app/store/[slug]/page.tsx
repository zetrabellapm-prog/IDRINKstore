'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIDrink } from '@/lib/context'
import { formatarMoeda } from '@/lib/utils'
import {
  Star, Clock, Truck, Heart, ArrowLeft, ShoppingCart,
  Plus, Minus, AlertTriangle, Flame, Search, ChevronRight
} from 'lucide-react'

const categoriaEmoji: Record<string, string> = {
  'Cerveja': '🍺', 'Whisky': '🥃', 'Vodka': '🍸', 'Gin': '🍸',
  'Vinho': '🍷', 'Energetico': '⚡', 'Combos': '🎉', 'Agua': '💧',
  'Refrigerante': '🥤', 'Outros': '🍹',
}

export default function StoreSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const {
    lojas, carrinho, favoritos,
    adicionarAoCarrinho, confirmarTrocaLoja, alterarQuantidade,
    toggleFavorito, addToast
  } = useIDrink()

  const loja = lojas.find(l => l.slug === slug)
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [conflitoModal, setConflitoModal] = useState<{ produtoId: string } | null>(null)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const categorias = useMemo(() => {
    if (!loja) return []
    const cats = [...new Set(loja.produtos.map(p => p.categoria))]
    return ['Todos', ...cats]
  }, [loja])

  const produtosFiltrados = useMemo(() => {
    if (!loja) return []
    return loja.produtos.filter(p => {
      const matchCat = categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
      return matchCat && matchBusca && p.disponivel
    })
  }, [loja, categoriaAtiva, busca])

  const isFav = loja ? favoritos.includes(loja.id) : false
  const carrinhoTotal = carrinho.itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0)

  if (!loja) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-muted-foreground">Loja nao encontrada.</p>
        <Link href="/home" className="mt-4 text-[#00f5ff] hover:underline">Voltar ao inicio</Link>
      </div>
    )
  }

  function handleAdd(produto: typeof loja.produtos[0]) {
    const resultado = adicionarAoCarrinho(loja!.id, loja!.nome, produto)
    if (resultado === 'conflito') {
      setConflitoModal({ produtoId: produto.id })
    } else {
      addToast(`${produto.nome} adicionado ao carrinho`)
    }
  }

  function handleConfirmarTroca() {
    if (!conflitoModal || !loja) return
    const produto = loja.produtos.find(p => p.id === conflitoModal.produtoId)
    if (produto) {
      confirmarTrocaLoja(loja.id, loja.nome, produto)
      addToast('Carrinho atualizado com nova loja')
    }
    setConflitoModal(null)
  }

  function getQtdCarrinho(produtoId: string) {
    const item = carrinho.itens.find(i => i.produto.id === produtoId)
    return item ? item.quantidade : 0
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      {/* Back */}
      <Link href="/home" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#ea1d2c]">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#2a2a3a] bg-gradient-to-br from-[#12121a] to-[#1a1a26] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e63946]/15 text-2xl font-bold text-[#e63946]">
                {loja.nome.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">{loja.nome}</h1>
                <p className="text-sm text-[#9999aa]">{loja.categoria}</p>
              </div>
            </div>
            <p className="mt-2 text-[#9999aa]">{loja.descricao}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-white">{loja.avaliacao}</span>
                <span className="text-xs text-[#9999aa]">({loja.totalAvaliacoes})</span>
              </div>
              <div className="flex items-center gap-1 text-[#9999aa]">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{loja.tempoEntrega}</span>
              </div>
              <div className="flex items-center gap-1 text-[#9999aa]">
                <Truck className="h-4 w-4" />
                <span className="text-sm">
                  {loja.taxaEntrega === 0 ? 'Frete gratis' : `Frete R$ ${loja.taxaEntrega.toFixed(2)}`}
                </span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${loja.aberto ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                {loja.aberto ? 'Aberto' : 'Fechado'}
              </span>
            </div>
            {loja.freteGratis > 0 && (
              <p className="mt-3 text-xs text-green-400">Frete gratis acima de {formatarMoeda(loja.freteGratis)}</p>
            )}
          </div>
          <button
            onClick={() => { toggleFavorito(loja.id); addToast(isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 'info') }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${isFav ? 'border-[#e63946] bg-[#e63946]/15 text-[#e63946]' : 'border-[#2a2a3a] text-[#9999aa] hover:border-[#e63946] hover:text-[#e63946]'}`}
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
        <input
          type="text"
          placeholder="Buscar produtos nesta loja..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full rounded-xl border border-[#2a2a3a] bg-[#12121a] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              categoriaAtiva === cat
                ? 'bg-[#e63946] text-white'
                : 'border border-[#2a2a3a] bg-[#12121a] text-[#9999aa] hover:border-[#e63946]/50 hover:text-white'
            }`}
          >
            {cat !== 'Todos' && (categoriaEmoji[cat] || '🍹')} {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
              <div className="mb-3 h-24 rounded-xl bg-[#1a1a26]" />
              <div className="mb-2 h-4 w-3/4 rounded bg-[#1a1a26]" />
              <div className="mb-2 h-3 w-1/2 rounded bg-[#1a1a26]" />
              <div className="h-5 w-1/3 rounded bg-[#1a1a26]" />
            </div>
          ))}
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[#9999aa]">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {produtosFiltrados.map(produto => {
            const qtd = getQtdCarrinho(produto.id)
            return (
              <div
                key={produto.id}
                className="group relative overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4 transition-all hover:border-[#e63946]/30"
              >
                {produto.destaque && (
                  <span className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-lg bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                    <Flame className="h-3 w-3" /> Destaque
                  </span>
                )}
                {produto.estoque < 5 && produto.estoque > 0 && (
                  <span className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-lg bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">
                    <AlertTriangle className="h-3 w-3" /> Restam {produto.estoque}
                  </span>
                )}

                <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-[#1a1a26] text-4xl">
                  {categoriaEmoji[produto.categoria] || '🍹'}
                </div>

                <h3 className="text-sm font-semibold text-white line-clamp-2">{produto.nome}</h3>
                <p className="mt-1 text-xs text-[#9999aa] line-clamp-1">{produto.descricao}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-[#e63946]">{formatarMoeda(produto.preco)}</span>
                  {produto.precoOriginal && (
                    <span className="text-xs text-[#9999aa] line-through">{formatarMoeda(produto.precoOriginal)}</span>
                  )}
                </div>

                <div className="mt-3">
                  {qtd === 0 ? (
                    <button
                      onClick={() => handleAdd(produto)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e63946] py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" /> Adicionar
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-[#e63946]/30 bg-[#e63946]/10 px-3 py-2" style={{ animation: 'bounceIn 0.4s ease-out' }}>
                      <button
                        onClick={() => alterarQuantidade(produto.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e63946]/20 text-[#e63946] hover:bg-[#e63946]/30"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-bold text-white">{qtd}</span>
                      <button
                        onClick={() => alterarQuantidade(produto.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e63946]/20 text-[#e63946] hover:bg-[#e63946]/30"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Floating Cart Bar */}
      {carrinho.itens.length > 0 && carrinho.lojaId === loja.id && (
        <div
          className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg md:bottom-6"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <button
            onClick={() => router.push('/carrinho')}
            className="flex w-full items-center justify-between rounded-2xl bg-[#e63946] px-6 py-4 font-semibold text-white shadow-[0_-4px_20px_rgba(230,57,70,0.4)] transition-all hover:opacity-95"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <span>Ver carrinho</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{carrinho.itens.reduce((s, i) => s + i.quantidade, 0)} itens</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatarMoeda(carrinhoTotal)}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Conflict Modal */}
      {conflitoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#2a2a3a] bg-[#0a0a0f] p-6">
            <h3 className="text-lg font-bold text-white">Trocar de loja?</h3>
            <p className="mt-2 text-sm text-[#9999aa]">
              Seu carrinho tem itens de <strong className="text-white">{carrinho.lojaNome}</strong>. Deseja limpar o carrinho e adicionar itens de <strong className="text-white">{loja.nome}</strong>?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConflitoModal(null)}
                className="flex-1 rounded-xl border border-[#2a2a3a] py-3 text-sm font-medium text-[#9999aa] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarTroca}
                className="flex-1 rounded-xl bg-[#e63946] py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Trocar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

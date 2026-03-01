'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useIDrink } from '@/lib/context'
import { formatarMoeda, gerarId } from '@/lib/utils'
import { whatsappCliente } from '@/lib/whatsapp'
import type { Produto } from '@/lib/context'
import {
  LayoutDashboard, ShoppingBag, DollarSign, Users, Package, Settings,
  Menu, X, Eye, Plus, Pencil, Trash2, Check, XCircle, ChefHat, Truck,
  MessageCircle, ChevronDown, ChevronUp, Search
} from 'lucide-react'

const abaItems = [
  { id: 'visao', icon: LayoutDashboard, label: 'Visao Geral' },
  { id: 'pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { id: 'faturamento', icon: DollarSign, label: 'Faturamento' },
  { id: 'clientes', icon: Users, label: 'Clientes' },
  { id: 'produtos', icon: Package, label: 'Produtos' },
  { id: 'config', icon: Settings, label: 'Configuracoes' },
]

export default function DashboardComerciante() {
  const router = useRouter()
  const {
    comercianteLogado, lojas, pedidos, loginComerciantePorLojaId,
    atualizarStatusPedido, toggleLojaAberta, adicionarProduto,
    atualizarProduto, removerProduto, atualizarLoja, addToast
  } = useIDrink()

  const [abaAtiva, setAbaAtiva] = useState('visao')
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const prevPedidosRef = useRef<number>(0)

  // Auto-login for demo
  useEffect(() => {
    if (!comercianteLogado) {
      loginComerciantePorLojaId('loja-1')
    }
  }, [comercianteLogado, loginComerciantePorLojaId])

  const loja = useMemo(() => {
    if (!comercianteLogado) return null
    return lojas.find(l => l.id === comercianteLogado.lojaId) || null
  }, [comercianteLogado, lojas])

  const pedidosLoja = useMemo(() => {
    if (!loja) return []
    return pedidos.filter(p => p.lojaId === loja.id)
  }, [pedidos, loja])

  const pedidosNovos = pedidosLoja.filter(p => p.status === 'Novo')

  // Notify new orders
  useEffect(() => {
    if (pedidosNovos.length > prevPedidosRef.current && prevPedidosRef.current > 0) {
      const newest = pedidosNovos[0]
      if (newest) addToast(`Novo pedido! #${newest.id}`, 'info')
    }
    prevPedidosRef.current = pedidosNovos.length
  }, [pedidosNovos.length, pedidosNovos, addToast])

  if (!comercianteLogado || !loja) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2a3a] border-t-[#e63946]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar Desktop */}
      <aside className={`hidden flex-col border-r border-[#2a2a3a] bg-[#0d0d14] transition-all md:flex ${sidebarAberta ? 'w-60' : 'w-16'}`}>
        <button onClick={() => setSidebarAberta(!sidebarAberta)} className="flex h-14 items-center justify-center border-b border-[#2a2a3a] text-[#9999aa] hover:text-white">
          {sidebarAberta ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {abaItems.map(item => {
            const Icon = item.icon
            const isActive = abaAtiva === item.id
            const hasBadge = item.id === 'pedidos' && pedidosNovos.length > 0
            return (
              <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${isActive ? 'bg-[#e63946]/10 text-[#e63946]' : 'text-[#9999aa] hover:bg-[#1a1a26] hover:text-white'}`}>
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarAberta && <span>{item.label}</span>}
                {hasBadge && (
                  <span className="absolute right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e63946] text-[10px] font-bold text-white animate-pulse">{pedidosNovos.length}</span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#2a2a3a] bg-[#0d0d14] md:hidden">
        {abaItems.slice(0, 5).map(item => {
          const Icon = item.icon
          const isActive = abaAtiva === item.id
          return (
            <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${isActive ? 'text-[#e63946]' : 'text-[#9999aa]'}`}>
              <Icon className="h-4 w-4" />
              {item.label.split(' ')[0]}
              {item.id === 'pedidos' && pedidosNovos.length > 0 && (
                <span className="absolute right-2 top-0 h-2 w-2 rounded-full bg-[#e63946] animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
        {abaAtiva === 'visao' && <VisaoGeral loja={loja} pedidosLoja={pedidosLoja} pedidosNovos={pedidosNovos} atualizarStatusPedido={atualizarStatusPedido} toggleLojaAberta={toggleLojaAberta} addToast={addToast} router={router} />}
        {abaAtiva === 'pedidos' && <PedidosAba pedidosLoja={pedidosLoja} loja={loja} atualizarStatusPedido={atualizarStatusPedido} addToast={addToast} />}
        {abaAtiva === 'faturamento' && <FaturamentoAba pedidosLoja={pedidosLoja} addToast={addToast} />}
        {abaAtiva === 'clientes' && <ClientesAba pedidosLoja={pedidosLoja} loja={loja} />}
        {abaAtiva === 'produtos' && <ProdutosAba loja={loja} adicionarProduto={adicionarProduto} atualizarProduto={atualizarProduto} removerProduto={removerProduto} addToast={addToast} />}
        {abaAtiva === 'config' && <ConfigAba loja={loja} atualizarLoja={atualizarLoja} comerciante={comercianteLogado} addToast={addToast} />}
      </main>
    </div>
  )
}

// --- SUB COMPONENTS ---

function VisaoGeral({ loja, pedidosLoja, pedidosNovos, atualizarStatusPedido, toggleLojaAberta, addToast, router }: any) {
  const pedidosHoje = pedidosLoja.filter((p: any) => p.createdAt > Date.now() - 86400000)
  const faturamentoMes = pedidosLoja.filter((p: any) => p.status === 'Entregue').reduce((s: number, p: any) => s + p.total, 0)
  const ticketMedio = pedidosLoja.length > 0 ? faturamentoMes / Math.max(pedidosLoja.filter((p: any) => p.status === 'Entregue').length, 1) : 0
  const clientesUnicos = new Set(pedidosLoja.map((p: any) => p.usuarioId)).size

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{loja.nome}</h1>
          <p className="text-sm text-[#9999aa]">Painel de gerenciamento</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleLojaAberta(loja.id)} className={`rounded-full px-4 py-2 text-sm font-medium ${loja.aberto ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
            {loja.aberto ? 'Aberto' : 'Fechado'}
          </button>
          <button onClick={() => router.push(`/store/${loja.slug}`)} className="flex items-center gap-2 rounded-full border border-[#2a2a3a] px-4 py-2 text-sm text-[#9999aa] hover:text-white">
            <Eye className="h-4 w-4" /> Ver loja
          </button>
        </div>
      </div>

      {loja.produtos.length === 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-400">
          Sua loja ainda nao tem produtos. Adicione seus produtos na aba Produtos para comecar a vender!
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Pedidos Hoje', value: pedidosHoje.length },
          { label: 'Faturamento Mes', value: formatarMoeda(faturamentoMes) },
          { label: 'Ticket Medio', value: formatarMoeda(ticketMedio) },
          { label: 'Clientes', value: clientesUnicos },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
            <p className="text-xs text-[#9999aa]">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pedidos Novos */}
      {pedidosNovos.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-white" style={{ animation: 'pulse-border 2s infinite' }}>Pedidos Aguardando ({pedidosNovos.length})</h2>
          <div className="flex flex-col gap-3">
            {pedidosNovos.map((p: any) => (
              <div key={p.id} className="rounded-2xl border border-[#e63946]/30 bg-[#12121a] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">#{p.id}</span>
                  <span className="text-xs text-[#9999aa]">{new Date(p.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-[#9999aa]">{p.usuarioNome} - {p.pagamento}</p>
                <p className="text-xs text-[#9999aa]">{p.itens.map((i: any) => `${i.quantidade}x ${i.nome}`).join(', ')}</p>
                <p className="mt-1 font-bold text-[#e63946]">{formatarMoeda(p.total)}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { atualizarStatusPedido(p.id, 'Confirmado'); addToast('Pedido aceito!') }} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-500/15 py-2 text-sm font-medium text-green-400 hover:bg-green-500/25">
                    <Check className="h-4 w-4" /> Aceitar
                  </button>
                  <button onClick={() => { atualizarStatusPedido(p.id, 'Cancelado'); addToast('Pedido recusado', 'erro') }} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-500/15 py-2 text-sm font-medium text-red-400 hover:bg-red-500/25">
                    <XCircle className="h-4 w-4" /> Recusar
                  </button>
                  <button onClick={() => whatsappCliente(p.usuarioTelefone, p.id, loja.nome)} className="flex items-center justify-center rounded-xl bg-green-600/15 px-3 py-2 text-green-400 hover:bg-green-600/25">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
        <h3 className="mb-4 text-sm font-semibold text-white">Faturamento 7 dias</h3>
        <div className="flex items-end gap-2 h-32">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(Date.now() - (6 - i) * 86400000)
            const dayPedidos = pedidosLoja.filter((p: any) => p.status === 'Entregue' && new Date(p.createdAt).toDateString() === day.toDateString())
            const dayTotal = dayPedidos.reduce((s: number, p: any) => s + p.total, 0)
            const maxH = 100
            const h = Math.max(4, (dayTotal / Math.max(faturamentoMes() || 500, 1)) * maxH)
            function faturamentoMes() { return pedidosLoja.filter((p: any) => p.status === 'Entregue').reduce((s: number, p: any) => s + p.total, 0) }
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-[#e63946]" style={{ height: `${Math.min(h, maxH)}px` }} />
                <span className="text-[10px] text-[#9999aa]">{day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PedidosAba({ pedidosLoja, loja, atualizarStatusPedido, addToast }: any) {
  const [tab, setTab] = useState('Novo')
  const tabs = ['Novo', 'Confirmado', 'Em Preparo', 'Saiu para Entrega', 'Entregue', 'Cancelado']
  const filtrados = pedidosLoja.filter((p: any) => p.status === tab)
  const [expandido, setExpandido] = useState<string | null>(null)

  const nextStatus: Record<string, { label: string; status: string; icon: any }> = {
    'Novo': { label: 'Aceitar', status: 'Confirmado', icon: Check },
    'Confirmado': { label: 'Iniciar Preparo', status: 'Em Preparo', icon: ChefHat },
    'Em Preparo': { label: 'Saiu para Entrega', status: 'Saiu para Entrega', icon: Truck },
    'Saiu para Entrega': { label: 'Marcar Entregue', status: 'Entregue', icon: Check },
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white">Pedidos</h2>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${tab === t ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>
            {t} ({pedidosLoja.filter((p: any) => p.status === t).length})
          </button>
        ))}
      </div>
      {filtrados.length === 0 ? (
        <p className="text-center text-sm text-[#9999aa] py-8">Nenhum pedido com status "{tab}"</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((p: any) => {
            const isExp = expandido === p.id
            return (
              <div key={p.id} className="rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
                <button onClick={() => setExpandido(isExp ? null : p.id)} className="flex w-full items-center justify-between p-4">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">#{p.id} - {p.usuarioNome}</p>
                    <p className="text-xs text-[#9999aa]">{formatarMoeda(p.total)} - {p.pagamento}</p>
                  </div>
                  {isExp ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
                </button>
                {isExp && (
                  <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                    <div className="mb-2 text-xs text-[#9999aa]">
                      {p.itens.map((i: any, idx: number) => <div key={idx}>{i.quantidade}x {i.nome} - {formatarMoeda(i.preco * i.quantidade)}</div>)}
                    </div>
                    <p className="mb-2 text-xs text-[#9999aa]">{p.endereco.rua}, {p.endereco.numero} - {p.endereco.bairro}</p>
                    <div className="flex gap-2">
                      {nextStatus[p.status] && (
                        <button onClick={() => { atualizarStatusPedido(p.id, nextStatus[p.status].status); addToast(`Pedido #${p.id} atualizado`) }} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#e63946] py-2 text-sm font-medium text-white">
                          {(() => { const Icon = nextStatus[p.status].icon; return <Icon className="h-4 w-4" /> })()}
                          {nextStatus[p.status].label}
                        </button>
                      )}
                      {p.status === 'Novo' && (
                        <button onClick={() => { atualizarStatusPedido(p.id, 'Cancelado'); addToast('Pedido cancelado', 'erro') }} className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-400">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => whatsappCliente(p.usuarioTelefone, p.id, loja.nome)} className="rounded-xl bg-green-600/15 px-3 py-2 text-green-400">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FaturamentoAba({ pedidosLoja, addToast }: any) {
  const entregues = pedidosLoja.filter((p: any) => p.status === 'Entregue')
  const bruto = entregues.reduce((s: number, p: any) => s + p.total, 0)
  const taxa = bruto * 0.1
  const liquido = bruto - taxa

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white">Faturamento</h2>
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <p className="text-xs text-[#9999aa]">Faturamento Bruto</p>
          <p className="mt-1 text-xl font-bold text-white">{formatarMoeda(bruto)}</p>
        </div>
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <p className="text-xs text-[#9999aa]">Taxa iDrink (10%)</p>
          <p className="mt-1 text-xl font-bold text-red-400">-{formatarMoeda(taxa)}</p>
        </div>
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <p className="text-xs text-[#9999aa]">Liquido a Receber</p>
          <p className="mt-1 text-xl font-bold text-green-400">{formatarMoeda(liquido)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">Transacoes</h3>
        {entregues.length === 0 ? <p className="text-sm text-[#9999aa]">Nenhuma transacao ainda</p> : (
          <div className="flex flex-col gap-2">
            {entregues.slice(0, 10).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-3 text-sm">
                <div>
                  <span className="text-white">#{p.id}</span>
                  <span className="ml-2 text-[#9999aa]">{p.usuarioNome}</span>
                </div>
                <span className="font-medium text-green-400">{formatarMoeda(p.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => addToast('Solicitacao de saque enviada! Processamento em ate 3 dias uteis.', 'info')} className="rounded-full bg-[#e63946] px-6 py-3 font-semibold text-white hover:opacity-90">
        Solicitar Saque
      </button>
    </div>
  )
}

function ClientesAba({ pedidosLoja, loja }: any) {
  const [busca, setBusca] = useState('')
  const clientes = useMemo(() => {
    const map: Record<string, { nome: string; telefone: string; pedidos: number; total: number; ultimo: number }> = {}
    pedidosLoja.forEach((p: any) => {
      if (!map[p.usuarioId]) {
        map[p.usuarioId] = { nome: p.usuarioNome, telefone: p.usuarioTelefone, pedidos: 0, total: 0, ultimo: 0 }
      }
      map[p.usuarioId].pedidos++
      map[p.usuarioId].total += p.total
      map[p.usuarioId].ultimo = Math.max(map[p.usuarioId].ultimo, p.createdAt)
    })
    return Object.values(map).filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
  }, [pedidosLoja, busca])

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white">Clientes</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
        <input placeholder="Buscar cliente..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#12121a] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
      </div>
      {clientes.length === 0 ? <p className="py-8 text-center text-sm text-[#9999aa]">Nenhum cliente encontrado</p> : (
        <div className="flex flex-col gap-3">
          {clientes.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
              <div>
                <p className="font-medium text-white">{c.nome}</p>
                <p className="text-xs text-[#9999aa]">{c.pedidos} pedidos - {formatarMoeda(c.total)} total</p>
              </div>
              <button onClick={() => whatsappCliente(c.telefone, '', loja.nome)} className="rounded-xl bg-green-600/15 p-2 text-green-400 hover:bg-green-600/25">
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProdutosAba({ loja, adicionarProduto, atualizarProduto, removerProduto, addToast }: any) {
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('Cerveja')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [precoPromo, setPrecoPromo] = useState('')
  const [estoque, setEstoque] = useState('10')
  const [disponivel, setDisponivel] = useState(true)
  const [destaque, setDestaque] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  function resetForm() {
    setNome(''); setCategoria('Cerveja'); setDescricao(''); setPreco(''); setPrecoPromo(''); setEstoque('10'); setDisponivel(true); setDestaque(false); setEditando(null)
  }

  function handleSave() {
    if (!nome || !preco) { addToast('Preencha nome e preco', 'erro'); return }
    const produto: Produto = {
      id: editando || gerarId('prod'),
      nome, categoria, descricao,
      preco: Number(preco),
      precoOriginal: precoPromo ? Number(precoPromo) : undefined,
      estoque: Number(estoque),
      disponivel, destaque,
    }
    if (editando) {
      atualizarProduto(loja.id, editando, produto)
      addToast('Produto atualizado')
    } else {
      adicionarProduto(loja.id, produto)
      addToast('Produto adicionado')
    }
    resetForm()
    setFormAberto(false)
  }

  function startEdit(p: Produto) {
    setEditando(p.id); setNome(p.nome); setCategoria(p.categoria); setDescricao(p.descricao); setPreco(String(p.preco)); setPrecoPromo(p.precoOriginal ? String(p.precoOriginal) : ''); setEstoque(String(p.estoque)); setDisponivel(p.disponivel); setDestaque(p.destaque); setFormAberto(true)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Produtos ({loja.produtos.length})</h2>
        <button onClick={() => { resetForm(); setFormAberto(!formAberto) }} className="flex items-center gap-2 rounded-full bg-[#e63946] px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {formAberto && (
        <div className="mb-6 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
          <div className="flex flex-col gap-3">
            <input placeholder="Nome *" value={nome} onChange={e => setNome(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none">
              {['Cerveja', 'Whisky', 'Vodka', 'Gin', 'Vinho', 'Energetico', 'Combos', 'Agua', 'Refrigerante', 'Outros'].map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="Descricao" value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none resize-none" />
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="Preco *" type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
              <input placeholder="Preco original" type="number" step="0.01" value={precoPromo} onChange={e => setPrecoPromo(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
              <input placeholder="Estoque" type="number" value={estoque} onChange={e => setEstoque(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-[#9999aa]">
                <input type="checkbox" checked={disponivel} onChange={e => setDisponivel(e.target.checked)} className="accent-[#e63946]" /> Disponivel
              </label>
              <label className="flex items-center gap-2 text-sm text-[#9999aa]">
                <input type="checkbox" checked={destaque} onChange={e => setDestaque(e.target.checked)} className="accent-[#e63946]" /> Destaque
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 rounded-xl bg-[#e63946] py-2.5 text-sm font-semibold text-white">Salvar</button>
              <button onClick={() => { resetForm(); setFormAberto(false) }} className="flex-1 rounded-xl border border-[#2a2a3a] py-2.5 text-sm text-[#9999aa]">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loja.produtos.map((p: Produto) => (
          <div key={p.id} className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{p.nome}</h4>
                <p className="text-xs text-[#9999aa]">{p.categoria}</p>
              </div>
              <span className={`text-xs ${p.disponivel ? 'text-green-400' : 'text-red-400'}`}>{p.disponivel ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold text-[#e63946]">{formatarMoeda(p.preco)}</span>
              <span className="text-xs text-[#9999aa]">Estoque: {p.estoque}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => startEdit(p)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#2a2a3a] py-1.5 text-xs text-[#9999aa] hover:text-white">
                <Pencil className="h-3 w-3" /> Editar
              </button>
              <button onClick={() => setConfirmRemove(p.id)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#2a2a3a] py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-3 w-3" /> Remover
              </button>
            </div>
            {confirmRemove === p.id && (
              <div className="mt-2 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-2">
                <button onClick={() => { removerProduto(loja.id, p.id); addToast('Produto removido', 'erro'); setConfirmRemove(null) }} className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-medium text-white">Confirmar</button>
                <button onClick={() => setConfirmRemove(null)} className="flex-1 rounded-lg border border-[#2a2a3a] py-1.5 text-xs text-[#9999aa]">Cancelar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfigAba({ loja, atualizarLoja, comerciante, addToast }: any) {
  const [nomeLoja, setNomeLoja] = useState(loja.nome)
  const [desc, setDesc] = useState(loja.descricao)
  const [wpp, setWpp] = useState(loja.whatsapp)
  const [notif, setNotif] = useState(loja.notificacoesWhatsapp)
  const [pixTipo, setPixTipo] = useState(loja.pixTipo || 'CPF')
  const [pixChave, setPixChave] = useState(loja.pixChave || '')

  function salvar() {
    atualizarLoja(loja.id, { nome: nomeLoja, descricao: desc, whatsapp: wpp, notificacoesWhatsapp: notif, pixTipo, pixChave })
    addToast('Configuracoes salvas')
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white">Configuracoes</h2>
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Informacoes da Loja</h3>
          <div className="flex flex-col gap-3">
            <input placeholder="Nome da loja" value={nomeLoja} onChange={e => setNomeLoja(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
            <textarea placeholder="Descricao" value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none resize-none" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Chave PIX</h3>
          <div className="flex flex-col gap-3">
            <select value={pixTipo} onChange={e => setPixTipo(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none">
              <option>CPF</option><option>CNPJ</option><option>E-mail</option><option>Telefone</option><option>Aleatoria</option>
            </select>
            <input placeholder="Chave PIX" value={pixChave} onChange={e => setPixChave(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
            {pixChave && (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixChave)}&bgcolor=0a0a0f&color=ffffff`} alt="QR Code PIX" className="mx-auto rounded-lg" width={180} height={180} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">WhatsApp Notificacoes</h3>
          <input placeholder="Numero WhatsApp" value={wpp} onChange={e => setWpp(e.target.value)} className="mb-3 w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
          <label className="flex items-center justify-between">
            <span className="text-sm text-[#9999aa]">Receber notificacoes</span>
            <button onClick={() => setNotif(!notif)} className={`relative h-6 w-11 rounded-full transition-all ${notif ? 'bg-[#e63946]' : 'bg-[#2a2a3a]'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${notif ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </label>
        </div>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Dados do Responsavel</h3>
          <div className="flex flex-col gap-2 text-sm text-[#9999aa]">
            <p>Nome: {comerciante.nome}</p>
            <p>E-mail: {comerciante.email}</p>
            <p>Documento: {comerciante.cpfCnpj}</p>
          </div>
        </div>

        <button onClick={salvar} className="rounded-full bg-[#e63946] py-3.5 font-semibold text-white hover:opacity-90">Salvar Configuracoes</button>
      </div>
    </div>
  )
}

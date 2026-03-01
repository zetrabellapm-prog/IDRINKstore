'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { lojasIniciais, pedidosIniciais } from './data'

export interface Produto {
  id: string
  nome: string
  categoria: string
  descricao: string
  preco: number
  precoOriginal?: number
  estoque: number
  foto?: string
  destaque: boolean
  disponivel: boolean
}

export interface Loja {
  id: string
  slug: string
  nome: string
  descricao: string
  logo?: string
  capa?: string
  categoria: string
  avaliacao: number
  totalAvaliacoes: number
  tempoEntrega: string
  freteGratis: number
  taxaEntrega: number
  horarioAbertura: string
  horarioFechamento: string
  whatsapp: string
  notificacoesWhatsapp: boolean
  pixChave: string
  pixTipo: string
  produtos: Produto[]
  ativo: boolean
  aberto: boolean
  createdAt: number
  comercianteId: string
}

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

export interface Carrinho {
  lojaId: string | null
  lojaNome: string
  itens: ItemCarrinho[]
}

export interface Endereco {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  referencia: string
  tipo: 'casa' | 'trabalho' | 'outro'
}

export interface Pedido {
  id: string
  lojaId: string
  lojaNome: string
  usuarioId: string
  usuarioNome: string
  usuarioTelefone: string
  itens: { nome: string; quantidade: number; preco: number }[]
  total: number
  subtotal: number
  taxaEntrega: number
  desconto: number
  pagamento: string
  endereco: Endereco
  status: 'Novo' | 'Confirmado' | 'Em Preparo' | 'Saiu para Entrega' | 'Entregue' | 'Cancelado'
  createdAt: number
  updatedAt: number
}

export interface Comerciante {
  id: string
  nome: string
  email: string
  whatsapp: string
  cpfCnpj: string
  lojaId: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone: string
  enderecos: Endereco[]
}

interface IDrinkContextType {
  lojas: Loja[]
  pedidos: Pedido[]
  carrinho: Carrinho
  comercianteLogado: Comerciante | null
  usuarioLogado: Usuario | null
  favoritos: string[]
  toasts: { id: string; msg: string; tipo: 'sucesso' | 'erro' | 'info' }[]

  adicionarLoja: (loja: Loja) => void
  atualizarLoja: (id: string, dados: Partial<Loja>) => void
  toggleLojaAberta: (id: string) => void
  adicionarProduto: (lojaId: string, produto: Produto) => void
  atualizarProduto: (lojaId: string, produtoId: string, dados: Partial<Produto>) => void
  removerProduto: (lojaId: string, produtoId: string) => void
  adicionarAoCarrinho: (lojaId: string, lojaNome: string, produto: Produto) => 'ok' | 'conflito'
  confirmarTrocaLoja: (lojaId: string, lojaNome: string, produto: Produto) => void
  removerDoCarrinho: (produtoId: string) => void
  alterarQuantidade: (produtoId: string, delta: number) => void
  limparCarrinho: () => void
  adicionarPedido: (pedido: Pedido) => void
  atualizarStatusPedido: (pedidoId: string, status: Pedido['status']) => void
  cadastrarComerciante: (comerciante: Comerciante, loja: Loja) => void
  loginComerciantePorLojaId: (lojaId: string) => void
  loginUsuarioMock: () => void
  logout: () => void
  toggleFavorito: (lojaId: string) => void
  addToast: (msg: string, tipo?: 'sucesso' | 'erro' | 'info') => void
}

const IDrinkContext = createContext<IDrinkContextType | null>(null)

export function useIDrink() {
  const ctx = useContext(IDrinkContext)
  if (!ctx) throw new Error('useIDrink deve ser usado dentro de IDrinkProvider')
  return ctx
}

const usuarioMock: Usuario = {
  id: 'user-1',
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 99999-1234',
  enderecos: [],
}

export function IDrinkProvider({ children }: { children: ReactNode }) {
  const [lojas, setLojas] = useState<Loja[]>(lojasIniciais)
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais)
  const [carrinho, setCarrinho] = useState<Carrinho>({ lojaId: null, lojaNome: '', itens: [] })
  const [comercianteLogado, setComercianteLogado] = useState<Comerciante | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(usuarioMock)
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [toasts, setToasts] = useState<{ id: string; msg: string; tipo: 'sucesso' | 'erro' | 'info' }[]>([])

  const addToast = useCallback((msg: string, tipo: 'sucesso' | 'erro' | 'info' = 'sucesso') => {
    const id = Date.now().toString()
    setToasts(t => [...t, { id, msg, tipo }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const adicionarLoja = useCallback((loja: Loja) => setLojas(l => [...l, loja]), [])

  const atualizarLoja = useCallback((id: string, dados: Partial<Loja>) =>
    setLojas(l => l.map(loja => loja.id === id ? { ...loja, ...dados } : loja)), [])

  const toggleLojaAberta = useCallback((id: string) =>
    setLojas(l => l.map(loja => loja.id === id ? { ...loja, aberto: !loja.aberto } : loja)), [])

  const adicionarProduto = useCallback((lojaId: string, produto: Produto) =>
    setLojas(l => l.map(loja =>
      loja.id === lojaId ? { ...loja, produtos: [...loja.produtos, produto] } : loja
    )), [])

  const atualizarProduto = useCallback((lojaId: string, produtoId: string, dados: Partial<Produto>) =>
    setLojas(l => l.map(loja =>
      loja.id === lojaId
        ? { ...loja, produtos: loja.produtos.map(p => p.id === produtoId ? { ...p, ...dados } : p) }
        : loja
    )), [])

  const removerProduto = useCallback((lojaId: string, produtoId: string) =>
    setLojas(l => l.map(loja =>
      loja.id === lojaId
        ? { ...loja, produtos: loja.produtos.filter(p => p.id !== produtoId) }
        : loja
    )), [])

  const adicionarAoCarrinho = useCallback((lojaId: string, lojaNome: string, produto: Produto): 'ok' | 'conflito' => {
    if (carrinho.lojaId && carrinho.lojaId !== lojaId && carrinho.itens.length > 0) return 'conflito'
    setCarrinho(c => {
      const existente = c.itens.find(i => i.produto.id === produto.id)
      if (existente) {
        return { ...c, itens: c.itens.map(i => i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i) }
      }
      return { lojaId, lojaNome, itens: [...c.itens, { produto, quantidade: 1 }] }
    })
    return 'ok'
  }, [carrinho])

  const confirmarTrocaLoja = useCallback((lojaId: string, lojaNome: string, produto: Produto) =>
    setCarrinho({ lojaId, lojaNome, itens: [{ produto, quantidade: 1 }] }), [])

  const removerDoCarrinho = useCallback((produtoId: string) =>
    setCarrinho(c => {
      const novosItens = c.itens.filter(i => i.produto.id !== produtoId)
      return novosItens.length === 0 ? { lojaId: null, lojaNome: '', itens: [] } : { ...c, itens: novosItens }
    }), [])

  const alterarQuantidade = useCallback((produtoId: string, delta: number) =>
    setCarrinho(c => {
      const novosItens = c.itens
        .map(i => i.produto.id === produtoId ? { ...i, quantidade: i.quantidade + delta } : i)
        .filter(i => i.quantidade > 0)
      return novosItens.length === 0 ? { lojaId: null, lojaNome: '', itens: [] } : { ...c, itens: novosItens }
    }), [])

  const limparCarrinho = useCallback(() =>
    setCarrinho({ lojaId: null, lojaNome: '', itens: [] }), [])

  const adicionarPedido = useCallback((pedido: Pedido) =>
    setPedidos(p => [pedido, ...p]), [])

  const atualizarStatusPedido = useCallback((pedidoId: string, status: Pedido['status']) =>
    setPedidos(p => p.map(ped =>
      ped.id === pedidoId ? { ...ped, status, updatedAt: Date.now() } : ped
    )), [])

  const cadastrarComerciante = useCallback((comerciante: Comerciante, loja: Loja) => {
    setLojas(l => [...l, loja])
    setComercianteLogado(comerciante)
  }, [])

  const loginComerciantePorLojaId = useCallback((lojaId: string) => {
    const loja = lojas.find(l => l.id === lojaId)
    if (loja) {
      setComercianteLogado({
        id: loja.comercianteId,
        nome: 'Demo Comerciante',
        email: 'comerciante@idrink.com',
        whatsapp: loja.whatsapp,
        cpfCnpj: '000.000.000-00',
        lojaId: loja.id,
      })
    }
  }, [lojas])

  const loginUsuarioMock = useCallback(() => setUsuarioLogado(usuarioMock), [])

  const logout = useCallback(() => {
    setComercianteLogado(null)
    setUsuarioLogado(null)
  }, [])

  const toggleFavorito = useCallback((lojaId: string) =>
    setFavoritos(f => f.includes(lojaId) ? f.filter(id => id !== lojaId) : [...f, lojaId]), [])

  return (
    <IDrinkContext.Provider value={{
      lojas, pedidos, carrinho, comercianteLogado, usuarioLogado, favoritos, toasts,
      adicionarLoja, atualizarLoja, toggleLojaAberta,
      adicionarProduto, atualizarProduto, removerProduto,
      adicionarAoCarrinho, confirmarTrocaLoja, removerDoCarrinho, alterarQuantidade, limparCarrinho,
      adicionarPedido, atualizarStatusPedido,
      cadastrarComerciante, loginComerciantePorLojaId, loginUsuarioMock, logout,
      toggleFavorito, addToast,
    }}>
      {children}
    </IDrinkContext.Provider>
  )
}

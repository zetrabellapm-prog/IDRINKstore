// lib/types.ts
// Todos os tipos ficam aqui — nem context.tsx nem data.ts importam um do outro

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

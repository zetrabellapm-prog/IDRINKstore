'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIDrink } from '@/lib/context'
import { formatarMoeda, mascaraCEP, mascaraTelefone, mascaraCartao, mascaraValidade, buscarCEP, gerarId } from '@/lib/utils'
import { notificarComercianteWhatsApp } from '@/lib/whatsapp'
import type { Pedido, Endereco } from '@/lib/context'
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChevronDown, ChevronUp,
  MapPin, User, CreditCard, Gift, Loader2, Copy, Check, Home, Briefcase, MapPinned
} from 'lucide-react'

const categoriaEmoji: Record<string, string> = {
  'Cerveja': '🍺', 'Whisky': '🥃', 'Vodka': '🍸', 'Gin': '🍸',
  'Vinho': '🍷', 'Energetico': '⚡', 'Combos': '🎉', 'Agua': '💧',
  'Refrigerante': '🥤', 'Outros': '🍹',
}

export default function CarrinhoCheckoutPage() {
  const router = useRouter()
  const {
    carrinho, lojas, usuarioLogado,
    alterarQuantidade, removerDoCarrinho, limparCarrinho,
    adicionarPedido, addToast
  } = useIDrink()

  const loja = lojas.find(l => l.id === carrinho.lojaId)

  // Accordion states
  const [enderecoAberto, setEnderecoAberto] = useState(true)
  const [destinatarioAberto, setDestinatarioAberto] = useState(false)
  const [pagamentoAberto, setPagamentoAberto] = useState(false)
  const [cupomAberto, setCupomAberto] = useState(false)

  // Endereco
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [referencia, setReferencia] = useState('')
  const [tipoEndereco, setTipoEndereco] = useState<'casa' | 'trabalho' | 'outro'>('casa')
  const [buscandoCep, setBuscandoCep] = useState(false)

  // Destinatario
  const [nomeDestinatario, setNomeDestinatario] = useState(usuarioLogado?.nome || '')
  const [telefoneDestinatario, setTelefoneDestinatario] = useState(usuarioLogado?.telefone || '')
  const [souEuMesmo, setSouEuMesmo] = useState(true)

  // Pagamento
  const [formaPagamento, setFormaPagamento] = useState('pix')
  const [cartaoNumero, setCartaoNumero] = useState('')
  const [cartaoValidade, setCartaoValidade] = useState('')
  const [cartaoCvv, setCartaoCvv] = useState('')
  const [cartaoNome, setCartaoNome] = useState('')
  const [cartaoTipo, setCartaoTipo] = useState<'credito' | 'debito'>('credito')
  const [parcelas, setParcelas] = useState(1)
  const [trocoPara, setTrocoPara] = useState('')
  const [valeBandeira, setValeBandeira] = useState('Alelo')
  const [pixCopiado, setPixCopiado] = useState(false)

  // Cupom
  const [cupomInput, setCupomInput] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null)
  const [cupomErro, setCupomErro] = useState(false)

  // Geral
  const [processando, setProcessando] = useState(false)
  const [errosSecao, setErrosSecao] = useState<string[]>([])

  const enderecoRef = useRef<HTMLDivElement>(null)
  const pagamentoRef = useRef<HTMLDivElement>(null)

  const subtotal = carrinho.itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0)
  const taxaEntrega = (() => {
    if (cupomAplicado === 'FRETEGRATIS') return 0
    if (loja && subtotal >= loja.freteGratis) return 0
    return loja?.taxaEntrega || 0
  })()
  const desconto = (() => {
    if (cupomAplicado === 'IDRINK10') return subtotal * 0.1
    if (cupomAplicado === 'BEMVINDO') return 5
    return 0
  })()
  const total = subtotal + taxaEntrega - desconto

  async function handleCepChange(value: string) {
    const mascarado = mascaraCEP(value)
    setCep(mascarado)
    const raw = mascarado.replace(/\D/g, '')
    if (raw.length === 8) {
      setBuscandoCep(true)
      const resultado = await buscarCEP(raw)
      setBuscandoCep(false)
      if (resultado) {
        setRua(resultado.rua)
        setBairro(resultado.bairro)
        setCidade(resultado.cidade)
        setEstado(resultado.estado)
      } else {
        addToast('CEP nao encontrado', 'erro')
      }
    }
  }

  function aplicarCupom() {
    const cupons: Record<string, boolean> = { 'IDRINK10': true, 'BEMVINDO': true, 'FRETEGRATIS': true }
    const code = cupomInput.toUpperCase().trim()
    if (cupons[code]) {
      setCupomAplicado(code)
      setCupomErro(false)
      addToast(`Cupom ${code} aplicado!`)
    } else {
      setCupomErro(true)
      setCupomAplicado(null)
      addToast('Cupom invalido', 'erro')
    }
  }

  function copiarPix() {
    const codigo = `iDrink-PIX-${Date.now()}`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codigo)
    }
    setPixCopiado(true)
    setTimeout(() => setPixCopiado(false), 2000)
    addToast('Codigo Pix copiado!', 'info')
  }

  function handleFazerPedido() {
    const erros: string[] = []
    if (!cep || cep.replace(/\D/g, '').length < 8 || !numero) {
      erros.push('endereco')
    }
    if (!formaPagamento) {
      erros.push('pagamento')
    }
    setErrosSecao(erros)
    if (erros.length > 0) {
      if (erros.includes('endereco')) {
        setEnderecoAberto(true)
        enderecoRef.current?.scrollIntoView({ behavior: 'smooth' })
      } else if (erros.includes('pagamento')) {
        setPagamentoAberto(true)
        pagamentoRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      addToast('Preencha os campos obrigatorios', 'erro')
      return
    }

    setProcessando(true)
    setTimeout(() => {
      const pedidoId = gerarId()
      const endereco: Endereco = { cep, rua, numero, complemento, bairro, cidade, estado, referencia, tipo: tipoEndereco }

      const pagamentoLabel = formaPagamento === 'pix' ? 'Pix'
        : formaPagamento === 'cartao' ? `Cartao de ${cartaoTipo === 'credito' ? 'Credito' : 'Debito'}`
        : formaPagamento === 'dinheiro' ? 'Dinheiro'
        : `Vale (${valeBandeira})`

      const novoPedido: Pedido = {
        id: pedidoId,
        lojaId: carrinho.lojaId || '',
        lojaNome: carrinho.lojaNome,
        usuarioId: usuarioLogado?.id || 'user-1',
        usuarioNome: nomeDestinatario,
        usuarioTelefone: telefoneDestinatario,
        itens: carrinho.itens.map(i => ({ nome: i.produto.nome, quantidade: i.quantidade, preco: i.produto.preco })),
        total,
        subtotal,
        taxaEntrega,
        desconto,
        pagamento: pagamentoLabel,
        endereco,
        status: 'Novo',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      adicionarPedido(novoPedido)
      if (loja) notificarComercianteWhatsApp(loja, novoPedido)
      limparCarrinho()
      setProcessando(false)
      router.push(`/confirmacao?id=${pedidoId}`)
    }, 2000)
  }

  if (carrinho.itens.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 rounded-full bg-[#1a1a26] p-6">
          <ShoppingBag className="h-12 w-12 text-[#9999aa]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Seu carrinho esta vazio</h1>
        <p className="mt-2 text-[#9999aa]">Adicione produtos ao seu carrinho para continuar</p>
        <Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e63946] px-6 py-3 font-semibold text-white hover:opacity-90">
          Ver lojas
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <Link href="/home" className="mb-4 inline-flex items-center gap-2 text-sm text-[#9999aa] hover:text-[#e63946]">
        <ArrowLeft className="h-4 w-4" /> Continuar comprando
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Left Column - Items */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Seu Carrinho</h1>
              <p className="text-sm text-[#9999aa]">{carrinho.lojaNome} - {carrinho.itens.reduce((s, i) => s + i.quantidade, 0)} itens</p>
            </div>
            <button onClick={limparCarrinho} className="flex items-center gap-2 rounded-xl border border-[#2a2a3a] px-4 py-2 text-sm text-[#9999aa] hover:border-red-500/50 hover:text-red-400">
              <Trash2 className="h-4 w-4" /> Esvaziar
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {carrinho.itens.map(item => (
              <div key={item.produto.id} className="flex items-center gap-4 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#1a1a26] text-2xl">
                  {categoriaEmoji[item.produto.categoria] || '🍹'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{item.produto.nome}</h3>
                  <p className="text-xs text-[#9999aa]">{formatarMoeda(item.produto.preco)} un.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => alterarQuantidade(item.produto.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a26] text-[#9999aa] hover:text-white" aria-label="Diminuir">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-white">{item.quantidade}</span>
                  <button onClick={() => alterarQuantidade(item.produto.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a26] text-[#9999aa] hover:text-white" aria-label="Aumentar">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm font-bold text-[#e63946] whitespace-nowrap">{formatarMoeda(item.produto.preco * item.quantidade)}</span>
                <button onClick={() => removerDoCarrinho(item.produto.id)} className="text-[#9999aa] hover:text-red-400" aria-label="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => router.back()} className="mt-4 text-sm text-[#00b4d8] hover:underline">
            + Adicionar mais itens
          </button>
        </div>

        {/* Right Column - Checkout */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          {/* Endereco */}
          <div ref={enderecoRef} className={`rounded-2xl border bg-[#12121a] ${errosSecao.includes('endereco') ? 'border-red-500' : 'border-[#2a2a3a]'}`}>
            <button onClick={() => setEnderecoAberto(!enderecoAberto)} className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#e63946]" />
                <span className="font-semibold text-white">Endereco</span>
              </div>
              {enderecoAberto ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
            </button>
            {enderecoAberto && (
              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="relative">
                  <input placeholder="CEP *" value={cep} onChange={e => handleCepChange(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
                  {buscandoCep && <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-[#9999aa]" />}
                </div>
                {rua && <input placeholder="Rua" value={rua} readOnly className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-[#9999aa]" />}
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Numero *" value={numero} onChange={e => setNumero(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
                  <input placeholder="Complemento" value={complemento} onChange={e => setComplemento(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
                </div>
                {bairro && <input placeholder="Bairro" value={bairro} readOnly className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-[#9999aa]" />}
                <input placeholder="Referencia" value={referencia} onChange={e => setReferencia(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
                <div className="flex gap-2">
                  {([['casa', Home, 'Casa'], ['trabalho', Briefcase, 'Trabalho'], ['outro', MapPinned, 'Outro']] as const).map(([tipo, Icon, label]) => (
                    <button key={tipo} onClick={() => setTipoEndereco(tipo)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-xs font-medium transition-all ${tipoEndereco === tipo ? 'border-[#e63946] bg-[#e63946]/10 text-[#e63946]' : 'border-[#2a2a3a] text-[#9999aa] hover:border-[#e63946]/50'}`}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Destinatario */}
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
            <button onClick={() => setDestinatarioAberto(!destinatarioAberto)} className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#e63946]" />
                <span className="font-semibold text-white">Destinatario</span>
              </div>
              {destinatarioAberto ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
            </button>
            {destinatarioAberto && (
              <div className="flex flex-col gap-3 px-4 pb-4">
                <label className="flex items-center gap-2 text-sm text-[#9999aa]">
                  <input type="checkbox" checked={souEuMesmo} onChange={e => { setSouEuMesmo(e.target.checked); if (e.target.checked && usuarioLogado) { setNomeDestinatario(usuarioLogado.nome); setTelefoneDestinatario(usuarioLogado.telefone) } }} className="accent-[#e63946]" />
                  Sou eu mesmo
                </label>
                <input placeholder="Nome *" value={nomeDestinatario} onChange={e => setNomeDestinatario(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
                <input placeholder="Telefone *" value={telefoneDestinatario} onChange={e => setTelefoneDestinatario(mascaraTelefone(e.target.value))} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none" />
              </div>
            )}
          </div>

          {/* Pagamento */}
          <div ref={pagamentoRef} className={`rounded-2xl border bg-[#12121a] ${errosSecao.includes('pagamento') ? 'border-red-500' : 'border-[#2a2a3a]'}`}>
            <button onClick={() => setPagamentoAberto(!pagamentoAberto)} className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#e63946]" />
                <span className="font-semibold text-white">Pagamento</span>
              </div>
              {pagamentoAberto ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
            </button>
            {pagamentoAberto && (
              <div className="flex flex-col gap-3 px-4 pb-4">
                {/* PIX */}
                <button onClick={() => setFormaPagamento('pix')} className={`flex flex-col rounded-xl border p-4 text-left transition-all ${formaPagamento === 'pix' ? 'border-green-500 bg-green-500/5' : 'border-[#2a2a3a] hover:border-green-500/50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">PIX</span>
                    {formaPagamento === 'pix' && <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-400">Sem taxas</span>}
                  </div>
                  {formaPagamento === 'pix' && (
                    <div className="mt-3 flex flex-col items-center gap-3">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=iDrink-PIX-${Date.now()}&bgcolor=0a0a0f&color=ffffff`} alt="QR Code PIX" className="rounded-lg" width={150} height={150} />
                      <div className="flex w-full items-center gap-2">
                        <input readOnly value={`iDrink-PIX-${Date.now().toString().slice(-8)}`} className="flex-1 rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-xs text-[#9999aa]" />
                        <button onClick={copiarPix} className="flex items-center gap-1 rounded-lg bg-[#1a1a26] px-3 py-2 text-xs text-white hover:bg-[#2a2a3a]">
                          {pixCopiado ? <><Check className="h-3 w-3" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
                        </button>
                      </div>
                    </div>
                  )}
                </button>

                {/* Cartao */}
                <button onClick={() => setFormaPagamento('cartao')} className={`flex flex-col rounded-xl border p-4 text-left transition-all ${formaPagamento === 'cartao' ? 'border-[#00b4d8] bg-[#00b4d8]/5' : 'border-[#2a2a3a] hover:border-[#00b4d8]/50'}`}>
                  <span className="font-medium text-white">Cartao</span>
                  {formaPagamento === 'cartao' && (
                    <div className="mt-3 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setCartaoTipo('credito')} className={`flex-1 rounded-lg py-2 text-xs font-medium ${cartaoTipo === 'credito' ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>Credito</button>
                        <button type="button" onClick={() => setCartaoTipo('debito')} className={`flex-1 rounded-lg py-2 text-xs font-medium ${cartaoTipo === 'debito' ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>Debito</button>
                      </div>
                      <input placeholder="Numero do cartao" value={cartaoNumero} onChange={e => setCartaoNumero(mascaraCartao(e.target.value))} className="w-full rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                      <input placeholder="Nome no cartao" value={cartaoNome} onChange={e => setCartaoNome(e.target.value)} className="w-full rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="MM/AA" value={cartaoValidade} onChange={e => setCartaoValidade(mascaraValidade(e.target.value))} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                        <input placeholder="CVV" value={cartaoCvv} onChange={e => setCartaoCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                      </div>
                      {cartaoTipo === 'credito' && (
                        <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))} className="rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white focus:outline-none">
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}x de {formatarMoeda(total / n)}{n === 1 ? ' sem juros' : ''}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </button>

                {/* Dinheiro */}
                <button onClick={() => setFormaPagamento('dinheiro')} className={`flex flex-col rounded-xl border p-4 text-left transition-all ${formaPagamento === 'dinheiro' ? 'border-yellow-500 bg-yellow-500/5' : 'border-[#2a2a3a] hover:border-yellow-500/50'}`}>
                  <span className="font-medium text-white">Dinheiro</span>
                  {formaPagamento === 'dinheiro' && (
                    <div className="mt-3" onClick={e => e.stopPropagation()}>
                      <input placeholder="Troco para quanto?" value={trocoPara} onChange={e => setTrocoPara(e.target.value)} className="w-full rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                      {trocoPara && Number(trocoPara) > total && (
                        <p className="mt-2 text-xs text-yellow-400">Seu troco: {formatarMoeda(Number(trocoPara) - total)}</p>
                      )}
                    </div>
                  )}
                </button>

                {/* Vale */}
                <button onClick={() => setFormaPagamento('vale')} className={`flex flex-col rounded-xl border p-4 text-left transition-all ${formaPagamento === 'vale' ? 'border-purple-500 bg-purple-500/5' : 'border-[#2a2a3a] hover:border-purple-500/50'}`}>
                  <span className="font-medium text-white">Vale Refeicao</span>
                  {formaPagamento === 'vale' && (
                    <div className="mt-3" onClick={e => e.stopPropagation()}>
                      <select value={valeBandeira} onChange={e => setValeBandeira(e.target.value)} className="w-full rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2 text-sm text-white focus:outline-none">
                        <option>Alelo</option>
                        <option>Ticket</option>
                        <option>Sodexo</option>
                        <option>VR</option>
                      </select>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Cupom */}
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
            <button onClick={() => setCupomAberto(!cupomAberto)} className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#e63946]" />
                <span className="font-semibold text-white">Cupom</span>
                {cupomAplicado && <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-400">{cupomAplicado}</span>}
              </div>
              {cupomAberto ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
            </button>
            {cupomAberto && (
              <div className="flex gap-2 px-4 pb-4">
                <input placeholder="Digite o cupom" value={cupomInput} onChange={e => { setCupomInput(e.target.value.toUpperCase()); setCupomErro(false) }} className={`flex-1 rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${cupomErro ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
                <button onClick={aplicarCupom} className="rounded-xl bg-[#e63946] px-4 py-3 text-sm font-semibold text-white hover:opacity-90">Aplicar</button>
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-[#9999aa]">
                <span>Subtotal</span>
                <span>{formatarMoeda(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#9999aa]">
                <span>Taxa de entrega</span>
                <span className={taxaEntrega === 0 ? 'text-green-400' : ''}>{taxaEntrega === 0 ? 'GRATIS' : formatarMoeda(taxaEntrega)}</span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto</span>
                  <span>-{formatarMoeda(desconto)}</span>
                </div>
              )}
              <div className="border-t border-[#2a2a3a] pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#e63946]">{formatarMoeda(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFazerPedido}
              disabled={processando}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#e63946] py-4 font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {processando ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processando...</>
              ) : (
                <><ShoppingBag className="h-5 w-5" /> Fazer Pedido - {formatarMoeda(total)}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

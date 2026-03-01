'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search, Star, Clock, Truck, ChevronLeft, ChevronRight,
  Store, Package, MapPin, Zap, ShoppingBag
} from 'lucide-react'
import { useIDrink } from '@/lib/context'

/* -- BANNERS PROMOCIONAIS -- */
const banners = [
  {
    gradient: 'from-amber-900 via-amber-800 to-yellow-900',
    emoji: '\u{1F37A}',
    titulo: 'Frete gratis acima de R$80',
    subtitulo: 'Em todas as lojas participantes hoje',
  },
  {
    gradient: 'from-blue-900 via-blue-800 to-indigo-900',
    emoji: '\u26A1',
    titulo: 'Entrega express em 20 minutos',
    subtitulo: 'Bebidas ON \u2014 disponivel na regiao central',
  },
  {
    gradient: 'from-rose-900 via-red-800 to-red-900',
    emoji: '\u{1F381}',
    titulo: 'Use o cupom IDRINK10',
    subtitulo: 'Ganhe 10% de desconto no seu pedido',
  },
]

/* -- CATEGORIAS DE FILTRO -- */
const categorias = [
  { label: 'Todos',               emoji: '\u{1F3EA}' },
  { label: 'Cerveja',             emoji: '\u{1F37A}' },
  { label: 'Whisky & Destilados', emoji: '\u{1F943}' },
  { label: 'Vodka',               emoji: '\u{1F37E}' },
  { label: 'Gin',                 emoji: '\u{1F378}' },
  { label: 'Energetico',          emoji: '\u26A1' },
  { label: 'Mix Completo',        emoji: '\u{1F6D2}' },
]

export default function HomePage() {
  const { lojas, pedidos, usuarioLogado, carrinho, adicionarAoCarrinho } = useIDrink()

  // -- Busca
  const [busca, setBusca] = useState('')
  const [buscaAberta, setBuscaAberta] = useState(false)
  const buscaRef = useRef<HTMLDivElement>(null)

  // -- Banner carousel
  const [bannerAtivo, setBannerAtivo] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setBannerAtivo(b => (b + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [])

  // -- Filtro de categoria
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  // -- Resultados de busca
  const resultadosBusca = busca.length > 1
    ? [
        ...lojas.map(l => ({ tipo: 'loja' as const, nome: l.nome, slug: l.slug, sub: l.categoria })),
        ...lojas.flatMap(l =>
          l.produtos.map(p => ({ tipo: 'produto' as const, nome: p.nome, slug: l.slug, sub: l.nome }))
        ),
      ].filter(r => r.nome.toLowerCase().includes(busca.toLowerCase())).slice(0, 8)
    : []

  // -- Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (buscaRef.current && !buscaRef.current.contains(e.target as Node)) {
        setBuscaAberta(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // -- Pedidos anteriores do usuario (para "Peca de Novo")
  const pedidosUsuario = pedidos.filter(
    p => p.usuarioId === usuarioLogado?.id && p.status === 'Entregue'
  )
  const lojasRecentes = [
    ...new Map(pedidosUsuario.map(p => [p.lojaId, p])).values(),
  ].slice(0, 2)

  // -- Lojas filtradas por categoria
  const lojasFiltradas = lojas.filter(
    l => l.ativo && (categoriaAtiva === 'Todos' || l.categoria === categoriaAtiva)
  )

  // -- Contagem do carrinho para bottom bar
  const totalItensCarrinho = carrinho.itens.reduce((s, i) => s + i.quantidade, 0)

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ backgroundColor: '#0a0a0f', color: '#ffffff' }}>

      {/* BARRA DE BUSCA */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative" ref={buscaRef}>
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: '#9999aa' }}
          />
          <input
            type="text"
            placeholder="Buscar bebidas, lojas..."
            value={busca}
            onChange={e => { setBusca(e.target.value); setBuscaAberta(true) }}
            onFocus={() => setBuscaAberta(true)}
            style={{
              background: '#1a1a26',
              border: '1px solid #2a2a3a',
              borderRadius: '50px',
              color: '#ffffff',
              padding: '12px 20px 12px 44px',
              width: '100%',
              fontSize: '14px',
              outline: 'none',
            }}
          />

          {/* Dropdown de resultados */}
          {buscaAberta && resultadosBusca.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden"
              style={{
                background: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {resultadosBusca.map((r, i) => (
                <Link
                  key={i}
                  href={`/store/${r.slug}`}
                  onClick={() => { setBusca(''); setBuscaAberta(false) }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: '1px solid #2a2a3a' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a1a26')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {r.tipo === 'loja'
                    ? <Store size={16} style={{ color: '#e63946', flexShrink: 0 }} />
                    : <Package size={16} style={{ color: '#00b4d8', flexShrink: 0 }} />
                  }
                  <div>
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{r.nome}</p>
                    <p style={{ color: '#9999aa', fontSize: '12px' }}>{r.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CAROUSEL DE BANNERS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: '16px', height: '140px' }}
        >
          {banners.map((b, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-gradient-to-r ${b.gradient} flex items-center px-8 gap-6`}
              style={{
                opacity: i === bannerAtivo ? 1 : 0,
                transition: 'opacity 0.7s ease',
              }}
            >
              <span style={{ fontSize: '52px', lineHeight: 1 }}>{b.emoji}</span>
              <div>
                <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
                  {b.titulo}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{b.subtitulo}</p>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerAtivo(i)}
                style={{
                  width: i === bannerAtivo ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === bannerAtivo ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  padding: 0,
                }}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* PECA DE NOVO (se tiver historico) */}
      {lojasRecentes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>
            {'\u{1F504}'} Peca de Novo
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {lojasRecentes.map(pedido => {
              const loja = lojas.find(l => l.id === pedido.lojaId)
              if (!loja) return null
              return (
                <Link
                  key={pedido.lojaId}
                  href={`/store/${loja.slug}`}
                  className="flex flex-col gap-2 shrink-0"
                  style={{
                    background: '#12121a',
                    border: '1px solid #2a2a3a',
                    borderRadius: '14px',
                    padding: '16px',
                    minWidth: '200px',
                    transition: 'border-color 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#e63946')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a3a')}
                >
                  <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px' }}>{loja.nome}</p>
                  <p style={{ color: '#9999aa', fontSize: '12px' }}>
                    {pedido.itens.slice(0, 2).map(i => i.nome).join(', ')}
                    {pedido.itens.length > 2 && '...'}
                  </p>
                  <span
                    style={{
                      background: '#e63946',
                      color: '#ffffff',
                      borderRadius: '50px',
                      padding: '6px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginTop: '4px',
                    }}
                  >
                    Pedir novamente
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* FILTROS DE CATEGORIA */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map(c => (
            <button
              key={c.label}
              onClick={() => setCategoriaAtiva(c.label)}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: categoriaAtiva === c.label ? 'none' : '1px solid #2a2a3a',
                background: categoriaAtiva === c.label ? '#e63946' : '#12121a',
                color: categoriaAtiva === c.label ? '#ffffff' : '#9999aa',
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* STATS RAPIDOS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { valor: `${lojas.length}+`,  label: 'Lojas Parceiras', icon: '\u{1F3EA}' },
            { valor: `${lojas.reduce((s, l) => s + l.produtos.length, 0)}+`, label: 'Produtos',  icon: '\u{1F4E6}' },
            { valor: '30min',             label: 'Entrega Media',   icon: '\u{1F6F5}' },
            { valor: '4.7\u2B50',         label: 'Avaliacao Media', icon: '\u2B50' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ color: '#e63946', fontWeight: 700, fontSize: '20px' }}>{s.valor}</div>
              <div style={{ color: '#9999aa', fontSize: '12px', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GRID DE LOJAS */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>
          {'\u{1F37A}'} Lojas disponiveis{categoriaAtiva !== 'Todos' && ` \u2014 ${categoriaAtiva}`}
        </h2>

        {lojasFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9999aa' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>{'\u{1F50D}'}</p>
            <p>Nenhuma loja encontrada para esta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lojasFiltradas.map(loja => (
              <Link
                key={loja.id}
                href={`/store/${loja.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#12121a',
                    border: '1px solid #2a2a3a',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#e63946'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#2a2a3a'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Capa da loja */}
                  <div
                    style={{
                      height: '120px',
                      background: 'linear-gradient(135deg, #1a1a26, #2a2a3a)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '56px',
                      opacity: 0.4,
                    }}
                  >
                    {loja.categoria.includes('Cerveja') ? '\u{1F37A}'
                      : loja.categoria.includes('Whisky') ? '\u{1F943}'
                      : loja.categoria.includes('Vodka') ? '\u{1F37E}'
                      : loja.categoria.includes('Gin') ? '\u{1F378}'
                      : loja.categoria.includes('Energetico') ? '\u26A1'
                      : '\u{1F6D2}'}

                    {/* Badge aberto/fechado */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '50px',
                        fontWeight: 600,
                        opacity: 1,
                        background: loja.aberto ? 'rgba(22,101,52,0.9)' : 'rgba(127,29,29,0.9)',
                        color: loja.aberto ? '#86efac' : '#fca5a5',
                      }}
                    >
                      {loja.aberto ? '\u{1F7E2} Aberto' : '\u{1F534} Fechado'}
                    </span>
                  </div>

                  {/* Informacoes */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ color: '#ffffff', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                      {loja.nome}
                    </h3>
                    <p
                      style={{
                        color: '#9999aa',
                        fontSize: '13px',
                        marginBottom: '12px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {loja.descricao}
                    </p>

                    {/* Badges de info */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9999aa', fontSize: '12px' }}>
                        <Star size={12} style={{ color: '#fbbf24' }} fill="#fbbf24" />
                        {loja.avaliacao} ({loja.totalAvaliacoes})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9999aa', fontSize: '12px' }}>
                        <Clock size={12} />
                        {loja.tempoEntrega}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9999aa', fontSize: '12px' }}>
                        <Truck size={12} />
                        {'Gratis +R$'}{loja.freteGratis}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SECAO "POR QUE IDRINK?" */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-8">
        <div
          style={{
            background: 'linear-gradient(135deg, #12121a, #1a1a26)',
            border: '1px solid #2a2a3a',
            borderRadius: '20px',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '24px', marginBottom: '8px' }}>
            Por que escolher o iDrink?
          </h2>
          <p style={{ color: '#9999aa', fontSize: '15px', marginBottom: '32px' }}>
            A experiencia mais moderna de pedir bebidas online.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '\u{1F680}', titulo: 'Entrega Rapida', desc: 'Receba suas bebidas em ate 30 minutos. Sem espera, sem complicacao.' },
              { emoji: '\u{1F512}', titulo: 'Pagamento Seguro', desc: 'Seus dados protegidos com criptografia de ponta a ponta.' },
              { emoji: '\u2B50', titulo: 'Melhores Lojas', desc: 'Adegas e distribuidoras avaliadas pela comunidade.' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#0a0a0f',
                  border: '1px solid #2a2a3a',
                  borderRadius: '14px',
                  padding: '24px',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ color: '#ffffff', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                  {item.titulo}
                </h3>
                <p style={{ color: '#9999aa', fontSize: '13px', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BARRA FLUTUANTE DO CARRINHO (aparece quando tem itens) */}
      {totalItensCarrinho > 0 && (
        <div
          className="fixed z-40 left-4 right-4 md:left-auto md:right-8 md:w-80"
          style={{ bottom: '80px' }}
        >
          <Link href="/carrinho" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: '#e63946',
                borderRadius: '50px',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 -4px 20px rgba(230,57,70,0.5)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '50px',
                  padding: '2px 10px',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {totalItensCarrinho}
              </span>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>
                {'\u{1F6D2}'} Ver carrinho
              </span>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>
                {'R$ '}{carrinho.itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0).toFixed(2)}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* BOTTOM NAV -- MOBILE */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: '#12121a',
          borderTop: '1px solid #2a2a3a',
        }}
      >
        <div style={{ display: 'flex' }}>
          {[
            { href: '/home',      label: 'Explorar', emoji: '\u{1F9ED}' },
            { href: '/carrinho',  label: 'Carrinho',  emoji: '\u{1F6D2}', badge: totalItensCarrinho },
            { href: '/pedidos',   label: 'Pedidos',   emoji: '\u{1F4E6}' },
            { href: '/perfil',    label: 'Perfil',    emoji: '\u{1F464}' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 0 8px',
                textDecoration: 'none',
                color: '#9999aa',
                fontSize: '10px',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1, marginBottom: '4px' }}>{item.emoji}</span>
              {item.badge && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(4px)',
                    background: '#e63946',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

    </div>
  )
}

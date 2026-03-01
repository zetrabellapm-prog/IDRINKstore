"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIDrink } from "@/lib/context"
import { formatarMoeda } from "@/lib/utils"
import { stores as legacyStores } from "@/data/stores"
import { StoreCard } from "@/components/marketplace/StoreCard"
import { CategoryFilter } from "@/components/marketplace/CategoryFilter"
import {
  MapPin, Search, X, Star, Clock, ChevronLeft, ChevronRight,
  ArrowRight, RefreshCw, Truck
} from "lucide-react"

const bannerSlides = [
  {
    title: "Bebidas geladas em minutos",
    subtitle: "Entrega rapida das melhores adegas da sua regiao",
    bg: "from-[#e63946]/20 to-[#0a0a0f]",
    accent: "#e63946",
  },
  {
    title: "Frete gratis acima de R$80",
    subtitle: "Economize no frete pedindo suas bebidas favoritas",
    bg: "from-[#00b4d8]/20 to-[#0a0a0f]",
    accent: "#00b4d8",
  },
  {
    title: "Seja parceiro iDrink",
    subtitle: "Cadastre sua loja e comece a vender hoje mesmo",
    bg: "from-[#e63946]/15 via-[#00b4d8]/10 to-[#0a0a0f]",
    accent: "#00b4d8",
    link: "/comerciante/cadastro",
  },
]

export default function MarketplacePage() {
  const router = useRouter()
  const { lojas: lojasContext, pedidos, usuarioLogado } = useIDrink()
  const [search, setSearch] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Merge legacy stores with context stores
  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    lojasContext.forEach(l => cats.add(l.categoria))
    legacyStores.forEach(s => s.categories.forEach(c => cats.add(c)))
    return Array.from(cats).sort()
  }, [lojasContext])

  // Filter legacy stores
  const filteredLegacyStores = useMemo(() => {
    return legacyStores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === null || store.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  // Filter context stores (exclude any that overlap with legacy stores by matching name)
  const legacyNames = useMemo(() => new Set(legacyStores.map(s => s.name.toLowerCase())), [])

  const filteredContextStores = useMemo(() => {
    return lojasContext.filter(loja => {
      if (legacyNames.has(loja.nome.toLowerCase())) return false
      const matchesSearch = loja.nome.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === null || loja.categoria === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [lojasContext, search, selectedCategory, legacyNames])

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (!search.trim()) return { lojas: [], produtos: [] }
    const q = search.toLowerCase()
    const lojas = lojasContext.filter(l => l.nome.toLowerCase().includes(q)).slice(0, 3)
    const produtos: { produto: { nome: string; preco: number; categoria: string }; loja: { slug: string; nome: string } }[] = []
    lojasContext.forEach(l => {
      l.produtos.forEach(p => {
        if (p.nome.toLowerCase().includes(q)) {
          produtos.push({ produto: { nome: p.nome, preco: p.preco, categoria: p.categoria }, loja: { slug: l.slug, nome: l.nome } })
        }
      })
    })
    return { lojas, produtos: produtos.slice(0, 5) }
  }, [search, lojasContext])

  // Peca de Novo
  const meusPedidos = pedidos.filter(p => p.usuarioId === (usuarioLogado?.id || "user-1") && p.status === "Entregue")
  const pedidosRecentes = meusPedidos.slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-[#ea1d2c]" />
          <span>Entregando na sua regiao</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          {usuarioLogado ? (
            <>
              Ola, <span className="text-[#ea1d2c]">{usuarioLogado.nome.split(" ")[0]}</span>
            </>
          ) : (
            <>
              Explore as{" "}
              <span className="text-[#ea1d2c]">melhores lojas</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encontre suas bebidas favoritas nas melhores adegas e distribuidoras.
        </p>
      </div>

      {/* Search with dropdown */}
      <div ref={searchRef} className="relative mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9999aa]" />
          <input
            type="text"
            placeholder="Buscar lojas ou produtos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full rounded-2xl border border-[#2a2a3a] bg-[#12121a] py-3.5 pl-12 pr-10 text-sm text-white placeholder:text-[#9999aa] focus:border-[#e63946] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9999aa] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {searchFocused && search.trim() && (searchResults.lojas.length > 0 || searchResults.produtos.length > 0) && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#12121a] shadow-xl">
            {searchResults.lojas.length > 0 && (
              <div className="border-b border-[#2a2a3a] p-3">
                <p className="mb-2 text-xs font-medium uppercase text-[#9999aa]">Lojas</p>
                {searchResults.lojas.map(loja => (
                  <Link
                    key={loja.id}
                    href={`/store/${loja.slug}`}
                    onClick={() => { setSearch(""); setSearchFocused(false) }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-[#1a1a26]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e63946]/15 text-sm font-bold text-[#e63946]">
                      {loja.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{loja.nome}</p>
                      <div className="flex items-center gap-2 text-xs text-[#9999aa]">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{loja.avaliacao}</span>
                        <span>-</span>
                        <span>{loja.tempoEntrega}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${loja.aberto ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                      {loja.aberto ? "Aberto" : "Fechado"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {searchResults.produtos.length > 0 && (
              <div className="p-3">
                <p className="mb-2 text-xs font-medium uppercase text-[#9999aa]">Produtos</p>
                {searchResults.produtos.map((item, i) => (
                  <Link
                    key={i}
                    href={`/store/${item.loja.slug}`}
                    onClick={() => { setSearch(""); setSearchFocused(false) }}
                    className="flex items-center justify-between rounded-xl px-3 py-2 transition-all hover:bg-[#1a1a26]"
                  >
                    <div>
                      <p className="text-sm text-white">{item.produto.nome}</p>
                      <p className="text-xs text-[#9999aa]">{item.loja.nome}</p>
                    </div>
                    <span className="text-sm font-bold text-[#e63946]">{formatarMoeda(item.produto.preco)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#2a2a3a]">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {bannerSlides.map((slide, i) => (
            <div key={i} className={`flex min-w-full flex-col justify-center bg-gradient-to-r ${slide.bg} px-8 py-12 md:px-14 md:py-16`}>
              <h2 className="text-2xl font-bold text-white md:text-3xl">{slide.title}</h2>
              <p className="mt-2 text-[#9999aa] md:text-lg">{slide.subtitle}</p>
              {slide.link ? (
                <Link href={slide.link} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  Cadastrar agora <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link href="#lojas" className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#e63946] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  Ver lojas <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
        {/* Nav buttons */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % bannerSlides.length)}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label="Proximo slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${currentSlide === i ? "w-6 bg-[#e63946]" : "w-2 bg-white/30"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Peca de Novo */}
      {pedidosRecentes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
            Peca de Novo
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pedidosRecentes.map(pedido => (
              <div key={pedido.id} className="flex flex-col justify-between rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{pedido.lojaNome}</p>
                    <span className="text-xs text-[#9999aa]">{new Date(pedido.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                  </div>
                  <div className="mb-3 text-xs text-[#9999aa]">
                    {pedido.itens.slice(0, 2).map((item, i) => (
                      <span key={i}>{i > 0 ? ", " : ""}{item.quantidade}x {item.nome}</span>
                    ))}
                    {pedido.itens.length > 2 && <span> +{pedido.itens.length - 2} itens</span>}
                  </div>
                  <p className="text-sm font-bold text-[#e63946]">{formatarMoeda(pedido.total)}</p>
                </div>
                <button
                  onClick={() => {
                    const loja = lojasContext.find(l => l.id === pedido.lojaId)
                    if (loja) router.push(`/store/${loja.slug}`)
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a3a] py-2 text-sm font-medium text-[#9999aa] transition-all hover:border-[#e63946]/50 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Pedir novamente
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Context Stores (iDrink lojas from context) */}
      <section id="lojas" className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
          Lojas iDrink
        </h2>
        <div className="mb-6">
          <CategoryFilter
            categories={allCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {lojasContext.filter(l => {
          const matchesSearch = l.nome.toLowerCase().includes(search.toLowerCase())
          const matchesCategory = selectedCategory === null || l.categoria === selectedCategory
          return matchesSearch && matchesCategory
        }).length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lojasContext
              .filter(l => {
                const matchesSearch = l.nome.toLowerCase().includes(search.toLowerCase())
                const matchesCategory = selectedCategory === null || l.categoria === selectedCategory
                return matchesSearch && matchesCategory
              })
              .map(loja => (
                <Link
                  key={loja.id}
                  href={`/store/${loja.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#12121a] transition-all hover:border-[#e63946]/50 hover:shadow-[0_0_30px_rgba(234,29,44,0.15)]"
                >
                  {/* Header */}
                  <div className="relative bg-gradient-to-br from-[#1a1a26] to-[#12121a] p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e63946]/15 text-lg font-bold text-[#e63946]">
                          {loja.logo ? (
                            <img src={loja.logo} alt={loja.nome} className="h-full w-full rounded-xl object-cover" />
                          ) : (
                            loja.nome.charAt(0)
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-[#e63946]">
                            {loja.nome}
                          </h3>
                          <p className="text-xs text-[#9999aa]">{loja.categoria}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${loja.aberto ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                        {loja.aberto ? "Aberto" : "Fechado"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-[#9999aa] line-clamp-2">{loja.descricao}</p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{loja.avaliacao}</span>
                        <span className="text-xs text-[#9999aa]">({loja.totalAvaliacoes})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#9999aa]">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{loja.tempoEntrega}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#9999aa]">
                        <Truck className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {loja.taxaEntrega === 0 ? "Gratis" : `R$ ${loja.taxaEntrega.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    {loja.freteGratis > 0 && (
                      <p className="mt-2 text-[11px] text-green-400">
                        Frete gratis acima de {formatarMoeda(loja.freteGratis)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[#9999aa]">Nenhuma loja encontrada.</p>
            <button onClick={() => { setSearch(""); setSelectedCategory(null) }} className="mt-3 text-sm text-[#00f5ff] hover:underline">
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {/* Legacy Stores (from data/stores.ts) */}
      {filteredLegacyStores.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
            Todas as Lojas
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLegacyStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

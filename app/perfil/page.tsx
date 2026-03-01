'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIDrink } from '@/lib/context'
import { mascaraCEP, mascaraTelefone, buscarCEP } from '@/lib/utils'
import type { Endereco } from '@/lib/context'
import {
  User, MapPin, CreditCard, Package, Heart, Gift, Bell, LogOut,
  ChevronRight, ChevronDown, ChevronUp, Plus, Loader2, Pencil
} from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  const { usuarioLogado, favoritos, lojas, logout, addToast, loginUsuarioMock } = useIDrink()
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(usuarioLogado?.nome || '')
  const [email, setEmail] = useState(usuarioLogado?.email || '')
  const [secaoAberta, setSecaoAberta] = useState<string | null>(null)

  // Enderecos
  const [enderecos, setEnderecos] = useState<Endereco[]>(usuarioLogado?.enderecos || [])
  const [novoCep, setNovoCep] = useState('')
  const [novoNumero, setNovoNumero] = useState('')
  const [novoComplemento, setNovoComplemento] = useState('')
  const [novaRua, setNovaRua] = useState('')
  const [novoBairro, setNovoBairro] = useState('')
  const [novaCidade, setNovaCidade] = useState('')
  const [novoEstado, setNovoEstado] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)

  // Notificacoes
  const [notificacoes, setNotificacoes] = useState(true)

  const lojasFavoritas = lojas.filter(l => favoritos.includes(l.id))

  const cupons = [
    { codigo: 'IDRINK10', desc: '10% de desconto', validade: '31/12/2026' },
    { codigo: 'BEMVINDO', desc: 'R$5 de desconto', validade: '31/12/2026' },
    { codigo: 'FRETEGRATIS', desc: 'Frete gratis', validade: '31/12/2026' },
  ]

  async function handleCepNovo(value: string) {
    const masked = mascaraCEP(value)
    setNovoCep(masked)
    if (masked.replace(/\D/g, '').length === 8) {
      setBuscandoCep(true)
      const resultado = await buscarCEP(masked)
      setBuscandoCep(false)
      if (resultado) {
        setNovaRua(resultado.rua)
        setNovoBairro(resultado.bairro)
        setNovaCidade(resultado.cidade)
        setNovoEstado(resultado.estado)
      }
    }
  }

  function addEndereco() {
    if (!novoCep || !novoNumero) { addToast('Preencha CEP e numero', 'erro'); return }
    const novo: Endereco = { cep: novoCep, rua: novaRua, numero: novoNumero, complemento: novoComplemento, bairro: novoBairro, cidade: novaCidade, estado: novoEstado, referencia: '', tipo: 'casa' }
    setEnderecos(e => [...e, novo])
    setNovoCep(''); setNovoNumero(''); setNovoComplemento(''); setNovaRua(''); setNovoBairro(''); setNovaCidade(''); setNovoEstado('')
    addToast('Endereco adicionado')
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  function toggleSecao(s: string) {
    setSecaoAberta(secaoAberta === s ? null : s)
  }

  if (!usuarioLogado) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <User className="mb-4 h-12 w-12 text-[#9999aa]" />
        <h1 className="text-xl font-bold text-white">Voce nao esta logado</h1>
        <button onClick={loginUsuarioMock} className="mt-4 rounded-full bg-[#e63946] px-6 py-3 font-semibold text-white hover:opacity-90">Entrar como usuario demo</button>
      </div>
    )
  }

  const menuItems = [
    { id: 'enderecos', icon: MapPin, label: 'Enderecos', desc: `${enderecos.length} salvos` },
    { id: 'pagamentos', icon: CreditCard, label: 'Pagamentos salvos', desc: 'Gerencie seus cartoes' },
    { id: 'pedidos', icon: Package, label: 'Meus Pedidos', desc: 'Historico completo', link: '/pedidos' },
    { id: 'favoritos', icon: Heart, label: 'Favoritos', desc: `${lojasFavoritas.length} lojas` },
    { id: 'cupons', icon: Gift, label: 'Cupons', desc: `${cupons.length} disponiveis` },
    { id: 'notificacoes', icon: Bell, label: 'Notificacoes', desc: notificacoes ? 'Ativadas' : 'Desativadas' },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e63946] text-3xl font-bold text-white">
          {usuarioLogado.nome.charAt(0)}
        </div>
        {editando ? (
          <div className="flex flex-col gap-2">
            <input value={nome} onChange={e => setNome(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2 text-center text-white focus:border-[#e63946] focus:outline-none" />
            <input value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2 text-center text-sm text-white focus:border-[#e63946] focus:outline-none" />
            <button onClick={() => { setEditando(false); addToast('Perfil atualizado') }} className="mt-1 rounded-xl bg-[#e63946] py-2 text-sm font-semibold text-white">Salvar</button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white">{nome}</h1>
            <p className="text-sm text-[#9999aa]">{email}</p>
            <button onClick={() => setEditando(true)} className="mt-3 inline-flex items-center gap-1 text-sm text-[#00b4d8] hover:underline"><Pencil className="h-3 w-3" /> Editar</button>
          </>
        )}
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map(item => {
          const Icon = item.icon
          const isOpen = secaoAberta === item.id

          if (item.link) {
            return (
              <Link key={item.id} href={item.link} className="flex items-center justify-between rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4 transition-all hover:border-[#e63946]/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#1a1a26] p-2"><Icon className="h-5 w-5 text-[#9999aa]" /></div>
                  <div><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-[#9999aa]">{item.desc}</p></div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9999aa]" />
              </Link>
            )
          }

          return (
            <div key={item.id} className="rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
              <button onClick={() => toggleSecao(item.id)} className="flex w-full items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#1a1a26] p-2"><Icon className="h-5 w-5 text-[#9999aa]" /></div>
                  <div className="text-left"><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-[#9999aa]">{item.desc}</p></div>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-[#9999aa]" /> : <ChevronDown className="h-4 w-4 text-[#9999aa]" />}
              </button>

              {isOpen && item.id === 'enderecos' && (
                <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                  {enderecos.map((end, i) => (
                    <div key={i} className="mb-2 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-3 text-xs text-[#9999aa]">
                      {end.rua}, {end.numero} - {end.bairro}, {end.cidade}/{end.estado}
                    </div>
                  ))}
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="relative">
                      <input placeholder="CEP" value={novoCep} onChange={e => handleCepNovo(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                      {buscandoCep && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-[#9999aa]" />}
                    </div>
                    {novaRua && <p className="text-xs text-[#9999aa]">{novaRua}, {novoBairro} - {novaCidade}/{novoEstado}</p>}
                    <input placeholder="Numero" value={novoNumero} onChange={e => setNovoNumero(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
                    <button onClick={addEndereco} className="flex items-center justify-center gap-1 rounded-xl bg-[#e63946] py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Adicionar</button>
                  </div>
                </div>
              )}

              {isOpen && item.id === 'favoritos' && (
                <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                  {lojasFavoritas.length === 0 ? (
                    <p className="text-xs text-[#9999aa]">Nenhum favorito ainda</p>
                  ) : (
                    lojasFavoritas.map(l => (
                      <Link key={l.id} href={`/store/${l.slug}`} className="mb-2 flex items-center justify-between rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-3 hover:border-[#e63946]/30">
                        <span className="text-sm text-white">{l.nome}</span>
                        <ChevronRight className="h-4 w-4 text-[#9999aa]" />
                      </Link>
                    ))
                  )}
                </div>
              )}

              {isOpen && item.id === 'cupons' && (
                <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                  {cupons.map(c => (
                    <div key={c.codigo} className="mb-2 flex items-center justify-between rounded-xl border border-dashed border-[#2a2a3a] bg-[#0a0a0f] p-3">
                      <div>
                        <p className="text-sm font-semibold text-[#e63946]">{c.codigo}</p>
                        <p className="text-xs text-[#9999aa]">{c.desc}</p>
                      </div>
                      <span className="text-xs text-[#9999aa]">Ate {c.validade}</span>
                    </div>
                  ))}
                </div>
              )}

              {isOpen && item.id === 'notificacoes' && (
                <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-[#9999aa]">Receber notificacoes</span>
                    <button
                      onClick={() => { setNotificacoes(!notificacoes); addToast(notificacoes ? 'Notificacoes desativadas' : 'Notificacoes ativadas', 'info') }}
                      className={`relative h-6 w-11 rounded-full transition-all ${notificacoes ? 'bg-[#e63946]' : 'bg-[#2a2a3a]'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${notificacoes ? 'left-5.5' : 'left-0.5'}`} />
                    </button>
                  </label>
                </div>
              )}

              {isOpen && item.id === 'pagamentos' && (
                <div className="border-t border-[#2a2a3a] px-4 pb-4 pt-3">
                  <p className="text-xs text-[#9999aa]">Nenhum pagamento salvo. Configure durante o checkout.</p>
                </div>
              )}
            </div>
          )
        })}

        {/* Logout */}
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-4 text-left transition-all hover:border-red-500/30">
          <div className="rounded-lg bg-red-500/10 p-2"><LogOut className="h-5 w-5 text-red-400" /></div>
          <div><p className="text-sm font-medium text-red-400">Sair</p><p className="text-xs text-[#9999aa]">Encerrar sessao</p></div>
        </button>
      </div>
    </div>
  )
}

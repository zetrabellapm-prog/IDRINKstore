'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIDrink } from '@/lib/context'
import { mascaraTelefone, mascaraCPF, mascaraCNPJ, gerarId, gerarAvaliacao } from '@/lib/utils'
import type { Loja } from '@/lib/context'
import { Store, ArrowRight, ArrowLeft, Check } from 'lucide-react'

const categorias = ['Mix Completo', 'Cerveja & Drinks', 'Whisky & Destilados', 'Vinhos', 'Adega', 'Tabacaria', 'Conveniencia', 'Outro']

export default function CadastroComerciante() {
  const router = useRouter()
  const { cadastrarComerciante, addToast } = useIDrink()
  const [step, setStep] = useState(1)

  // Step 1
  const [aceitoTermos, setAceitoTermos] = useState(false)

  // Step 2
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [senha, setSenha] = useState('')
  const [docTipo, setDocTipo] = useState<'cpf' | 'cnpj'>('cpf')
  const [documento, setDocumento] = useState('')

  // Step 3
  const [nomeLoja, setNomeLoja] = useState('')
  const [categoriaLoja, setCategoriaLoja] = useState(categorias[0])
  const [descricao, setDescricao] = useState('')
  const [whatsappLoja, setWhatsappLoja] = useState('')
  const [horaAbre, setHoraAbre] = useState('10:00')
  const [horaFecha, setHoraFecha] = useState('23:00')
  const [tempoEntrega, setTempoEntrega] = useState(30)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const [erros, setErros] = useState<Record<string, string>>({})

  function validarStep2() {
    const e: Record<string, string> = {}
    if (!nome.trim()) e.nome = 'Obrigatorio'
    if (!email.includes('@')) e.email = 'Email invalido'
    if (whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Telefone invalido'
    if (senha.length < 6) e.senha = 'Minimo 6 caracteres'
    if (!documento.trim()) e.documento = 'Obrigatorio'
    setErros(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!nomeLoja.trim()) {
      setErros({ nomeLoja: 'Nome obrigatorio' })
      return
    }
    setErros({})

    const novoId = gerarId('loja')
    const comId = gerarId('com')
    const slug = nomeLoja.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const novaLoja: Loja = {
      id: novoId, slug, comercianteId: comId,
      nome: nomeLoja, descricao, categoria: categoriaLoja,
      avaliacao: gerarAvaliacao(), totalAvaliacoes: 0,
      tempoEntrega: `${tempoEntrega}-${tempoEntrega + 15} min`,
      freteGratis: 80, taxaEntrega: 5.99,
      horarioAbertura: horaAbre, horarioFechamento: horaFecha,
      whatsapp: (whatsappLoja || whatsapp).replace(/\D/g, ''),
      notificacoesWhatsapp: true,
      pixChave: '', pixTipo: '',
      produtos: [], ativo: true, aberto: true,
      createdAt: Date.now(),
      logo: fotoPreview || undefined,
    }

    cadastrarComerciante({
      id: comId, nome, email,
      whatsapp: whatsapp.replace(/\D/g, ''),
      cpfCnpj: documento, lojaId: novoId
    }, novaLoja)

    addToast('Sua loja ja esta no iDrink! Clientes podem te encontrar agora.')
    router.push('/comerciante/dashboard')
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setFotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= s ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 flex-1 rounded ${step > s ? 'bg-[#e63946]' : 'bg-[#2a2a3a]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 - Termos */}
      {step === 1 && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e63946]/15">
              <Store className="h-8 w-8 text-[#e63946]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Bem-vindo ao iDrink Parceiros</h2>
            <p className="mt-2 text-sm text-[#9999aa]">Cadastre sua loja em menos de 2 minutos</p>
          </div>
          <div className="mb-6 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-4 text-xs text-[#9999aa] leading-relaxed">
            <p className="mb-2">Ao se cadastrar como parceiro iDrink, voce concorda com nossos Termos de Servico e Politica de Privacidade. A plataforma iDrink conecta comerciantes a consumidores, facilitando a venda e entrega de bebidas.</p>
            <p>O comerciante e responsavel por cumprir a legislacao vigente sobre venda de bebidas alcoolicas, incluindo a proibicao de venda para menores de 18 anos.</p>
          </div>
          <label className="mb-6 flex items-center gap-3 cursor-pointer">
            <div className={`flex h-5 w-5 items-center justify-center rounded border ${aceitoTermos ? 'border-[#e63946] bg-[#e63946]' : 'border-[#2a2a3a]'}`}>
              {aceitoTermos && <Check className="h-3 w-3 text-white" />}
            </div>
            <input type="checkbox" checked={aceitoTermos} onChange={e => setAceitoTermos(e.target.checked)} className="sr-only" />
            <span className="text-sm text-[#9999aa]">Li e aceito os termos de uso</span>
          </label>
          <button
            onClick={() => step === 1 && aceitoTermos && setStep(2)}
            disabled={!aceitoTermos}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e63946] py-3.5 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          >
            Comecar Cadastro <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 2 - Responsavel */}
      {step === 2 && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6">
          <h2 className="mb-1 text-xl font-bold text-white">Dados do Responsavel</h2>
          <p className="mb-6 text-sm text-[#9999aa]">Informacoes pessoais do proprietario</p>
          <div className="flex flex-col gap-4">
            <div>
              <input placeholder="Nome completo *" value={nome} onChange={e => setNome(e.target.value)} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.nome ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.nome && <p className="mt-1 text-xs text-red-400">{erros.nome}</p>}
            </div>
            <div>
              <input placeholder="E-mail *" type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.email ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.email && <p className="mt-1 text-xs text-red-400">{erros.email}</p>}
            </div>
            <div>
              <input placeholder="WhatsApp *" value={whatsapp} onChange={e => setWhatsapp(mascaraTelefone(e.target.value))} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.whatsapp ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.whatsapp && <p className="mt-1 text-xs text-red-400">{erros.whatsapp}</p>}
            </div>
            <div>
              <input placeholder="Senha (min. 6 caracteres) *" type="password" value={senha} onChange={e => setSenha(e.target.value)} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.senha ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.senha && <p className="mt-1 text-xs text-red-400">{erros.senha}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setDocTipo('cpf'); setDocumento('') }} className={`flex-1 rounded-xl py-2 text-sm font-medium ${docTipo === 'cpf' ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>CPF</button>
              <button onClick={() => { setDocTipo('cnpj'); setDocumento('') }} className={`flex-1 rounded-xl py-2 text-sm font-medium ${docTipo === 'cnpj' ? 'bg-[#e63946] text-white' : 'bg-[#1a1a26] text-[#9999aa]'}`}>CNPJ</button>
            </div>
            <div>
              <input placeholder={docTipo === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'} value={documento} onChange={e => setDocumento(docTipo === 'cpf' ? mascaraCPF(e.target.value) : mascaraCNPJ(e.target.value))} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.documento ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.documento && <p className="mt-1 text-xs text-red-400">{erros.documento}</p>}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2a2a3a] py-3.5 text-sm font-medium text-[#9999aa] hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <button onClick={() => validarStep2() && setStep(3)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e63946] py-3.5 font-semibold text-white hover:opacity-90">
              Proximo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Loja */}
      {step === 3 && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6">
          <h2 className="mb-1 text-xl font-bold text-white">Dados da Loja</h2>
          <p className="mb-6 text-sm text-[#9999aa]">Configure sua loja no iDrink</p>
          <div className="flex flex-col gap-4">
            <div>
              <input placeholder="Nome da loja *" value={nomeLoja} onChange={e => setNomeLoja(e.target.value)} className={`w-full rounded-xl border bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none ${erros.nomeLoja ? 'border-red-500' : 'border-[#2a2a3a] focus:border-[#e63946]'}`} />
              {erros.nomeLoja && <p className="mt-1 text-xs text-red-400">{erros.nomeLoja}</p>}
            </div>
            <select value={categoriaLoja} onChange={e => setCategoriaLoja(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none">
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div>
              <textarea placeholder="Descricao (max 120 caracteres)" value={descricao} onChange={e => setDescricao(e.target.value.slice(0, 120))} maxLength={120} rows={2} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none resize-none" />
              <p className="text-right text-xs text-[#9999aa]">{descricao.length}/120</p>
            </div>
            <input placeholder="WhatsApp da loja" value={whatsappLoja} onChange={e => setWhatsappLoja(mascaraTelefone(e.target.value))} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#9999aa] focus:outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-[#9999aa]">Abertura</label>
                <input type="time" value={horaAbre} onChange={e => setHoraAbre(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#9999aa]">Fechamento</label>
                <input type="time" value={horaFecha} onChange={e => setHoraFecha(e.target.value)} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#9999aa]">Tempo de entrega: {tempoEntrega}-{tempoEntrega + 15} min</label>
              <input type="range" min={15} max={90} value={tempoEntrega} onChange={e => setTempoEntrega(Number(e.target.value))} className="w-full accent-[#e63946]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#9999aa]">Foto da loja (opcional)</label>
              <input type="file" accept="image/*" onChange={handleFoto} className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-sm text-[#9999aa] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e63946] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white" />
              {fotoPreview && (
                <div className="mt-2 flex h-20 w-20 overflow-hidden rounded-xl border border-[#2a2a3a]">
                  <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(2)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2a2a3a] py-3.5 text-sm font-medium text-[#9999aa] hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <button onClick={handleSubmit} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e63946] py-3.5 font-bold text-white hover:opacity-90">
              Criar Minha Loja Agora!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

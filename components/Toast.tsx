'use client'
import { useIDrink } from '@/lib/context'
import { CheckCircle, XCircle, Info } from 'lucide-react'

export function ToastContainer() {
  const { toasts } = useIDrink()
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`
          flex items-center gap-3 px-4 py-3 rounded-[14px] shadow-xl pointer-events-auto
          min-w-[280px] max-w-[360px] border animate-[slideUp_0.3s_ease-out]
          ${t.tipo === 'sucesso' ? 'bg-green-950 border-green-700 text-white' : ''}
          ${t.tipo === 'erro'    ? 'bg-red-950   border-red-700 text-white'   : ''}
          ${t.tipo === 'info'    ? 'bg-[#12121a] border-[#2a2a3a] text-white' : ''}
        `}>
          {t.tipo === 'sucesso' && <CheckCircle size={18} className="text-green-400 shrink-0" />}
          {t.tipo === 'erro'    && <XCircle     size={18} className="text-red-400 shrink-0"   />}
          {t.tipo === 'info'    && <Info         size={18} className="text-[#00b4d8] shrink-0" />}
          <span className="text-white text-sm">{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mascaraCEP = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)

export const mascaraTelefone = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15)

export const mascaraCartao = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19)

export const mascaraValidade = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5)

export const mascaraCPF = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14)

export const mascaraCNPJ = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2').slice(0, 18)

export const formatarMoeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const gerarId = (prefix = 'iDK') =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`

export const gerarAvaliacao = () =>
  Math.round((3.0 + Math.random() * 1.2) * 10) / 10

export async function buscarCEP(cep: string) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
    const data = await res.json()
    if (data.erro) return null
    return { rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf }
  } catch {
    return null
  }
}

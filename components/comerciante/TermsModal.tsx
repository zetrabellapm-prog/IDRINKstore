"use client";

import { useState } from "react";
import { Shield, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TermsModalProps {
  onAccept: () => void;
}

export function TermsModal({ onAccept }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#9999aa] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </Link>

        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e63946]/10">
              <Shield className="h-6 w-6 text-[#e63946]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Termos de Uso — iDrink Parceiros
              </h1>
              <p className="text-sm text-[#9999aa]">
                Leia atentamente antes de continuar
              </p>
            </div>
          </div>

          {/* Terms content */}
          <div className="mb-6 max-h-[400px] overflow-y-auto rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#00b4d8]" />
              <h2 className="font-semibold text-white">
                1. Responsabilidade sobre Produtos
              </h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[#9999aa]">
              Ao se cadastrar como parceiro iDrink, voce declara que todos os
              produtos oferecidos em sua loja estao em conformidade com as
              normas sanitarias vigentes, possuem registro adequado junto aos
              orgaos competentes e estao dentro do prazo de validade. O
              parceiro e integralmente responsavel pela qualidade, procedencia
              e veracidade das informacoes dos produtos cadastrados na
              plataforma, incluindo descricao, preco, imagens e
              disponibilidade de estoque. A iDrink nao se responsabiliza por
              danos causados por produtos adulterados, vencidos ou em
              desconformidade com a legislacao aplicavel.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#00b4d8]" />
              <h2 className="font-semibold text-white">
                2. Conformidade Legal e Regulatoria
              </h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[#9999aa]">
              O estabelecimento parceiro deve possuir todas as licencas e
              alvaras necessarios para a comercializacao de bebidas alcoolicas
              e nao alcoolicas, conforme legislacao municipal, estadual e
              federal. E vedada a venda de bebidas alcoolicas a menores de 18
              anos, e o parceiro deve adotar mecanismos de verificacao de
              idade no ato da entrega. O descumprimento destas obrigacoes
              podera resultar no cancelamento imediato da parceria, sem
              prejuizo das medidas legais cabiveis. A iDrink se reserva o
              direito de auditar as operacoes do parceiro a qualquer momento.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#00b4d8]" />
              <h2 className="font-semibold text-white">
                3. Politica de Privacidade e Dados
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#9999aa]">
              A iDrink coleta e trata dados pessoais do responsavel pelo
              estabelecimento e dados comerciais da loja para fins de
              cadastro, operacao da plataforma, processamento de pagamentos e
              comunicacao. Todos os dados sao armazenados de forma segura e
              em conformidade com a Lei Geral de Protecao de Dados (LGPD). O
              parceiro autoriza a iDrink a exibir publicamente o nome da
              loja, logotipo, avaliacao e produtos no marketplace. Dados
              financeiros e pessoais sensiveis serao tratados com sigilo e
              nao serao compartilhados com terceiros sem consentimento previo,
              exceto quando exigido por lei ou ordem judicial.
            </p>
          </div>

          {/* Checkbox */}
          <label className="mb-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-[#2a2a3a] bg-[#0a0a0f] accent-[#e63946]"
            />
            <span className="text-sm text-[#9999aa]">
              Li e aceito os{" "}
              <span className="font-medium text-white">Termos de Uso</span> e a{" "}
              <span className="font-medium text-white">
                Politica de Privacidade
              </span>{" "}
              da iDrink Parceiros.
            </span>
          </label>

          {/* Button */}
          <button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full rounded-full bg-[#e63946] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar para Cadastro
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Loja, Pedido } from './context'

export function notificarComercianteWhatsApp(loja: Loja, pedido: Pedido) {
  if (typeof window === 'undefined') return
  if (!loja.whatsapp || !loja.notificacoesWhatsapp) return

  const numero = loja.whatsapp.replace(/\D/g, '')
  const itensTexto = pedido.itens
    .map(i => `- ${i.nome} x${i.quantidade} — R$ ${(i.preco * i.quantidade).toFixed(2)}`)
    .join('\n')

  const mensagem = encodeURIComponent(
    `*Novo Pedido iDrink!*\n\n` +
    `Pedido: #${pedido.id}\n` +
    `Horario: ${new Date().toLocaleTimeString('pt-BR')}\n\n` +
    `Cliente: ${pedido.usuarioNome}\n` +
    `WhatsApp: ${pedido.usuarioTelefone}\n\n` +
    `Itens:\n${itensTexto}\n\n` +
    `Total: R$ ${pedido.total.toFixed(2)}\n` +
    `Pagamento: ${pedido.pagamento}\n\n` +
    `Endereco:\n` +
    `${pedido.endereco.rua}, ${pedido.endereco.numero}` +
    `${pedido.endereco.complemento ? ` - ${pedido.endereco.complemento}` : ''}\n` +
    `${pedido.endereco.bairro} - ${pedido.endereco.cidade}/${pedido.endereco.estado}\n` +
    `CEP: ${pedido.endereco.cep}` +
    `${pedido.endereco.referencia ? `\nRef: ${pedido.endereco.referencia}` : ''}\n\n` +
    `Acesse o painel iDrink para aceitar!`
  )

  window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank')
}

export function whatsappCliente(telefone: string, pedidoId: string, lojaNome: string) {
  if (typeof window === 'undefined') return
  const numero = telefone.replace(/\D/g, '')
  const msg = encodeURIComponent(
    `Ola! Aqui e a ${lojaNome} pelo iDrink\nSeu pedido *#${pedidoId}* esta sendo preparado com carinho!`
  )
  window.open(`https://wa.me/${numero}?text=${msg}`, '_blank')
}

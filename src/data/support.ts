export const SUPPORT_EMAIL = 'care@globalducan.com'
/** E.164 without + — update when a real WhatsApp Business number is live. */
export const SUPPORT_WHATSAPP = '971501234567'

export const supportTopics = [
  {
    id: 'order',
    label: 'Where is my order?',
    prompt: 'I need help finding my order status.',
    reply:
      'Happy to help track that. Open Your orders and share the order ID (e.g. GD-2841), or tell me the store and approx. date — I’ll look up warehouse and shipping status.',
  },
  {
    id: 'shipping',
    label: 'Shipping & customs',
    prompt: 'I have a question about shipping or customs.',
    reply:
      'We ship DDP to most destinations (Maldives, Mauritius, Seychelles, UAE, Saudi, Nepal, Bhutan and more). Duties are estimated before you pay the second-step shipping invoice from our India warehouse — no surprise door charges on supported routes.',
  },
  {
    id: 'wallet',
    label: 'Wallet & payments',
    prompt: 'I need help with my wallet or a payment.',
    reply:
      'Wallet credits from bank transfer usually clear once the realized amount lands (SWIFT fees may reduce the credited total). Refunds from stores return to your Ducan wallet. Tell me whether this is a deposit, checkout charge, or refund.',
  },
  {
    id: 'returns',
    label: 'Returns & refunds',
    prompt: 'I want to start a return or check a refund.',
    reply:
      'Items can be returned or exchanged while they’re still at our India warehouse (photo QC first). Once shipped internationally, returns depend on the courier and destination. Share your order ID and I’ll outline the next step.',
  },
] as const

export type SupportTopicId = (typeof supportTopics)[number]['id']

export function whatsappSupportUrl(message?: string) {
  const text = encodeURIComponent(
    message?.trim() || 'Hi Global Ducan support — I need help with my order.',
  )
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`
}

export function mailtoSupportUrl(subject?: string, body?: string) {
  const q = new URLSearchParams()
  if (subject) q.set('subject', subject)
  if (body) q.set('body', body)
  const qs = q.toString()
  return `mailto:${SUPPORT_EMAIL}${qs ? `?${qs}` : ''}`
}

import { useState } from 'react'
import {
  MessageCircle,
  Mail,
  Phone,
  Package,
  Wallet,
  Plane,
  Undo2,
  ChevronDown,
  Clock3,
} from 'lucide-react'
import AccountLayout from '../components/AccountLayout'

// Official contact details — mirrored from the mobile app (lib/utils/constants.dart).
const SUPPORT_EMAIL = 'support@globalducan.com'
const SUPPORT_PHONE_DISPLAY = '+91 92117 06119'
const WHATSAPP_NUMBER = '919211706119'

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hi Global Ducan, I need help with an order.',
)}`

/** Opens the ChatMaxima widget loaded in index.html. */
function openLiveChat() {
  const w = window as unknown as {
    chatmaxima?: { open?: () => void; toggle?: () => void }
    ChatMaxima?: { open?: () => void; toggle?: () => void }
  }
  const api = w.chatmaxima ?? w.ChatMaxima
  if (api?.open) return api.open()
  if (api?.toggle) return api.toggle()
  // Widget not ready — click its launcher if present, else fall back to WhatsApp.
  const launcher = document.querySelector<HTMLElement>(
    '#chatmaxima-launcher, [id*="chatmaxima"] button, iframe[src*="chatmaxima"]',
  )
  if (launcher) return launcher.click()
  window.open(WHATSAPP_HREF, '_blank', 'noopener')
}

const channels = [
  {
    icon: MessageCircle,
    title: 'Live chat',
    sub: 'Fastest — chat with our team right here',
    action: 'Start chat',
    highlight: true,
    href: undefined as string | undefined,
    onClick: openLiveChat,
  },
  {
    icon: Mail,
    title: 'Email us',
    sub: `${SUPPORT_EMAIL} · replies within 12h`,
    action: 'Write to us',
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Global Ducan support request')}`,
    onClick: undefined,
  },
  {
    icon: Phone,
    title: 'Call us',
    sub: `${SUPPORT_PHONE_DISPLAY} · Mon–Sat, 10am–7pm IST`,
    action: 'Call now',
    href: `tel:+${WHATSAPP_NUMBER}`,
    onClick: undefined,
  },
]

const topics = [
  { icon: Package, label: 'Where is my order?' },
  { icon: Plane, label: 'Shipping & customs' },
  { icon: Wallet, label: 'Wallet & payments' },
  { icon: Undo2, label: 'Returns & refunds' },
]

const faqs = [
  {
    q: 'How does payment work?',
    a: 'You pay once when you place the order. The total covers the product price, our proxy service fee, and international shipping estimated from the item’s weight, plus any duties. We then buy from the Indian store, receive and quality-check the goods at our India warehouse, and ship them to you. If the packed parcel weighs less than we quoted, the difference is refunded to your Ducan wallet.',
  },
  {
    q: 'How long does international delivery take?',
    a: 'Most orders arrive in 6–14 days door-to-door: 2–4 days for us to receive your items from the store, 1–2 days to consolidate and dispatch, then 3–8 days in transit depending on your country and courier.',
  },
  {
    q: 'Will I have to pay customs duties on delivery?',
    a: 'Duty estimates are shown before you pay shipping from the warehouse. We ship DDP (delivered duty paid) to most countries so there are no surprise charges at your door.',
  },
  {
    q: 'What if the store sends the wrong item or size?',
    a: 'We photograph every item when it reaches our warehouse. If something is wrong you can approve, exchange or return it with the store before it ever ships internationally. Free storage is typically 30 days from arrival.',
  },
  {
    q: 'How do wallet refunds work?',
    a: 'Store refunds land back in your Ducan wallet within seconds of the store processing them, and you can spend the balance on any order or withdraw it via bank transfer.',
  },
]

export default function Support() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <AccountLayout
      title="Support"
      description="We're online 24/7 across time zones — pick a channel."
    >
      {/* Contact channels */}
      <div className="grid gap-4 md:grid-cols-3">
        {channels.map((ch) => (
          <div
            key={ch.title}
            className={`rounded-2xl border p-6 shadow-sm transition ${
              ch.highlight
                ? 'border-transparent bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-navy-900/25'
                : 'border-navy-900/10 bg-white dark:border-white/10 dark:bg-black'
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                ch.highlight
                  ? 'bg-tangerine-500 text-white'
                  : 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200'
              }`}
            >
              <ch.icon className="h-5 w-5" />
            </span>
            <h3 className={`mt-4 text-base font-semibold ${ch.highlight ? 'text-white' : ''}`}>
              {ch.title}
            </h3>
            <p
              className={`mt-1 text-xs leading-relaxed ${
                ch.highlight ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {ch.sub}
            </p>
            {ch.onClick ? (
              <button
                type="button"
                onClick={ch.onClick}
                className={`mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  ch.highlight
                    ? 'bg-tangerine-500 text-white shadow-lg shadow-tangerine-500/30 hover:bg-tangerine-400'
                    : 'border border-navy-900/15 text-navy-800/80 hover:border-navy-400 dark:border-white/15 dark:text-white dark:hover:border-white/30'
                }`}
              >
                {ch.action}
              </button>
            ) : ch.href ? (
              <a
                href={ch.href}
                {...(ch.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className={`mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  ch.highlight
                    ? 'bg-tangerine-500 text-white shadow-lg shadow-tangerine-500/30 hover:bg-tangerine-400'
                    : 'border border-navy-900/15 text-navy-800/80 hover:border-navy-400 dark:border-white/15 dark:text-white dark:hover:border-white/30'
                }`}
              >
                {ch.action}
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Coming soon"
                className={`mt-4 cursor-not-allowed rounded-full px-5 py-2.5 text-sm font-semibold opacity-60 ${
                  ch.highlight
                    ? 'bg-tangerine-500 text-white'
                    : 'border border-navy-900/15 text-navy-800/80 dark:border-white/15 dark:text-white'
                }`}
              >
                {ch.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Popular topics */}
      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Popular topics
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {topics.map((topic) => (
            <button
              key={topic.label}
              className="flex items-center gap-3 rounded-2xl border border-navy-900/10 bg-white px-4 py-3.5 text-left text-sm font-semibold text-navy-900 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md dark:border-white/10 dark:bg-black dark:text-white dark:hover:border-white/25"
            >
              <topic.icon className="h-4.5 w-4.5 shrink-0 text-navy-400" />
              {topic.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Frequently asked
        </h2>
        <div className="mt-3 divide-y divide-navy-900/5 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-black">
          {faqs.map((faq, i) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-cream-100 dark:hover:bg-white/5"
              >
                <span className="flex-1 text-sm font-semibold text-navy-900 dark:text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-300 transition-transform duration-300 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${
                  open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-navy-900/15 bg-white/60 p-5 text-xs text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        <Clock3 className="h-4 w-4 shrink-0 text-navy-400" />
        Order-specific help is faster from the order itself — open it in Your orders and tap
        "Get support" so we already have the details.
      </p>
    </AccountLayout>
  )
}

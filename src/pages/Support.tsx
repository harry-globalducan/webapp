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

const channels = [
  {
    icon: MessageCircle,
    title: 'Live chat',
    sub: 'Fastest — typical reply under 2 minutes',
    action: 'Start chat',
    highlight: true,
  },
  {
    icon: Mail,
    title: 'Email us',
    sub: 'care@globalducan.com · replies within 12h',
    action: 'Write to us',
  },
  {
    icon: Phone,
    title: 'WhatsApp',
    sub: 'Message us about an order any time',
    action: 'Open WhatsApp',
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
    q: 'How does two-step proxy payment work?',
    a: 'First you pay the item fee (product price + proxy service fee) so we can buy from the Indian store. After goods arrive at our India warehouse, you choose a shipping method and pay international postage based on actual weight — similar to Doorzo’s model, adapted for India.',
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
            <button
              className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                ch.highlight
                  ? 'bg-tangerine-500 text-white shadow-lg shadow-tangerine-500/30 hover:bg-tangerine-400'
                  : 'border border-navy-900/15 text-navy-800/80 hover:border-navy-400 dark:border-white/15 dark:text-white dark:hover:border-white/30'
              }`}
            >
              {ch.action}
            </button>
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

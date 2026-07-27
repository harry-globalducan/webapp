import { useState } from 'react'
import { Copy, Check, Users, Gift, Clock3, Share2, Mail } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import { useAuth } from '../context/AuthContext'
import { useApiData } from '../lib/useApiData'
import * as api from '../lib/api'

/** Mobile app builds referral links as `${WEB_URL}/register?referralCode=CODE`. */
const WEB_URL = import.meta.env.VITE_WEB_URL ?? window.location.origin
const FALLBACK_CODE = 'GLOBALDUCAN'

const stats = [
  { icon: Users, label: 'Friends joined', value: '0' },
  { icon: Gift, label: 'Credit earned', value: '$0.00' },
  { icon: Clock3, label: 'Pending invites', value: '0' },
]

const steps = [
  { title: 'Share your link', text: 'Send it to friends who shop from Indian stores abroad.' },
  { title: 'They place a first order', text: 'Your friend gets $10 off their first Ducan order.' },
  { title: 'You both earn', text: '$10 lands in your wallet as soon as their order ships.' },
]

export default function Refer() {
  const [copied, setCopied] = useState(false)
  const { isAuthed } = useAuth()

  // GET /api/v1/referral returns the signed-in user's real code.
  const { data: referral } = useApiData(() => api.getReferral(), {
    enabled: isAuthed,
    fallback: { referralCode: FALLBACK_CODE },
  })

  const REFERRAL_LINK = `${WEB_URL}/register?referralCode=${referral.referralCode}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — link is visible to copy manually
    }
  }

  const shareText = encodeURIComponent(
    `Shop any Indian store and get it delivered worldwide with Global Ducan — $10 off your first order: ${REFERRAL_LINK}`,
  )

  return (
    <AccountLayout
      title="Refer & earn"
      description="Give $10, get $10 — for every friend's first order."
    >
      {/* Referral link hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 text-white shadow-xl shadow-navy-900/25">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-navy-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-24 h-56 w-56 rounded-full bg-tangerine-500/20 blur-3xl" />
        <div className="relative max-w-xl">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Your referral link
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Anyone who signs up through it gets $10 off — and you earn $10 wallet credit when
            their first order ships.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <code className="flex-1 truncate rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white/90 backdrop-blur">
              {REFERRAL_LINK}
            </code>
            <button
              onClick={() => void copy()}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-tangerine-400/60 hover:text-tangerine-300"
            >
              <Share2 className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={`https://x.com/intent/post?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-tangerine-400/60 hover:text-tangerine-300"
            >
              <Share2 className="h-3.5 w-3.5" /> Post on X
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent('Get $10 off Global Ducan')}&body=${shareText}`}
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-tangerine-400/60 hover:text-tangerine-300"
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black"
          >
            <stat.icon className="h-4.5 w-4.5 text-navy-400" />
            <div className="mt-3 font-display text-2xl font-bold tabular-nums text-navy-900 dark:text-white">
              {stat.value}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">How it works</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black"
            >
              <span className="absolute -right-2 -top-5 font-display text-[64px] font-bold text-navy-900/5 dark:text-white/5">
                {i + 1}
              </span>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 rounded-2xl border border-dashed border-navy-900/15 bg-white/60 p-5 text-xs text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        Credit is capped at $200 per calendar year. Self-referrals and duplicate accounts are
        excluded — full terms in the referral policy.
      </p>
    </AccountLayout>
  )
}

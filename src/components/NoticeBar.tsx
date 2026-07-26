import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Puzzle, TicketPercent, PackageCheck, X, ArrowRight, Megaphone } from 'lucide-react'
import { useHomeData } from '../context/HomeDataContext'

type Promo = {
  icon: typeof Puzzle
  tag: string
  text: string
  strong: string
  cta: string
  to: string
}

/** Rotating enterprise promo strip — Doorzo-style bold top ticker. */
const PROMOS: Promo[] = [
  {
    icon: Puzzle,
    tag: 'New',
    text: 'Shop any Indian store, then Buy with Ducan —',
    strong: 'our Chrome extension is here.',
    cta: 'Get the extension',
    to: '/ways-to-shop',
  },
  {
    icon: TicketPercent,
    tag: 'Deal',
    text: 'New here? Grab',
    strong: '15% off your first order + free consolidation.',
    cta: 'Claim coupon',
    to: '/coupons',
  },
  {
    icon: PackageCheck,
    tag: 'Ship',
    text: 'One warehouse, one box, one tracking number —',
    strong: 'ship 120k+ parcels worldwide from India.',
    cta: 'See how it works',
    to: '/ways-to-shop',
  },
]

export default function NoticeBar() {
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const { serviceBanners } = useHomeData()

  // Live service banners from /api/v1/home/service-banners take priority; the
  // built-in promos are the fallback when none are configured.
  const items: Promo[] = serviceBanners.length
    ? serviceBanners.map((text) => ({
        icon: Megaphone,
        tag: 'News',
        text: '',
        strong: text,
        cta: 'Learn more',
        to: '/guide',
      }))
    : PROMOS

  useEffect(() => {
    if (dismissed || items.length < 2) return
    const id = window.setInterval(() => setIdx((i) => (i + 1) % items.length), 5000)
    return () => window.clearInterval(id)
  }, [dismissed, items.length])

  if (dismissed || items.length === 0) return null

  const promo = items[idx % items.length]
  const Icon = promo.icon

  return (
    <div className="relative z-10 overflow-hidden bg-navy-950 text-white">
      {/* warm glow anchored to the CTA side + brand hairline */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-48 w-72 -translate-y-1/2 rounded-full bg-tangerine-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-48 w-64 -translate-y-1/2 rounded-full bg-navy-500/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tangerine-400/60 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        {/* rotating tag pill */}
        <span
          key={`tag-${idx}`}
          className="hidden shrink-0 animate-[promo-in_0.5s_ease] items-center gap-1.5 rounded-full bg-gradient-to-r from-tangerine-500 to-tangerine-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-tangerine-500/30 sm:inline-flex"
        >
          <Icon className="h-3 w-3" /> {promo.tag}
        </span>

        <div key={idx} className="min-w-0 flex-1 overflow-hidden">
          <p className="animate-[promo-in_0.5s_ease] truncate text-center text-[13px] tracking-tight sm:text-sm">
            <Icon className="mb-0.5 mr-1.5 inline h-3.5 w-3.5 text-tangerine-300 sm:hidden" />
            <span className="text-white/65">{promo.text} </span>
            <span className="font-semibold text-white">{promo.strong}</span>
          </p>
        </div>

        <Link
          to={promo.to}
          className="group hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-navy-900 shadow-sm transition hover:bg-tangerine-50 hover:text-tangerine-700 sm:flex"
        >
          {promo.cta}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>

        <div className="hidden items-center gap-1.5 sm:flex">
          {PROMOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show promo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-5 bg-tangerine-400' : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

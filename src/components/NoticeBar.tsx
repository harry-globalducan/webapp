import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Puzzle, X, ArrowRight, Megaphone, Link2, TicketPercent } from 'lucide-react'
import { useHomeData } from '../context/HomeDataContext'
import { chromeExtension } from '../data/apps'

type Promo = {
  icon: typeof Puzzle
  tag: string
  text: string
  strong: string
  cta: string
  to: string
  /** Optional external link (Chrome Web Store). */
  href?: string
}

const DEFAULT_PROMOS: Promo[] = [
  {
    icon: Puzzle,
    tag: 'Extension',
    text: 'Shop Amazon, Myntra & Nykaa on the real site —',
    strong: 'install Buy with Ducan for Chrome for landed-cost estimates.',
    cta: 'Add to Chrome',
    to: '/ways-to-shop',
    href: chromeExtension.href,
  },
  {
    icon: Link2,
    tag: 'Tip',
    text: 'No extension?',
    strong: 'Paste any product link into Capture — we read the price and show your item fee.',
    cta: 'Paste a link',
    to: '/capture',
  },
  {
    icon: TicketPercent,
    tag: 'Deals',
    text: 'Consolidate multiple stores into one parcel —',
    strong: 'save on international shipping from our India warehouse.',
    cta: 'See shipping',
    to: '/shipping',
  },
]

export default function NoticeBar() {
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const { serviceBanners } = useHomeData()

  const items = useMemo(() => {
    const fromApi: Promo[] = serviceBanners
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({
        icon: Megaphone,
        tag: 'News',
        text: '',
        strong: text,
        cta: 'Learn more',
        to: '/guide',
      }))
    // API news first when present; always keep the extension + tip defaults underneath.
    return fromApi.length ? [...fromApi, ...DEFAULT_PROMOS] : DEFAULT_PROMOS
  }, [serviceBanners])

  useEffect(() => {
    if (dismissed || items.length < 2) return
    const id = window.setInterval(() => setIdx((i) => (i + 1) % items.length), 5000)
    return () => window.clearInterval(id)
  }, [dismissed, items.length])

  useEffect(() => {
    setIdx(0)
  }, [items.length])

  if (dismissed || items.length === 0) return null

  const promo = items[idx % items.length]
  const Icon = promo.icon
  const ctaClass =
    'group hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-navy-900 shadow-sm transition hover:bg-tangerine-50 hover:text-tangerine-700 sm:flex'

  return (
    <div className="relative z-10 overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-48 w-72 -translate-y-1/2 rounded-full bg-tangerine-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-48 w-64 -translate-y-1/2 rounded-full bg-navy-500/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tangerine-400/60 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <span
          key={`tag-${idx}`}
          className="hidden shrink-0 animate-[promo-in_0.5s_ease] items-center gap-1.5 rounded-full bg-gradient-to-r from-tangerine-500 to-tangerine-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-tangerine-500/30 sm:inline-flex"
        >
          <Icon className="h-3 w-3" /> {promo.tag}
        </span>

        <div key={idx} className="min-w-0 flex-1 overflow-hidden">
          <p className="animate-[promo-in_0.5s_ease] truncate text-center text-[13px] tracking-tight sm:text-sm">
            <Icon className="mb-0.5 mr-1.5 inline h-3.5 w-3.5 text-tangerine-300 sm:hidden" />
            {promo.text ? <span className="text-white/65">{promo.text} </span> : null}
            <span className="font-semibold text-white">{promo.strong}</span>
          </p>
        </div>

        {promo.href ? (
          <a href={promo.href} target="_blank" rel="noreferrer" className={ctaClass}>
            {promo.cta}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link to={promo.to} className={ctaClass}>
            {promo.cta}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        )}

        <div className="hidden items-center gap-1.5 sm:flex">
          {items.map((_, i) => (
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

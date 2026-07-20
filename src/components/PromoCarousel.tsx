import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { PromoBanner, BannerTone } from '../data/banners'

const toneStyles: Record<
  BannerTone,
  { accent: string; badge: string; cta: string; wash: string; blob: string }
> = {
  navy: {
    accent: 'bg-navy-800',
    badge: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200',
    cta: 'bg-navy-800 text-white hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400',
    wash: 'from-navy-50/80 to-transparent dark:from-navy-500/10',
    blob: 'bg-navy-400/15 dark:bg-navy-500/15',
  },
  tangerine: {
    accent: 'bg-tangerine-500',
    badge: 'bg-tangerine-100 text-tangerine-700 dark:bg-tangerine-500/20 dark:text-tangerine-300',
    cta: 'bg-tangerine-500 text-white hover:bg-tangerine-400',
    wash: 'from-tangerine-50/90 to-transparent dark:from-tangerine-500/10',
    blob: 'bg-tangerine-400/20 dark:bg-tangerine-500/15',
  },
  leaf: {
    accent: 'bg-leaf-500',
    badge: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300',
    cta: 'bg-leaf-600 text-white hover:bg-leaf-500',
    wash: 'from-leaf-50/90 to-transparent dark:from-leaf-500/10',
    blob: 'bg-leaf-400/20 dark:bg-leaf-500/15',
  },
}

const slideShell =
  'relative flex min-h-[13rem] flex-col overflow-hidden rounded-[1.75rem] border p-6 dark:border-white/10 dark:bg-black sm:min-h-[12.5rem] sm:p-8'

function isHashLink(to: string) {
  return to.includes('#')
}

function BannerCta({
  to,
  label,
  className,
}: {
  to: string
  label: string
  className: string
}) {
  const classes = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${className}`
  if (isHashLink(to)) {
    return (
      <a href={to} className={classes}>
        {label} <ArrowRight className="h-4 w-4" />
      </a>
    )
  }
  return (
    <Link to={to} className={classes}>
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function BannerEyebrow({
  eyebrow,
  badge,
  badgeClass,
  eyebrowClass,
}: {
  eyebrow: string
  badge?: string
  badgeClass: string
  eyebrowClass: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${eyebrowClass}`}>
        {eyebrow}
      </span>
      {badge && (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

function DefaultSlide({ banner }: { banner: PromoBanner }) {
  const styles = toneStyles[banner.tone]
  return (
    <div className={`${slideShell} justify-center border-navy-900/8 bg-gradient-to-br ${styles.wash} bg-white`}>
      <div className={`absolute bottom-0 left-0 top-0 w-1 ${styles.accent}`} />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl ${styles.blob}`}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl pl-3">
          <BannerEyebrow
            eyebrow={banner.eyebrow}
            badge={banner.badge}
            badgeClass={styles.badge}
            eyebrowClass="text-slate-400"
          />
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
            {banner.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {banner.subtitle}
          </p>
        </div>
        <BannerCta to={banner.to} label={banner.ctaLabel} className={styles.cta} />
      </div>
    </div>
  )
}

function BeautyArtwork() {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden
      className="h-full w-full"
    >
      <circle cx="118" cy="104" r="84" className="fill-leaf-100/60 dark:fill-leaf-500/10" />
      <circle
        cx="118"
        cy="104"
        r="84"
        strokeWidth="1.5"
        className="stroke-leaf-300/60 dark:stroke-leaf-400/25"
      />
      <g className="origin-center animate-float">
        <path
          d="M120 182 C 117 142 117 110 122 74"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-leaf-500 dark:stroke-leaf-400"
        />
        <path
          d="M120 124 C 82 122 62 98 66 66 C 102 66 122 90 120 124 Z"
          className="fill-leaf-400 dark:fill-leaf-500"
        />
        <path
          d="M120 124 C 100 114 82 98 68 68"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-leaf-50/80 dark:stroke-black/25"
        />
        <path
          d="M122 100 C 160 98 180 74 176 42 C 140 42 120 66 122 100 Z"
          className="fill-leaf-500 dark:fill-leaf-400"
        />
        <path
          d="M122 100 C 142 90 160 74 174 44"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-leaf-50/80 dark:stroke-black/25"
        />
      </g>
      <g className="animate-float-late">
        <path
          d="M86 138 C 86 138 74 152 74 161 a 12 12 0 1 0 24 0 C 98 152 86 138 86 138 Z"
          className="fill-leaf-200/90 dark:fill-leaf-400/50"
        />
        <path
          d="M150 150 C 150 150 142 160 142 166 a 8 8 0 1 0 16 0 C 158 160 150 150 150 150 Z"
          className="fill-tangerine-400/90 dark:fill-tangerine-400/80"
        />
      </g>
      <circle cx="164" cy="120" r="3" className="fill-leaf-400/80 dark:fill-leaf-300/70" />
      <circle cx="70" cy="112" r="2.5" className="fill-tangerine-300/90 dark:fill-tangerine-400/70" />
    </svg>
  )
}

function BeautySlide({ banner }: { banner: PromoBanner }) {
  const styles = toneStyles[banner.tone]
  return (
    <div
      className={`${slideShell} justify-center border-leaf-900/10 bg-gradient-to-br from-leaf-50 via-white to-tangerine-50/50 dark:from-leaf-500/10 dark:via-black dark:to-tangerine-500/5`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-leaf-300/25 blur-3xl dark:bg-leaf-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-tangerine-200/40 blur-3xl dark:bg-tangerine-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-90 sm:block lg:h-72 lg:w-72"
      >
        <BeautyArtwork />
      </div>

      <div className="relative max-w-md sm:max-w-lg">
        <BannerEyebrow
          eyebrow={banner.eyebrow}
          badge={banner.badge}
          badgeClass={styles.badge}
          eyebrowClass="text-leaf-700 dark:text-leaf-300"
        />
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
          {banner.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {banner.subtitle}
        </p>

        {banner.accentStores && banner.accentStores.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf-700 dark:text-leaf-300">
            {banner.accentStores.map((store, i) => (
              <span key={store} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden className="h-1 w-1 rounded-full bg-leaf-400/70" />
                )}
                {store}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5">
          <BannerCta to={banner.to} label={banner.ctaLabel} className={styles.cta} />
        </div>
      </div>
    </div>
  )
}

function Slide({ banner }: { banner: PromoBanner }) {
  if (banner.visual === 'beauty') return <BeautySlide banner={banner} />
  return <DefaultSlide banner={banner} />
}

export default function PromoCarousel({ banners }: { banners: PromoBanner[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = banners.length

  useEffect(() => {
    if (count <= 1 || paused) return
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 5500)
    return () => window.clearInterval(id)
  }, [count, paused])

  if (count === 0) return null

  const go = (next: number) => {
    setIndex(((next % count) + count) % count)
  }

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
    >
      <div className="overflow-hidden">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={`transition-opacity duration-500 ${
              i === index ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
            }`}
          >
            <Slide banner={banner} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" role="tablist" aria-label="Slide indicators">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? 'w-6 bg-navy-800 dark:bg-white'
                    : 'w-1.5 bg-navy-900/15 hover:bg-navy-900/30 dark:bg-white/25'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous promotion"
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/10 bg-white text-navy-700 transition hover:border-navy-300 dark:border-white/10 dark:bg-black dark:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next promotion"
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/10 bg-white text-navy-700 transition hover:border-navy-300 dark:border-white/10 dark:bg-black dark:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

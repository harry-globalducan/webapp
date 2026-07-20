import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PromoBanner, BannerTone } from '../data/banners'

const toneStyles: Record<BannerTone, { badge: string; bar: string }> = {
  navy: {
    badge: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200',
    bar: 'bg-navy-800',
  },
  tangerine: {
    badge: 'bg-tangerine-100 text-tangerine-700 dark:bg-tangerine-500/20 dark:text-tangerine-300',
    bar: 'bg-tangerine-500',
  },
  leaf: {
    badge: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300',
    bar: 'bg-leaf-500',
  },
}

function isHashLink(to: string) {
  return to.includes('#')
}

export default function PromoStrip({ banner }: { banner: PromoBanner }) {
  const styles = toneStyles[banner.tone]

  const body = (
    <>
      <span className={`absolute bottom-0 left-0 top-0 w-1 ${styles.bar}`} />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 pl-2 sm:gap-3">
        {banner.badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
          >
            {banner.badge}
          </span>
        )}
        <p className="min-w-0 text-sm leading-snug text-navy-900 dark:text-white">
          <span className="font-semibold">{banner.title}</span>
          <span className="hidden text-slate-500 sm:inline dark:text-slate-400">
            {' '}
            — {banner.subtitle}
          </span>
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-600 dark:text-navy-200">
        {banner.ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </>
  )

  const className =
    'relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-navy-900/8 bg-white px-4 py-3.5 transition hover:border-navy-300 dark:border-white/10 dark:bg-black dark:hover:border-white/25 sm:px-5'

  if (isHashLink(banner.to)) {
    return (
      <a href={banner.to} className={className}>
        {body}
      </a>
    )
  }

  return (
    <Link to={banner.to} className={className}>
      {body}
    </Link>
  )
}

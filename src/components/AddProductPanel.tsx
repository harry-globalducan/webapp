import { Link } from 'react-router-dom'
import { Link2, ScanSearch, ShoppingBag } from 'lucide-react'
import CaptureFlow from './CaptureFlow'
import { useHomeData } from '../context/HomeDataContext'
import StoreLogo from './StoreLogo'

const steps = [
  { icon: Link2, label: 'Paste a product link' },
  { icon: ScanSearch, label: 'We read price & options' },
  { icon: ShoppingBag, label: 'Add to your Ducan cart' },
]


interface AddProductPanelProps {
  /** When a share/bookmarklet URL is already present */
  initialUrl?: string
}

export default function AddProductPanel({ initialUrl = '' }: AddProductPanelProps) {
  const { stores } = useHomeData()
  const showcaseStores = stores.slice(0, 8)
  const hasLink = Boolean(initialUrl)
  const titleLead = hasLink ? 'Almost there —' : 'Add any product to your'
  const titleAccent = hasLink ? 'review & add to cart' : 'Ducan cart'

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-navy-900/8 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-black dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.8)]">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,136,27,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(0,74,173,0.1),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(255,136,27,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(0,74,173,0.18),_transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,74,173,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,74,173,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
        aria-hidden
      />

      <div className="relative px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-2xl text-center">
          {hasLink && (
            <span className="mb-4 inline-flex animate-pop items-center gap-1.5 rounded-full border border-leaf-500/25 bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700 dark:border-leaf-400/30 dark:bg-leaf-500/10 dark:text-leaf-300">
              Product link received
            </span>
          )}
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-tangerine-600 dark:text-tangerine-400">
            Paste &amp; shop
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] dark:text-white">
            {titleLead}{' '}
            <span className="text-tangerine-500 dark:text-tangerine-400">{titleAccent}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Copy a product URL from Amazon, Myntra, Nykaa, or any supported store. We convert the
            price and show your full cost now — including shipping estimated from the item's weight.
          </p>
        </div>

        {/* Process — one row, not cards */}
        <ol className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => (
            <li key={step.label} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
              {i < steps.length - 1 && (
                <span
                  className="absolute left-[calc(50%+2.25rem)] top-5 hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-navy-900/20 to-transparent sm:block dark:from-white/20"
                  aria-hidden
                />
              )}
              <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white dark:bg-white dark:text-navy-900">
                <step.icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="text-sm font-medium text-navy-800 dark:text-white/90">
                <span className="mr-1.5 font-display text-xs font-bold text-tangerine-500 sm:mr-0 sm:mb-0.5 sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-9 max-w-2xl">
          <CaptureFlow initialUrl={initialUrl} variant="light" />
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 border-t border-navy-900/8 pt-6 dark:border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Works with
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {showcaseStores.map((store, i) => (
              <li
                key={store.domain}
                className="flex items-center gap-2 rounded-full border border-navy-900/8 bg-white/80 px-3 py-1.5 text-xs font-medium text-navy-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <StoreLogo
                  src={store.logo}
                  name={store.name}
                  domain={store.domain}
                  className="h-4 w-4 rounded-sm object-contain"
                />
                {store.name}
              </li>
            ))}
          </ul>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Prefer the Chrome extension or share sheet?{' '}
            <Link
              to="/ways-to-shop"
              className="font-semibold text-navy-800 underline decoration-navy-800/20 underline-offset-2 transition hover:text-tangerine-600 hover:decoration-tangerine-500/40 dark:text-tangerine-300 dark:hover:text-tangerine-200"
            >
              See all ways to shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

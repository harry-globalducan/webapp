import { Link } from 'react-router-dom'
import { Store, TicketPercent, Sparkles, Grid2x2, Gift } from 'lucide-react'
import { useHomeData } from '../context/HomeDataContext'
import { useShopGate } from './ShopGate'

const CATEGORY_TAGS = [
  { label: 'Fashion', to: '/#stores' },
  { label: 'Health & Beauty', to: '/#stores' },
  { label: 'Electronics', to: '/#stores' },
  { label: 'Home & Kids', to: '/#stores' },
]

/** Doorzo-style store shortcut rail — colorful icon tiles + quick category tags. */
export default function StoreRail() {
  const { requestShop, resetSkip } = useShopGate()
  const { stores, loading } = useHomeData()

  return (
    <div className="border-b border-navy-900/5 bg-white dark:border-white/5 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* icon tiles */}
        <div className="flex items-center gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading &&
            stores.length === 0 &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={`sk-${i}`} className="flex w-[74px] shrink-0 flex-col items-center gap-1.5">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-navy-900/5 dark:bg-white/10" />
                <div className="h-2 w-12 animate-pulse rounded-full bg-navy-900/5 dark:bg-white/10" />
              </div>
            ))}

          {stores.slice(0, 12).map((store) => (
            <button
              key={store.domain}
              type="button"
              onClick={() => requestShop({ name: store.name, domain: store.domain, logo: store.logo })}
              className="group flex w-[74px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-navy-900/8 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-tangerine-300 group-hover:shadow-md dark:border-white/10 dark:bg-white/5">
                <img
                  src={store.logo}
                  alt=""
                  className="h-6 w-6 rounded object-contain"
                  loading="lazy"
                />
              </span>
              <span className="w-full truncate text-center text-[11px] font-medium text-navy-800/80 group-hover:text-navy-900 dark:text-white/70 dark:group-hover:text-white">
                {store.name}
              </span>
            </button>
          ))}

          <Link
            to="/#stores"
            className="group flex w-[74px] shrink-0 flex-col items-center gap-1.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-navy-900/20 bg-cream-50 text-navy-500 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-tangerine-400 group-hover:text-tangerine-500 dark:border-white/20 dark:bg-white/5 dark:text-navy-200">
              <Grid2x2 className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium text-navy-800/80 dark:text-white/70">
              More shops
            </span>
          </Link>
        </div>

        {/* quick category tags */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-navy-900/5 py-2.5 text-xs [scrollbar-width:none] dark:border-white/5 [&::-webkit-scrollbar]:hidden">
          <span className="flex shrink-0 items-center gap-1.5 font-semibold text-navy-800 dark:text-white">
            <Store className="h-3.5 w-3.5 text-tangerine-500" /> Browse
          </span>
          {CATEGORY_TAGS.map((tag) => (
            <Link
              key={tag.label}
              to={tag.to}
              className="shrink-0 rounded-full px-2.5 py-1 font-medium text-navy-700/80 transition hover:bg-navy-900/5 hover:text-navy-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {tag.label}
            </Link>
          ))}
          <span className="mx-0.5 h-4 w-px shrink-0 bg-navy-900/10 dark:bg-white/10" />
          <Link
            to="/coupons"
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-tangerine-600 transition hover:bg-tangerine-50 dark:text-tangerine-300 dark:hover:bg-tangerine-500/10"
          >
            <TicketPercent className="h-3.5 w-3.5" /> Coupons
          </Link>
          <Link
            to="/refer"
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-tangerine-600 transition hover:bg-tangerine-50 dark:text-tangerine-300 dark:hover:bg-tangerine-500/10"
          >
            <Gift className="h-3.5 w-3.5" /> Invite friends
          </Link>
          <button
            type="button"
            onClick={() => {
              resetSkip()
              const amazon = stores.find((s) => s.domain === 'amazon.in') ?? stores[0]
              if (!amazon) return
              requestShop({ name: amazon.name, domain: amazon.domain, logo: amazon.logo })
            }}
            className="ms-auto flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-navy-600 transition hover:bg-navy-900/5 dark:text-navy-300 dark:hover:bg-white/10"
          >
            <Sparkles className="h-3.5 w-3.5" /> How buying works
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState, type MouseEvent } from 'react'
import { ArrowUpRight, Truck } from 'lucide-react'
import type { Store } from '../data/stores'
import { useShopGate } from './ShopGate'

function StoreLogo({ store, size }: { store: Store; size: string }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (imgFailed) {
    return (
      <span className="font-display text-xl font-bold text-navy-300">
        {store.name.slice(0, 2).toUpperCase()}
      </span>
    )
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${store.domain}&sz=128`}
      alt={store.name}
      className={`${size} rounded-xl object-contain`}
      loading="lazy"
      onError={() => setImgFailed(true)}
    />
  )
}

function useOpenShop(store: Store) {
  const { requestShop } = useShopGate()
  return (e: MouseEvent) => {
    e.preventDefault()
    requestShop({ name: store.name, domain: store.domain })
  }
}

/** Preferred partner — light open card, not a dark block. */
export function FeaturedStoreCard({ store }: { store: Store }) {
  const onShop = useOpenShop(store)
  return (
    <a
      href={`https://${store.domain}`}
      onClick={onShop}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-navy-900/8 bg-white p-7 transition duration-300 hover:-translate-y-0.5 hover:border-navy-300 dark:border-white/10 dark:bg-black dark:hover:border-white/25"
    >
      <div className="relative flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 ring-1 ring-navy-900/5 dark:bg-white/10 dark:ring-white/10">
          <StoreLogo store={store} size="h-9 w-9" />
        </span>
        <span className="rounded-full bg-tangerine-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-tangerine-700 dark:bg-tangerine-500/15 dark:text-tangerine-300">
          Preferred
        </span>
      </div>
      <div className="relative mt-8">
        <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
          {store.name}
        </h3>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {store.offer}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Truck className="h-3.5 w-3.5" /> {store.delivery} to your door
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-navy-700 transition group-hover:gap-2 dark:text-tangerine-300">
            Shop now <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  )
}

/** Compact tile with hover reveal of category + delivery. */
export default function StoreCard({ store }: { store: Store }) {
  const onShop = useOpenShop(store)
  return (
    <a
      href={`https://${store.domain}`}
      onClick={onShop}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-navy-300 dark:border-white/10 dark:bg-black dark:hover:border-white/25"
    >
      <div className="flex h-24 items-center justify-center bg-white p-5 dark:bg-white/5">
        <StoreLogo store={store} size="h-12 w-12" />
      </div>
      <div className="border-t border-navy-900/5 px-4 py-2.5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-navy-900 dark:text-white">
            {store.name}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-300 transition group-hover:text-tangerine-500" />
        </div>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="pt-1 text-[11px] text-slate-400">
              {store.category} · {store.delivery}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

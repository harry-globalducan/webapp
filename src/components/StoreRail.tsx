import { stores } from '../data/stores'
import { useShopGate } from './ShopGate'

/** Horizontal India store rail — opens Shop Gate before the real retailer. */
export default function StoreRail() {
  const { requestShop, resetSkip } = useShopGate()

  return (
    <div className="relative z-10 border-b border-navy-900/5 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-black/90">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Shop on
        </span>
        {stores.slice(0, 12).map((store) => (
          <button
            key={store.domain}
            type="button"
            onClick={() => requestShop({ name: store.name, domain: store.domain })}
            className="flex shrink-0 items-center gap-2 rounded-full border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-semibold text-navy-800 transition hover:bg-cream-100 dark:text-white dark:hover:bg-white/10"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${store.domain}&sz=32`}
              alt=""
              className="h-4 w-4 rounded"
              loading="lazy"
            />
            {store.name}
          </button>
        ))}
        <a
          href="#stores"
          className="shrink-0 rounded-full border border-dashed border-navy-900/15 px-3 py-1.5 text-xs font-semibold text-navy-600 transition hover:border-navy-400 dark:border-white/15 dark:text-navy-200"
        >
          More shops
        </a>
        <button
          type="button"
          onClick={() => {
            resetSkip()
            const amazon = stores.find((s) => s.domain === 'amazon.in') ?? stores[0]
            requestShop({ name: amazon.name, domain: amazon.domain })
          }}
          className="shrink-0 text-[11px] font-semibold text-navy-500 underline-offset-2 hover:text-navy-800 hover:underline dark:text-navy-300"
        >
          How buying works
        </button>
      </div>
    </div>
  )
}

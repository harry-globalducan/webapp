import { useEffect, useState } from 'react'
import { Plane, Star, ArrowUpRight } from 'lucide-react'
import { useHomeData } from '../context/HomeDataContext'
import type { Store } from '../data/stores'
import { useShopGate } from './ShopGate'
import { useCurrency } from '../context/CurrencyContext'

/** Sample live shipments — the floating badge cycles through these destinations. */
const ROUTES = [
  { to: 'UAE', code: 'GD-2903' },
  { to: 'Maldives', code: 'GD-2841' },
  { to: 'Mauritius', code: 'GD-3012' },
  { to: 'Seychelles', code: 'GD-3118' },
  { to: 'Nepal', code: 'GD-2770' },
  { to: 'Bhutan', code: 'GD-2655' },
  { to: 'Saudi', code: 'GD-2461' },
  { to: 'Sri Lanka', code: 'GD-3244' },
]

type Card =
  | { kind: 'store'; store: Store }
  | { kind: 'product'; emoji: string; name: string; priceUSD: number; to: string; tint: string }

type ProductCard = Extract<Card, { kind: 'product' }>

/** Illustrative products; store cards are interleaved from the live list. */
const PRODUCTS_A: ProductCard[] = [
  { kind: 'product', emoji: '🥻', name: 'Banarasi Saree', priceUSD: 96, to: 'Dubai', tint: 'from-tangerine-100 to-tangerine-50 dark:from-tangerine-500/15 dark:to-transparent' },
  { kind: 'product', emoji: '🎧', name: 'boAt Airdopes', priceUSD: 28, to: 'Malé', tint: 'from-navy-100 to-navy-50 dark:from-navy-500/20 dark:to-transparent' },
]

const PRODUCTS_B: ProductCard[] = [
  { kind: 'product', emoji: '💄', name: 'Nykaa Beauty Box', priceUSD: 34, to: 'Victoria', tint: 'from-tangerine-100 to-tangerine-50 dark:from-tangerine-500/15 dark:to-transparent' },
  { kind: 'product', emoji: '⌚', name: 'Noise Smartwatch', priceUSD: 41, to: 'Thimphu', tint: 'from-leaf-100 to-leaf-50 dark:from-leaf-500/15 dark:to-transparent' },
  { kind: 'product', emoji: '👗', name: 'Anarkali Set', priceUSD: 52, to: 'Port Louis', tint: 'from-navy-100 to-navy-50 dark:from-navy-500/20 dark:to-transparent' },
]

/** Interleave live stores with the product cards. */
function buildColumn(stores: Store[], products: ProductCard[]): Card[] {
  const out: Card[] = []
  const max = Math.max(stores.length, products.length)
  for (let i = 0; i < max; i += 1) {
    if (stores[i]) out.push({ kind: 'store', store: stores[i] })
    if (products[i]) out.push(products[i])
  }
  return out
}

function CardTile({ card, onStore }: { card: Card; onStore: (store: Store) => void }) {
  const { formatPrice } = useCurrency()
  if (card.kind === 'store') {
    return (
      <button
        type="button"
        onClick={() => onStore(card.store)}
        className="group flex w-full items-center gap-3 rounded-2xl border border-navy-900/8 bg-white p-3.5 text-left shadow-sm transition hover:border-tangerine-300 dark:border-white/10 dark:bg-white/5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-50 dark:bg-white/10">
          <img src={card.store.logo} alt="" className="h-6 w-6 rounded object-contain" loading="lazy" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-navy-900 dark:text-white">{card.store.name}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{card.store.category}</span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-300 transition group-hover:text-tangerine-500" />
      </button>
    )
  }
  return (
    <div className={`rounded-2xl border border-navy-900/8 bg-gradient-to-br ${card.tint} p-3.5 shadow-sm dark:border-white/10`}>
      <div className="flex items-start justify-between">
        <span className="text-2xl">{card.emoji}</span>
        <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-leaf-700 shadow-sm dark:bg-black/40 dark:text-leaf-300">
          <Plane className="h-2.5 w-2.5" /> {card.to}
        </span>
      </div>
      <div className="mt-4 text-sm font-semibold text-navy-900 dark:text-white">{card.name}</div>
      <div className="text-xs font-bold text-tangerine-600 dark:text-tangerine-300">{formatPrice(card.priceUSD)}</div>
    </div>
  )
}

function Column({
  cards,
  dir,
  onStore,
}: {
  cards: Card[]
  dir: 'up' | 'down'
  onStore: (store: Store) => void
}) {
  const loop = [...cards, ...cards]
  return (
    <div className="flex-1">
      <div className={`flex flex-col gap-3 ${dir === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'}`}>
        {loop.map((card, i) => (
          <CardTile key={i} card={card} onStore={onStore} />
        ))}
      </div>
    </div>
  )
}

/** Auto-scrolling montage of brands & products — the homepage hero visual. */
export default function HeroBento() {
  const { requestShop } = useShopGate()
  const { stores } = useHomeData()
  const [routeIdx, setRouteIdx] = useState(0)

  // Store cards come straight from the API, split across the two columns.
  const columnA = buildColumn(stores.filter((_, i) => i % 2 === 0).slice(0, 3), PRODUCTS_A)
  const columnB = buildColumn(stores.filter((_, i) => i % 2 === 1).slice(0, 3), PRODUCTS_B)

  useEffect(() => {
    const id = window.setInterval(() => setRouteIdx((i) => (i + 1) % ROUTES.length), 2600)
    return () => window.clearInterval(id)
  }, [])

  const route = ROUTES[routeIdx]
  const onStore = (store: Store) =>
    requestShop({ name: store.name, domain: store.domain, logo: store.logo })

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-tangerine-300/20 via-navy-300/15 to-transparent blur-2xl dark:from-tangerine-500/10 dark:via-navy-500/10" />

      {/* scrolling columns, faded at top & bottom */}
      <div className="flex h-[440px] gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:h-[500px]">
        <Column cards={columnA} dir="up" onStore={onStore} />
        <Column cards={columnB} dir="down" onStore={onStore} />
      </div>

      {/* Floating shipment badge — cycles through live destinations */}
      <div className="absolute -right-2 top-6 z-10 rounded-2xl border border-navy-900/8 bg-white/95 px-4 py-2.5 shadow-lg shadow-navy-900/10 backdrop-blur dark:border-white/10 dark:bg-black/85 sm:-right-5">
        <div key={route.code + route.to} className="animate-[promo-in_0.45s_ease]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Order #{route.code}</span>
            <span className="rounded-full bg-leaf-100 px-1.5 py-0.5 text-[9px] font-bold text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300">
              In transit
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-navy-900 dark:text-white">
            <Plane className="h-3.5 w-3.5 text-tangerine-500" /> India → {route.to}
          </div>
        </div>
      </div>

      {/* Floating rating badge */}
      <div className="absolute -left-3 bottom-8 z-10 rounded-2xl border border-navy-900/8 bg-white/95 px-3.5 py-2 shadow-lg shadow-navy-900/10 backdrop-blur dark:border-white/10 dark:bg-black/85">
        <div className="flex items-center gap-1.5">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-tangerine-400 text-tangerine-400" />
            ))}
          </span>
          <span className="text-sm font-bold text-navy-900 dark:text-white">4.8</span>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">25k+ global shoppers</div>
      </div>
    </div>
  )
}

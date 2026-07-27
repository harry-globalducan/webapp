import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Plane,
  ShoppingCart,
  Check,
  CalendarClock,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

/** A cart row can only be checked out once the server has priced it. */
function isPriced(status?: string) {
  return status !== 'NEW'
}

export default function Cart() {
  const { formatPrice } = useCurrency()
  const { items, remove, setQty, clear, loading } = useCart()
  const navigate = useNavigate()
  const [clearing, setClearing] = useState(false)

  // Selection drives what gets checked out; unpriced rows can't be selected.
  const [deselected, setDeselected] = useState<Set<string>>(new Set())
  const selectedIds = useMemo(
    () => items.filter((it) => isPriced(it.status) && !deselected.has(it.id)).map((it) => it.id),
    [items, deselected],
  )
  const selected = items.filter((it) => selectedIds.includes(it.id))
  const subtotal = selected.reduce((sum, it) => sum + it.priceUSD * it.qty, 0)

  const toggle = (id: string) =>
    setDeselected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const clearAll = async () => {
    setClearing(true)
    try {
      await clear()
    } finally {
      setClearing(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My cart</h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => void clearAll()}
            disabled={clearing}
            className="text-sm font-semibold text-navy-600 transition hover:text-red-600 disabled:opacity-50 dark:text-tangerine-300"
          >
            {clearing ? 'Clearing…' : 'Clear all'}
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Only priced items can be checked out.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {loading && items.length === 0 && (
            <div className="space-y-4" aria-busy="true">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-5 rounded-3xl border border-navy-900/5 bg-white p-5 dark:border-white/10 dark:bg-black"
                >
                  <div className="h-20 w-20 shrink-0 rounded-2xl bg-navy-900/10 dark:bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded-full bg-navy-900/10 dark:bg-white/10" />
                    <div className="h-3 w-1/3 rounded-full bg-navy-900/10 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="rounded-3xl border border-navy-900/5 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-black">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-navy-100 text-navy-500 dark:bg-navy-500/20 dark:text-navy-200">
                <ShoppingCart className="h-7 w-7" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-white">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Paste a product link from any supported store to add your first item.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
              >
                Start shopping
              </Link>
            </div>
          )}

          {items.map((item) => {
            const priced = isPriced(item.status)
            const checked = priced && !deselected.has(item.id)
            return (
              <div
                key={item.id}
                className={`flex items-start gap-4 rounded-3xl border bg-white p-5 shadow-sm transition dark:bg-black ${
                  checked
                    ? 'border-navy-900/10 dark:border-white/10'
                    : 'border-navy-900/5 opacity-70 dark:border-white/5'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  disabled={!priced}
                  onClick={() => toggle(item.id)}
                  aria-label={`Select ${item.title}`}
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                    checked
                      ? 'border-navy-800 bg-navy-800 text-white dark:border-tangerine-500 dark:bg-tangerine-500'
                      : 'border-navy-900/20 bg-white dark:border-white/20 dark:bg-black'
                  } ${priced ? '' : 'cursor-not-allowed opacity-40'}`}
                >
                  {checked && <Check className="h-4 w-4" />}
                </button>

                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-200 text-4xl dark:bg-white/10">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    item.emoji
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {item.store}
                  </div>
                  <div className="line-clamp-2 font-semibold text-navy-900 dark:text-white">
                    {item.title}
                  </div>
                  {item.variants && Object.keys(item.variants).length > 0 && (
                    <div className="mt-0.5 text-xs font-medium text-navy-600 dark:text-tangerine-300">
                      {Object.values(item.variants).join(' · ')}
                    </div>
                  )}
                  <div className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">
                    {priced ? formatPrice(item.priceUSD) : '—'}
                  </div>

                  {priced ? (
                    item.expectedDispatchDate && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-leaf-700 dark:text-leaf-400">
                        <Check className="h-3.5 w-3.5" />
                        Priced · dispatch by{' '}
                        {new Date(item.expectedDispatchDate).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        if ordered today
                      </div>
                    )
                  ) : (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching price from the
                      store…
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  <button
                    onClick={() => remove(item.id)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full border border-navy-900/10 px-1.5 py-1 dark:border-white/10">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="rounded-full p-1.5 text-navy-600 hover:bg-cream-100 dark:text-white dark:hover:bg-white/10"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-navy-900 dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="rounded-full p-1.5 text-navy-600 hover:bg-cream-100 dark:text-white dark:hover:bg-white/10"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="h-fit rounded-3xl border border-navy-900/5 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {selected.length} of {items.length} item{items.length === 1 ? '' : 's'} selected
          </p>

          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
            <span className="font-display text-2xl font-bold text-navy-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            + shipping &amp; handling calculated at checkout
          </p>

          <button
            disabled={selected.length === 0}
            onClick={() => navigate('/checkout', { state: { itemIds: selectedIds } })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-tangerine-500 dark:shadow-tangerine-500/25 dark:hover:bg-tangerine-400"
          >
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </button>

          <ul className="mt-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-leaf-500" /> Buyer protection on every order
            </li>
            <li className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-leaf-500" /> Consolidated shipping to 20+ countries
            </li>
            <li className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-leaf-500" /> Dispatch dates shown per item
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}

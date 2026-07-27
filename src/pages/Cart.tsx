import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShieldCheck, Plane, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAddresses } from '../context/AddressContext'
import { ApiError } from '../lib/api'
import { useOrders } from '../context/OrdersContext'
import { useWishlist } from '../context/WishlistContext'
import { useCurrency } from '../context/CurrencyContext'

export default function Cart() {
  const { formatPrice } = useCurrency()
  const { items, remove, setQty, refresh } = useCart()
  const { add: saveWish } = useWishlist()
  const { placeBuyRequest } = useOrders()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const { active } = useAddresses()

  const subtotal = items.reduce((sum, it) => sum + it.priceUSD * it.qty, 0)
  const serviceFee = subtotal * 0.07
  // Estimated from the tentative weight of the items in the cart.
  const shippingEst = items.length ? Math.max(6, items.reduce((s, it) => s + it.qty, 0) * 5.5) : 0
  const orderTotal = subtotal + serviceFee + shippingEst

  const saveForLater = (id: string) => {
    const item = items.find((it) => it.id === id)
    if (!item) return
    saveWish({
      title: item.title,
      store: item.store,
      priceUSD: item.priceUSD,
      emoji: item.emoji,
      imageUrl: item.imageUrl,
      url: item.url,
      variants: item.variants,
    })
    remove(id)
  }

  const placeOrder = async () => {
    if (!items.length) return
    if (!active) {
      setOrderError('Add a delivery address before placing your order.')
      return
    }
    setPlacing(true)
    setOrderError(null)
    try {
      const order = await placeBuyRequest({
        deliveryAddressId: Number(active.id),
        itemIds: items.map((it) => it.id),
      })
      refresh()
      navigate(`/orders?placed=${order.id}`)
    } catch (err) {
      setOrderError(
        err instanceof ApiError ? err.message : 'Could not place your order. Please try again.',
      )
    } finally {
      setPlacing(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My cart</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        One payment covers your items, our service fee and estimated international shipping.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="rounded-3xl border border-navy-900/5 bg-white dark:border-white/10 dark:bg-black p-12 text-center shadow-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-navy-100 text-navy-500">
                <ShoppingCart className="h-7 w-7" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-white">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Shop on Amazon or another supported store, then use the Chrome extension or paste a
                product link.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                >
                  Shop Amazon.in
                </a>
                <Link
                  to="/ways-to-shop"
                  className="inline-block rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:text-white"
                >
                  Get Chrome extension
                </Link>
              </div>
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-5 rounded-3xl border border-navy-900/5 bg-white dark:border-white/10 dark:bg-black p-5 shadow-sm"
            >
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
                <div className="line-clamp-2 font-semibold text-navy-900 dark:text-white">{item.title}</div>
                <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {item.store}
                  {item.variants && Object.keys(item.variants).length > 0 && (
                    <span className="normal-case tracking-normal">
                      {' '}
                      · {Object.values(item.variants).join(' / ')}
                    </span>
                  )}
                </div>
                <div className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">
                  {formatPrice(item.priceUSD)}
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-navy-900/10 px-1.5 py-1">
                <button
                  onClick={() => setQty(item.id, item.qty - 1)}
                  className="rounded-full p-1.5 text-navy-600 hover:bg-cream-100 dark:hover:bg-white/5"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-navy-900 dark:text-white">
                  {item.qty}
                </span>
                <button
                  onClick={() => setQty(item.id, item.qty + 1)}
                  className="rounded-full p-1.5 text-navy-600 hover:bg-cream-100 dark:hover:bg-white/5"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => saveForLater(item.id)}
                className="rounded-full p-2.5 text-slate-400 transition hover:bg-tangerine-50 hover:text-tangerine-600"
                aria-label="Save for later"
                title="Save for later"
              >
                <Heart className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => remove(item.id)}
                className="rounded-full p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Remove item"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-navy-900/5 bg-white dark:border-white/10 dark:bg-black p-7 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            One payment covers the items, our service fee, estimated shipping and duties.
          </p>
          <dl className="mt-5 space-y-3 text-sm tabular-nums">
            <div className="rounded-2xl bg-cream-50 p-4 dark:bg-white/5">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Items</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="mt-1.5 flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Proxy service fee</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">
                  {formatPrice(serviceFee)}
                </dd>
              </div>
              <div className="mt-1.5 flex justify-between">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Plane className="h-3.5 w-3.5" /> Intl. shipping (est.)
                </dt>
                <dd className="font-semibold text-navy-900 dark:text-white">
                  {formatPrice(shippingEst)}
                </dd>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-navy-900/10 pt-3 text-base dark:border-white/10">
                <dt className="font-semibold text-navy-900 dark:text-white">Total to pay</dt>
                <dd className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  {formatPrice(orderTotal)}
                </dd>
              </div>
            </div>
            <p className="px-1 text-[11px] leading-relaxed text-slate-400">
              Shipping is estimated from the item&apos;s expected weight. If the packed parcel
              weighs less, the difference is refunded to your Ducan wallet.
            </p>
          </dl>
          {orderError && (
            <p className="mt-4 text-xs font-medium text-red-600 dark:text-red-400">{orderError}</p>
          )}
          <button
            disabled={items.length === 0 || placing}
            onClick={() => void placeOrder()}
            className="mt-6 w-full rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {placing ? 'Placing…' : 'Place buy request'}
          </button>
          <div className="mt-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-leaf-500" /> Buyer protection on every order
            </p>
            <p className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-leaf-500" /> Consolidated shipping to 20+ countries
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

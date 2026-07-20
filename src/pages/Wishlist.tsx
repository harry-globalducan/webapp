import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Link2, HeartOff } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const { items, remove, clear, count } = useWishlist()
  const { add: addToCart } = useCart()

  const moveToCart = (id: string) => {
    const item = items.find((it) => it.id === id)
    if (!item) return
    addToCart({
      title: item.title,
      store: item.store,
      priceUSD: item.priceUSD,
      qty: 1,
      emoji: item.emoji,
      url: item.url,
      variants: item.variants,
    })
    remove(id)
  }

  return (
    <AccountLayout
      title="Wishlist"
      description={
        count
          ? `${count} saved ${count === 1 ? 'item' : 'items'} — move to cart when you’re ready.`
          : 'Save products while you browse, then add them to your cart later.'
      }
      actions={
        count > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-navy-900/15 px-4 py-2 text-xs font-semibold text-navy-700 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
          >
            Clear all
          </button>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-black">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tangerine-50 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300">
            <Heart className="h-7 w-7" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-white">
            Your wishlist is empty
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tap the heart when capturing a product, or save items from your cart.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/capture"
              className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
            >
              <Link2 className="h-4 w-4" /> Paste a product link
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
            >
              Browse stores
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-black"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 text-3xl dark:bg-white/5">
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-navy-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {item.store}
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <span className="normal-case tracking-normal">
                        {' '}
                        · {Object.values(item.variants).join(' / ')}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 font-display text-lg font-bold tabular-nums text-navy-900 dark:text-white">
                    ${item.priceUSD.toFixed(2)}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-navy-600 hover:underline dark:text-navy-200"
                    >
                      View on store
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => moveToCart(item.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-400 sm:flex-none"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-900/15 px-4 py-2.5 text-sm font-medium text-navy-700 transition hover:border-red-300 hover:text-red-500 dark:border-white/15 dark:text-white"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sm:hidden">Remove</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <p className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <HeartOff className="h-3.5 w-3.5" />
          Saved on this device — sign in later to sync across phones (coming soon).
        </p>
      )}
    </AccountLayout>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Link2,
  ShieldCheck,
  ShoppingCart,
  Minus,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Heart,
  ClipboardPaste,
  LogIn,
} from 'lucide-react'
import { resolveProduct, landedCost, detectStore, type ResolvedProduct } from '../lib/capture'
import { AnalyticsEvents, track } from '../lib/analytics'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useHomeData } from '../context/HomeDataContext'
import { useCurrency } from '../context/CurrencyContext'
import { useWishlist } from '../context/WishlistContext'
import type { Store } from '../data/stores'
import StoreLogo from './StoreLogo'

type Phase = 'idle' | 'resolving' | 'resolved' | 'added' | 'error' | 'auth'

/**
 * Stand-in for the resolved product card while we poll the store for a price.
 * Deliberately mirrors the real card's structure — image, title, price,
 * variants, quantity, cost breakdown, CTA — so nothing shifts when it swaps in.
 */
function ProductSkeleton({ light }: { light: boolean }) {
  const bar = light ? 'text-navy-900 dark:text-white' : 'text-white'
  return (
    <div
      aria-hidden
      className={`mt-5 overflow-hidden rounded-3xl ${
        light
          ? 'border border-navy-900/8 bg-white dark:border-white/10 dark:bg-black'
          : 'bg-white/5 backdrop-blur'
      }`}
    >
      <div className="flex flex-col gap-5 p-6 sm:flex-row">
        <div className={`shimmer h-24 w-24 shrink-0 rounded-2xl ${bar}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className={`shimmer h-4 w-4 rounded ${bar}`} />
            <div className={`shimmer h-2.5 w-20 rounded ${bar}`} />
          </div>
          <div className={`shimmer mt-2 h-4 w-11/12 rounded ${bar}`} />
          <div className={`shimmer mt-1.5 h-4 w-2/3 rounded ${bar}`} />
          <div className="mt-2.5 flex items-baseline gap-2">
            <div className={`shimmer h-6 w-24 rounded ${bar}`} />
            <div className={`shimmer h-3 w-20 rounded ${bar}`} />
          </div>
          <div className={`shimmer mt-4 h-2.5 w-16 rounded ${bar}`} />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[14, 10, 12].map((w) => (
              <div key={w} className={`shimmer h-7 rounded-full ${bar}`} style={{ width: `${w * 4}px` }} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className={`shimmer h-2.5 w-8 rounded ${bar}`} />
            <div className={`shimmer h-8 w-24 rounded-full ${bar}`} />
          </div>
        </div>
      </div>

      <div
        className={`border-t border-dashed px-6 py-4 ${
          light
            ? 'border-navy-900/10 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03]'
            : 'border-white/10 bg-white/[0.03]'
        }`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((col) => (
            <div key={col} className="rounded-2xl p-4">
              <div className={`shimmer h-2.5 w-24 rounded ${bar}`} />
              <div className="mt-3 space-y-2">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="flex justify-between gap-6">
                    <div className={`shimmer h-3 flex-1 rounded ${bar}`} />
                    <div className={`shimmer h-3 w-14 rounded ${bar}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={`shimmer mt-4 h-11 w-full rounded-full ${bar}`} />
      </div>
    </div>
  )
}

interface CaptureFlowProps {
  /** URL to resolve immediately on mount (share target / bookmarklet / clipboard). */
  initialUrl?: string
  /** Light sits on AddProductPanel; dark for legacy navy embeds. */
  variant?: 'light' | 'dark'
}

export default function CaptureFlow({ initialUrl = '', variant = 'light' }: CaptureFlowProps) {
  const light = variant === 'light'
  const { addQuantity } = useCart()
  const { toggle: toggleWish, has: hasWish } = useWishlist()
  const [url, setUrl] = useState(initialUrl)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')
  const [product, setProduct] = useState<ResolvedProduct | null>(null)
  const [chosen, setChosen] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [wishSaved, setWishSaved] = useState(false)
  const [pasteHint, setPasteHint] = useState('')
  const [detected, setDetected] = useState<Store | null>(null)
  const [pendingUrl, setPendingUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const { isAuthed } = useAuth()
  const { stores: liveStores } = useHomeData()
  const { format } = useCurrency()

  // Read these through refs so `resolve` keeps a stable identity — otherwise the
  // auto-resolve effect below re-runs whenever the store list loads, re-fetching
  // (and re-adding) a product that was already captured.
  const authedRef = useRef(isAuthed)
  const storesRef = useRef(liveStores)
  useEffect(() => {
    authedRef.current = isAuthed
    storesRef.current = liveStores
  }, [isAuthed, liveStores])

  /** URLs already auto-resolved on mount, so we never fetch the same one twice. */
  const autoResolved = useRef<string | null>(null)

  const resolve = useCallback(async (target: string) => {
    if (!target.trim()) return
    if (!authedRef.current) {
      setPendingUrl(target.trim())
      setPhase('auth')
      return
    }
    setPhase('resolving')
    setError('')
    track(AnalyticsEvents.productCaptureStarted, { url: target.trim() })
    try {
      const storeApiId = storesRef.current.find(
        (st) => st.domain === detectStore(target)?.domain,
      )?.apiId
      const p = await resolveProduct(target.trim(), storeApiId)
      setProduct(p)
      setChosen(Object.fromEntries(p.variants.map((v) => [v.label, v.options[0]])))
      setQty(1)
      setWishSaved(hasWish(p.url) || hasWish(p.title))
      setDetected(p.store)
      setPhase('resolved')
      track(AnalyticsEvents.productCaptured, {
        store: p.store.name,
        title: p.title,
        price_inr: p.priceINR,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setPhase('error')
      track(AnalyticsEvents.productCaptureFailed, {
        url: target.trim(),
        message: e instanceof Error ? e.message : 'unknown',
      })
    }
    // hasWish is stable enough for post-resolve UI; omit from deps to avoid remount loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initialUrl || autoResolved.current === initialUrl) return
    autoResolved.current = initialUrl
    setUrl(initialUrl)
    void resolve(initialUrl)
  }, [initialUrl, resolve])

  useEffect(() => {
    const store = detectStore(url)
    setDetected(store)
  }, [url])

  const reset = () => {
    setPhase('idle')
    setProduct(null)
    setUrl('')
    setError('')
    setDetected(null)
    setPasteHint('')
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const trimmed = text.trim()
      if (!trimmed) {
        setPasteHint('Clipboard is empty — copy a product link first.')
        return
      }
      setUrl(trimmed)
      setPasteHint('')
      if (phase !== 'idle') setPhase('idle')
      void resolve(trimmed)
    } catch {
      setPasteHint('Allow clipboard access, or paste with ⌘V / Ctrl+V.')
    }
  }

  const addToCart = async () => {
    if (!product?.cartItemId) return
    setAdding(true)
    setError('')
    try {
      // Resolving already created (or found) the row, so adding tops up the
      // quantity that was there rather than creating a duplicate entry.
      await addQuantity(product.cartItemId, product.existingQty + qty)
      setPhase('added')
      track(AnalyticsEvents.addedToCart, {
        store: product.store.name,
        title: product.title,
        qty,
        cart_item_id: product.cartItemId,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add this to your cart.')
      setPhase('error')
    } finally {
      setAdding(false)
    }
  }

  const saveWishlist = () => {
    if (!product) return
    const saved = toggleWish({
      title: product.title,
      store: product.store.name,
      priceUSD: product.price,
      emoji: product.emoji,
      imageUrl: product.imageUrl,
      url: product.url,
      variants: chosen,
    })
    setWishSaved(saved)
  }

  const cost = product ? landedCost(product, qty) : null

  const inputClass = light
    ? 'w-full rounded-full border border-navy-900/12 bg-white py-3.5 pl-11 pr-28 text-sm text-navy-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-tangerine-400 focus:ring-4 focus:ring-tangerine-500/15 dark:border-white/15 dark:bg-black dark:text-white dark:focus:border-tangerine-400'
    : 'w-full rounded-full border border-white/10 bg-white/10 py-3.5 pl-11 pr-28 text-sm text-white placeholder-white/40 outline-none backdrop-blur transition focus:border-tangerine-400/60 focus:bg-white/15'

  const iconClass = light ? 'text-slate-400' : 'text-navy-300'

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconClass}`} />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setPasteHint('')
              if (phase !== 'idle') setPhase('idle')
            }}
            onKeyDown={(e) => e.key === 'Enter' && resolve(url)}
            placeholder="https://www.amazon.in/… or any store link"
            aria-label="Product URL"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => void pasteFromClipboard()}
            className={`absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              light
                ? 'text-navy-600 hover:bg-navy-50 dark:text-white/70 dark:hover:bg-white/10'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            title="Paste from clipboard"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            Paste
          </button>
        </div>
        <button
          type="button"
          onClick={() => resolve(url)}
          disabled={phase === 'resolving' || !url.trim()}
          className="flex items-center justify-center gap-2 rounded-full bg-tangerine-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/25 transition hover:bg-tangerine-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {phase === 'resolving' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Reading…
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" /> Fetch product
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="min-h-[1.25rem]">
          {detected && phase !== 'resolving' && phase !== 'resolved' && phase !== 'added' && (
            <span
              className={`inline-flex animate-pop items-center gap-1.5 text-xs font-medium ${
                light ? 'text-leaf-700 dark:text-leaf-300' : 'text-leaf-300'
              }`}
            >
              <img
                src={detected.logo}
                alt=""
                className="h-3.5 w-3.5 rounded-sm"
              />
              {detected.name} recognized
            </span>
          )}
          {pasteHint && (
            <span className={`text-xs ${light ? 'text-slate-500' : 'text-white/50'}`}>{pasteHint}</span>
          )}
          {phase === 'auth' && (
            <div
              className={`mt-4 rounded-2xl border p-5 text-left ${
                light
                  ? 'border-navy-900/10 bg-cream-50 dark:border-white/10 dark:bg-white/5'
                  : 'border-white/15 bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300">
                  <LogIn className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${light ? 'text-navy-900 dark:text-white' : 'text-white'}`}>
                    Sign in to fetch this product
                  </p>
                  <p className={`mt-1 text-xs leading-relaxed ${light ? 'text-slate-500 dark:text-slate-400' : 'text-white/70'}`}>
                    We read the live price and details from the store against your account, then
                    add it to your Ducan cart. We&apos;ll bring you right back here.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/login?redirect=${encodeURIComponent(`/capture?url=${encodeURIComponent(pendingUrl)}`)}`}
                      className="rounded-full bg-navy-800 px-5 py-2 text-xs font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
                    >
                      Sign in
                    </Link>
                    <Link
                      to={`/register?redirect=${encodeURIComponent(`/capture?url=${encodeURIComponent(pendingUrl)}`)}`}
                      className={`rounded-full border px-5 py-2 text-xs font-semibold transition ${
                        light
                          ? 'border-navy-900/15 text-navy-800 hover:border-navy-400 dark:border-white/20 dark:text-white'
                          : 'border-white/25 text-white hover:border-white/50'
                      }`}
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <p
              className={`flex items-center gap-1.5 text-sm font-medium ${
                light ? 'text-red-600' : 'text-red-300'
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </div>
      </div>

      {phase === 'resolving' && <ProductSkeleton light={light} />}

      {(phase === 'resolved' || phase === 'added') && product && cost && (
        <div className="mt-5 animate-card-in overflow-hidden rounded-3xl border border-navy-900/8 bg-white text-left shadow-xl shadow-navy-900/10 dark:border-white/10 dark:bg-black">
          <div className="flex flex-col gap-5 p-6 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 text-5xl dark:bg-white/5">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                product.emoji
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <StoreLogo
                  src={product.store.logo}
                  name={product.store.name}
                  domain={product.store.domain}
                  className="h-4 w-4 rounded object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {product.store.name}
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-navy-900 dark:text-white">
                {product.title}
              </h3>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  {format(product.price, product.currency)}
                </span>
                <span className="text-xs text-slate-400">
                  ₹{product.priceINR.toLocaleString('en-IN')} in store
                </span>
              </div>

              {product.variants.map((v) => (
                <div key={v.label} className="mt-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {v.label}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {v.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setChosen((c) => ({ ...c, [v.label]: opt }))}
                        disabled={phase === 'added'}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          chosen[v.label] === opt
                            ? 'bg-navy-800 text-white dark:bg-tangerine-500'
                            : 'border border-navy-900/15 text-navy-800/70 hover:border-navy-400 dark:border-white/15 dark:text-white/70'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Qty</span>
                <div className="flex items-center gap-1.5 rounded-full border border-navy-900/15 px-1 py-0.5 dark:border-white/15">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={phase === 'added'}
                    className="rounded-full p-1.5 text-navy-600 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-navy-900 dark:text-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    disabled={phase === 'added'}
                    className="rounded-full p-1.5 text-navy-600 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-navy-900/10 bg-zinc-50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-cream-50 p-4 dark:bg-white/5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-tangerine-600">
                  What you pay
                </div>
                <dl className="mt-2 space-y-1 text-xs tabular-nums">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Item ×{qty}</dt>
                    <dd className="font-semibold text-navy-900 dark:text-white">
                      {format(cost.item, product.currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Proxy service fee</dt>
                    <dd className="font-semibold text-navy-900 dark:text-white">
                      {format(cost.serviceFee, product.currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Intl. shipping (est. by weight)</dt>
                    <dd className="font-semibold text-navy-900 dark:text-white">
                      {format(cost.shipping, product.currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Est. duties</dt>
                    <dd className="font-semibold text-navy-900 dark:text-white">
                      {format(cost.duties, product.currency)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                  Shipping is estimated from the expected weight. If the packed parcel weighs
                  less, we refund the difference to your Ducan wallet.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-navy-900/10 pt-3 dark:border-white/10">
              <div>
                <span className="text-xs text-slate-400">Estimated total</span>
                <div className="font-display text-3xl font-bold text-navy-900 dark:text-white">
                  <span>{format(cost.total, product.currency)}</span>
                </div>
              </div>
              {phase === 'added' ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-leaf-600 dark:text-leaf-400">
                    <CheckCircle2 className="h-5 w-5" /> Added to cart
                  </span>
                  <Link
                    to="/cart"
                    className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
                  >
                    View cart
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2.5 text-sm font-medium text-navy-800/70 transition hover:border-navy-400 dark:border-white/15 dark:text-white/70"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Add another
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void addToCart()}
                    disabled={adding}
                    className="flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf-500/30 transition hover:bg-leaf-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {adding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    {adding ? 'Adding…' : 'Add to Ducan cart'}
                  </button>
                  <button
                    type="button"
                    onClick={saveWishlist}
                    className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                      wishSaved
                        ? 'border-tangerine-400 bg-tangerine-50 text-tangerine-700 dark:bg-tangerine-500/15 dark:text-tangerine-300'
                        : 'border-navy-900/15 text-navy-800 hover:border-navy-400 dark:border-white/15 dark:text-white'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${wishSaved ? 'fill-tangerine-500 text-tangerine-500' : ''}`}
                    />
                    {wishSaved ? 'Saved' : 'Wishlist'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

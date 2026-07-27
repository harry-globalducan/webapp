import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import { useAuth } from './AuthContext'
import { useHomeData } from './HomeDataContext'

export interface CartItem {
  id: string
  title: string
  store: string
  priceUSD: number
  qty: number
  emoji: string
  /** Real product image from the scraper, when available. */
  imageUrl?: string
  url?: string
  variants?: Record<string, string>
  /** Server estimate of when this item reaches our India warehouse. */
  expectedDispatchDate?: string
  /** Server-side pricing status, e.g. NEW while the scraper is still running. */
  status?: string
}

interface CartContextValue {
  items: CartItem[]
  count: number
  /**
   * Set the quantity for a server cart item that capture has already created.
   * Adding the same product again tops up its quantity rather than creating a
   * second row.
   */
  addQuantity: (cartItemId: string, qty: number) => Promise<void>
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  loading: boolean
  refresh: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const PLACEHOLDER_EMOJI = '\u{1F4E6}'

/** Map a server cart item (GET /api/v1/orders/cart) into the UI shape. */
function fromApi(it: api.ApiCartItem, storeName: (id?: number) => string): CartItem {
  const pd = it.priceDetails
  const priceUSD =
    (pd?.paymentCurrency === 'USD' ? pd?.priceInPaymentCurrency : undefined) ??
    (pd?.userCurrency === 'USD' ? pd?.priceInUserCurrency : undefined) ??
    pd?.priceInPaymentCurrency ??
    0
  return {
    id: it.id,
    title: it.productTitle ?? 'Reading product…',
    store: storeName(it.storeId),
    priceUSD,
    qty: it.count ?? 1,
    emoji: PLACEHOLDER_EMOJI,
    imageUrl: it.imageUrl,
    url: it.productUrl,
    variants: it.variantInfo,
    expectedDispatchDate: it.expectedDispatchDate,
    status: it.status,
  }
}

/**
 * The cart lives on the server — capture adds items via POST /orders/cart, so
 * this reads the same source rather than keeping a separate local copy that
 * would drift out of sync.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)
  const { isAuthed } = useAuth()
  const { stores } = useHomeData()
  const storeName = useCallback(
    (id?: number) => stores.find((s) => s.apiId === id)?.name ?? '',
    [stores],
  )

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!isAuthed) {
      setItems([])
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .getCart()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return
        setItems(list.map((it) => fromApi(it, storeName)))
      })
      .catch(() => {
        /* surfaced by the page's error notice */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // storeName only relabels items; refetching when the store list loads is
    // unnecessary and would re-request the cart on every home-data update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, tick])

  const addQuantity: CartContextValue['addQuantity'] = async (cartItemId, qty) => {
    const next = Math.max(1, qty)
    setItems((prev) => prev.map((it) => (it.id === cartItemId ? { ...it, qty: next } : it)))
    await api.setCartItemCount(cartItemId, next)
    refresh()
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    api.removeCartItem(id).catch(() => refresh())
  }

  const setQty = (id: string, qty: number) => {
    const next = Math.max(1, qty)
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: next } : it)))
    api.setCartItemCount(id, next).catch(() => refresh())
  }

  const clear = () => {
    const ids = items.map((it) => it.id)
    setItems([])
    Promise.allSettled(ids.map((id) => api.removeCartItem(id))).then(() => refresh())
  }

  const count = items.reduce((sum, it) => sum + it.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, addQuantity, remove, setQty, clear, loading, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

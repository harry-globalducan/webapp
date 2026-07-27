import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import { useAuth } from './AuthContext'
import {
  seedOrders,
  shippingMethods,
  type Order,
  type OrderItem,
  type OrderStatus,
} from '../data/orders'

interface PlaceBuyInput {
  items: OrderItem[]
  itemTotalUSD: number
}

interface OrdersContextValue {
  orders: Order[]
  placeBuyRequest: (input: PlaceBuyInput) => Order
  selectShipping: (orderId: string, methodId: string) => void
  payShipping: (orderId: string) => void
  /** True when the list came from GET /api/v1/orders. */
  live: boolean
  loading: boolean
  refresh: () => void
}

/** Server OrderStatus → the status labels this UI renders. */
const STATUS_MAP: Record<string, OrderStatus> = {
  CREATED: 'Buying',
  PROCESSING: 'Buying',
  CONFIRMED: 'Buying',
  WAITING_FOR_ITEMS: 'Buying',
  PAYMENT_DUE: 'Buying',
  ITEMS_RECEIVED: 'At warehouse',
  AT_WAREHOUSE: 'At warehouse',
  QUALITY_CHECK: 'At warehouse',
  READY_TO_SHIP: 'Ready to ship',
  PACKED: 'Ready to ship',
  SHIPPED: 'In transit',
  IN_TRANSIT: 'In transit',
  OUT_FOR_DELIVERY: 'In transit',
  DELIVERED: 'Delivered',
  COMPLETED: 'Delivered',
}

function pickAmount(p?: api.PriceRef): number {
  if (!p) return 0
  return p.priceInUserCurrency ?? p.priceInBaseCurrency ?? p.priceInPaymentCurrency ?? 0
}

/** Map a server order (GET /api/v1/orders) into the shape this UI renders. */
function fromApi(o: api.ApiOrder): Order {
  const items = Array.isArray(o.items) ? (o.items as Record<string, unknown>[]) : []
  return {
    id: o.visualId || o.id,
    placed: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : todayLabel(),
    itemTotal: formatUSD(pickAmount(o.totalAmountDetails)),
    shipTo: '—',
    status: STATUS_MAP[String(o.status ?? '').toUpperCase()] ?? 'Buying',
    eta: '—',
    items: items.map((it) => ({
      emoji: '📦',
      title: String(it.productTitle ?? 'Item'),
      store: String((it.store as { name?: string } | undefined)?.name ?? ''),
      qty: Number(it.count ?? 1),
    })),
    freeStorageDays: 30,
  }
}

const OrdersContext = createContext<OrdersContextValue | null>(null)
const STORAGE_KEY = 'ducan-orders'

function load(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Order[]
  } catch {
    // ignore
  }
  return seedOrders
}

function formatUSD(n: number) {
  return `$${n.toFixed(2)}`
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(load)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)
  const { isAuthed } = useAuth()

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  // Signed-in users see their real orders; guests keep the local demo list.
  useEffect(() => {
    if (!isAuthed) {
      setLive(false)
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .getOrders()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return
        setOrders(list.map(fromApi))
        setLive(true)
      })
      .catch(() => {
        /* keep local orders */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isAuthed, tick])

  // Only persist the local (guest) list — server orders are the source of truth.
  useEffect(() => {
    if (live) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // memory only
    }
  }, [orders, live])

  const placeBuyRequest: OrdersContextValue['placeBuyRequest'] = ({ items, itemTotalUSD }) => {
    const order: Order = {
      id: `GD-${2800 + Math.floor(Math.random() * 700)}`,
      placed: todayLabel(),
      itemTotal: formatUSD(itemTotalUSD),
      shipTo: 'Natasha · Dubai, UAE',
      status: 'Buying',
      eta: 'Purchasing from Indian stores',
      items,
      freeStorageDays: 30,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const selectShipping: OrdersContextValue['selectShipping'] = (orderId, methodId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, shippingMethodId: methodId, status: 'Ready to ship' as OrderStatus, eta: 'Select Pay shipping to dispatch' }
          : o,
      ),
    )
  }

  const payShipping: OrdersContextValue['payShipping'] = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const method = shippingMethods.find((m) => m.id === o.shippingMethodId) ?? shippingMethods[0]
        return {
          ...o,
          shippingTotal: formatUSD(method.priceUSD),
          status: 'In transit' as OrderStatus,
          eta: `In transit · ${method.eta}`,
        }
      }),
    )
  }

  return (
    <OrdersContext.Provider
      value={{ orders, placeBuyRequest, selectShipping, payShipping, live, loading, refresh }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // memory only
    }
  }, [orders])

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
    <OrdersContext.Provider value={{ orders, placeBuyRequest, selectShipping, payShipping }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}

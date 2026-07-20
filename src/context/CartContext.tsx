import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  title: string
  store: string
  priceUSD: number
  qty: number
  emoji: string
  url?: string
  variants?: Record<string, string>
}

interface CartContextValue {
  items: CartItem[]
  count: number
  add: (item: Omit<CartItem, 'id'>) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'ducan-cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable (private mode) — cart lives in memory only
    }
  }, [items])

  const add: CartContextValue['add'] = (item) =>
    setItems((prev) => [
      ...prev,
      { ...item, id: `${Date.now()}-${prev.length}-${item.title.slice(0, 8)}` },
    ])

  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id))

  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)))

  const clear = () => setItems([])

  const count = items.reduce((sum, it) => sum + it.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

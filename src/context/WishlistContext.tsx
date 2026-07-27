import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface WishlistItem {
  id: string
  title: string
  store: string
  priceUSD: number
  emoji: string
  /** Real product image from the scraper, when available. */
  imageUrl?: string
  url?: string
  variants?: Record<string, string>
  savedAt: string
}

type WishlistInput = Omit<WishlistItem, 'id' | 'savedAt'>

interface WishlistContextValue {
  items: WishlistItem[]
  count: number
  add: (item: WishlistInput) => void
  remove: (id: string) => void
  toggle: (item: WishlistInput) => boolean
  has: (urlOrTitle: string) => boolean
  clear: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const STORAGE_KEY = 'ducan-wishlist'

function load(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  } catch {
    return []
  }
}

function matchKey(item: { url?: string; title: string }) {
  return (item.url?.trim() || item.title).toLowerCase()
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // memory only
    }
  }, [items])

  const has: WishlistContextValue['has'] = (urlOrTitle) => {
    const key = urlOrTitle.trim().toLowerCase()
    return items.some((it) => matchKey(it) === key)
  }

  const add: WishlistContextValue['add'] = (item) => {
    const key = matchKey(item)
    setItems((prev) => {
      if (prev.some((it) => matchKey(it) === key)) return prev
      return [
        {
          ...item,
          id: `wl-${Date.now()}-${prev.length}`,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ]
    })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id))

  const toggle: WishlistContextValue['toggle'] = (item) => {
    const key = matchKey(item)
    const existing = items.find((it) => matchKey(it) === key)
    if (existing) {
      remove(existing.id)
      return false
    }
    add(item)
    return true
  }

  const clear = () => setItems([])

  return (
    <WishlistContext.Provider
      value={{ items, count: items.length, add, remove, toggle, has, clear }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}

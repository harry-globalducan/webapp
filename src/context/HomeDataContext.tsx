import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import { setStoreRegistry, type Store, type StoreCategory } from '../data/stores'
import { useAuth } from './AuthContext'

/**
 * Live catalog data from the PUBLIC /api/v1/home/** endpoints.
 *
 * These calls intentionally omit the Bearer token so a stale session cannot
 * turn a public 200 into a 401 and leave the store rail empty.
 */

const CATEGORY_MAP: Record<string, StoreCategory> = {
  FASHION: 'Fashion',
  HEALTH_BEAUTY: 'Health & Beauty',
  ELECTRONICS: 'Electronics',
  HOME_KIDS: 'Home & Kids',
}

/** Derive a bare domain from the store URL so favicons keep working. */
function domainFromUrl(url: string, fallback: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return fallback
  }
}

function toStore(s: api.ApiStore): Store {
  return {
    apiId: s.id,
    name: s.name,
    domain: domainFromUrl(s.url ?? '', s.name.toLowerCase().replace(/\s+/g, '') + '.com'),
    category: CATEGORY_MAP[s.category ?? ''] ?? 'Electronics',
    preferred: s.preferred,
    logo: s.image || undefined,
    productRegex: s.productRegex,
  }
}

interface HomeDataValue {
  stores: Store[]
  serviceBanners: string[]
  banners: api.ApiBanner[]
  /** True once a live fetch succeeded — useful for debugging/badges. */
  live: boolean
  loading: boolean
  refresh: () => void
}

const HomeDataContext = createContext<HomeDataValue | null>(null)

export function HomeDataProvider({ children }: { children: ReactNode }) {
  // Restore last good catalog instantly, then refresh from the API.
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const raw = sessionStorage.getItem('ducan-stores')
      return raw ? (JSON.parse(raw) as Store[]) : []
    } catch {
      return []
    }
  })
  const [serviceBanners, setServiceBanners] = useState<string[]>([])
  const [banners, setBanners] = useState<api.ApiBanner[]>([])
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  const { isAuthed } = useAuth()

  useEffect(() => {
    if (stores.length) setStoreRegistry(stores)
    // Only seed registry once from session cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const load = async () => {
      const [storeRes, bannerRes, serviceRes] = await Promise.allSettled([
        api.getStores(),
        api.getBanners(undefined, isAuthed),
        api.getServiceBanners(),
      ])
      if (cancelled) return

      if (storeRes.status === 'fulfilled' && Array.isArray(storeRes.value)) {
        const mapped = storeRes.value.filter((s) => s.active !== false).map(toStore)
        setStores(mapped)
        setStoreRegistry(mapped)
        setLive(true)
        try {
          sessionStorage.setItem('ducan-stores', JSON.stringify(mapped))
        } catch {
          // ignore quota
        }
      }
      if (bannerRes.status === 'fulfilled' && Array.isArray(bannerRes.value)) {
        setBanners(bannerRes.value.filter((b) => b.active))
      }
      if (serviceRes.status === 'fulfilled' && Array.isArray(serviceRes.value)) {
        setServiceBanners(serviceRes.value.filter(Boolean))
      }
      setLoading(false)
    }

    load().catch(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [isAuthed, tick])

  return (
    <HomeDataContext.Provider
      value={{
        stores,
        serviceBanners,
        banners,
        live,
        loading,
        refresh: () => setTick((n) => n + 1),
      }}
    >
      {children}
    </HomeDataContext.Provider>
  )
}

export function useHomeData(): HomeDataValue {
  const ctx = useContext(HomeDataContext)
  // Safe default so components can render outside the provider (tests, etc.)
  if (!ctx) {
    return {
      stores: [],
      serviceBanners: [],
      banners: [],
      live: false,
      loading: false,
      refresh: () => {},
    }
  }
  return ctx
}

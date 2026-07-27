import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import { stores as staticStores, type Store, type StoreCategory } from '../data/stores'

/**
 * Live catalog data from the PUBLIC /api/v1/home/** endpoints.
 *
 * Everything degrades gracefully: if the API is unreachable (offline, backend
 * down, LAN-only host) we keep the bundled static data so the site still works.
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
  }
}

interface HomeDataValue {
  stores: Store[]
  serviceBanners: string[]
  banners: api.ApiBanner[]
  /** True once a live fetch succeeded — useful for debugging/badges. */
  live: boolean
  loading: boolean
}

const HomeDataContext = createContext<HomeDataValue | null>(null)

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(staticStores)
  const [serviceBanners, setServiceBanners] = useState<string[]>([])
  const [banners, setBanners] = useState<api.ApiBanner[]>([])
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const [storeRes, bannerRes, serviceRes] = await Promise.allSettled([
        api.getStores(),
        api.getBanners(),
        api.getServiceBanners(),
      ])
      if (cancelled) return

      if (storeRes.status === 'fulfilled' && Array.isArray(storeRes.value) && storeRes.value.length) {
        const mapped = storeRes.value.filter((s) => s.active !== false).map(toStore)
        if (mapped.length) {
          setStores(mapped)
          setLive(true)
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

    load().catch(() => setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <HomeDataContext.Provider value={{ stores, serviceBanners, banners, live, loading }}>
      {children}
    </HomeDataContext.Provider>
  )
}

export function useHomeData(): HomeDataValue {
  const ctx = useContext(HomeDataContext)
  // Safe default so components can render outside the provider (tests, etc.)
  if (!ctx) {
    return { stores: staticStores, serviceBanners: [], banners: [], live: false, loading: false }
  }
  return ctx
}

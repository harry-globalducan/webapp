import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as api from '../lib/api'
import { useAuth } from './AuthContext'

export interface DeliveryAddress {
  id: string
  label: string
  name: string
  city: string
  country: string
  lines: string[]
  phone: string
  isDefault: boolean
}

const STORAGE_KEY = 'ducan-addresses'

const defaults: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Natasha',
    city: 'Dubai Marina',
    country: 'United Arab Emirates',
    lines: ['Apartment 1204, Marina Heights', 'Dubai Marina', 'Dubai, United Arab Emirates'],
    phone: '+971 50 123 4567',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    name: 'Natasha',
    city: 'London',
    country: 'United Kingdom',
    lines: ['GeoFleet Ltd, 45 Finsbury Square', 'London EC2A 1HP', 'United Kingdom'],
    phone: '+44 7700 900123',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Family',
    name: 'Natasha',
    city: 'Malé',
    country: 'Maldives',
    lines: ['H. Seaside, Machchangolhi', 'Malé 20125', 'Maldives'],
    phone: '+960 777 1234',
    isDefault: false,
  },
]

function load(): DeliveryAddress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as DeliveryAddress[]
  } catch {
    // ignore
  }
  return defaults
}

/** Map a server address (GET /api/v1/users/address) into the UI shape. */
function fromApi(a: api.UserAddress, index: number): DeliveryAddress {
  const lines = [a.street1, a.street2, [a.city, a.state, a.zipCode].filter(Boolean).join(' ')]
    .filter((l): l is string => Boolean(l && l.trim()))
    .concat(a.country ? [a.country] : [])
  return {
    id: String(a.id),
    label: a.fullName || 'Address',
    name: a.fullName,
    city: a.city,
    country: a.country,
    lines,
    phone: a.phone,
    // The API has no "default" flag, so treat the first active address as default.
    isDefault: index === 0,
  }
}

interface AddressContextValue {
  addresses: DeliveryAddress[]
  active: DeliveryAddress | null
  setDefault: (id: string) => void
  remove: (id: string) => void
  /** True when the list came from the API rather than local storage. */
  live: boolean
  loading: boolean
  refresh: () => void
}

const AddressContext = createContext<AddressContextValue | null>(null)

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(load)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)
  const { isAuthed } = useAuth()

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  // Signed-in users get their real addresses; guests keep the local list.
  useEffect(() => {
    if (!isAuthed) {
      setLive(false)
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .getAddresses()
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return
        const active = list.filter((a) => a.active !== false)
        setAddresses(active.map(fromApi))
        setLive(true)
      })
      .catch(() => {
        /* keep local addresses */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isAuthed, tick])

  // Only persist the local (guest) list — server addresses are the source of truth.
  useEffect(() => {
    if (live) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
    } catch {
      // ignore
    }
  }, [addresses, live])

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }, [])

  const remove = useCallback(
    (id: string) => {
      // Remove server-side when signed in, then reconcile locally either way.
      if (live && /^\d+$/.test(id)) {
        api.deleteAddress(Number(id)).catch(() => {
          /* surfaced on next refresh */
        })
      }
      setAddresses((prev) => {
        const next = prev.filter((a) => a.id !== id)
        if (next.length && !next.some((a) => a.isDefault)) {
          next[0] = { ...next[0], isDefault: true }
        }
        return next
      })
    },
    [live],
  )

  const active = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses],
  )

  const value = useMemo(
    () => ({ addresses, active, setDefault, remove, live, loading, refresh }),
    [addresses, active, setDefault, remove, live, loading, refresh],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddresses(): AddressContextValue {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error('useAddresses must be used inside AddressProvider')
  return ctx
}

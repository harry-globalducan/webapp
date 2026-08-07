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
import { ApiError } from '../lib/api'
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

/** Legacy guest cache — cleared on sign-in so it can't masquerade as live data. */
const STORAGE_KEY = 'ducan-addresses'

function clearLocalCache() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
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
  /** Deletes on the server when signed in. Rejects with a message on failure. */
  remove: (id: string) => Promise<void>
  /** True when the list came from the API. */
  live: boolean
  loading: boolean
  /** Last list/delete error to surface in the UI. */
  error: string | null
  refresh: () => void
}

const AddressContext = createContext<AddressContextValue | null>(null)

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([])
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const { isAuthed } = useAuth()

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!isAuthed) {
      setAddresses([])
      setLive(false)
      setError(null)
      setLoading(false)
      return
    }

    // Signed-in users must never see leftover guest/localStorage addresses.
    clearLocalCache()

    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .getAddresses()
      .then((list) => {
        if (cancelled) return
        if (!Array.isArray(list)) {
          setAddresses([])
          setLive(true)
          return
        }
        const active = list.filter((a) => a.active !== false)
        setAddresses(active.map(fromApi))
        setLive(true)
      })
      .catch((err) => {
        if (cancelled) return
        setAddresses([])
        setLive(false)
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load your addresses. Please try again.',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isAuthed, tick])

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }, [])

  const remove = useCallback(
    async (id: string) => {
      if (!isAuthed || !/^\d+$/.test(id)) {
        throw new Error('Sign in to manage delivery addresses.')
      }
      try {
        await api.deleteAddress(Number(id))
        setAddresses((prev) => {
          const next = prev.filter((a) => a.id !== id)
          if (next.length && !next.some((a) => a.isDefault)) {
            next[0] = { ...next[0], isDefault: true }
          }
          return next
        })
        setError(null)
      } catch (err) {
        // Soft-delete fallback if DELETE isn't allowed.
        if (err instanceof ApiError && (err.status === 405 || err.status === 404)) {
          try {
            await api.updateAddress(Number(id), { active: false })
            setAddresses((prev) => prev.filter((a) => a.id !== id))
            setError(null)
            return
          } catch {
            /* fall through */
          }
        }
        const message =
          err instanceof ApiError ? err.message : 'Could not remove this address. Please try again.'
        setError(message)
        refresh()
        throw new Error(message)
      }
    },
    [isAuthed, refresh],
  )

  const active = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses],
  )

  const value = useMemo(
    () => ({ addresses, active, setDefault, remove, live, loading, error, refresh }),
    [addresses, active, setDefault, remove, live, loading, error, refresh],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddresses(): AddressContextValue {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error('useAddresses must be used inside AddressProvider')
  return ctx
}

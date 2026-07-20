import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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

interface AddressContextValue {
  addresses: DeliveryAddress[]
  active: DeliveryAddress | null
  setDefault: (id: string) => void
  remove: (id: string) => void
}

const AddressContext = createContext<AddressContextValue | null>(null)

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
    } catch {
      // ignore
    }
  }, [addresses])

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }, [])

  const remove = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id)
      if (next.length && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
  }, [])

  const active = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses],
  )

  const value = useMemo(
    () => ({ addresses, active, setDefault, remove }),
    [addresses, active, setDefault, remove],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddresses(): AddressContextValue {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error('useAddresses must be used inside AddressProvider')
  return ctx
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as api from '../lib/api'

/**
 * Currency selection + display formatting.
 *
 * Catalog prices in this app are stored in USD (`priceUSD`). This context
 * converts them for display and formats with the correct symbol/locale.
 *
 * The list of currencies comes from GET /api/v1/home/currencies when the API is
 * reachable, falling back to a built-in list. FX rates are indicative — swap
 * `FALLBACK_RATES` for a live rates endpoint when one is available.
 */

const STORAGE_KEY = 'ducan-currency'
const BASE: CurrencyCode = 'USD'

export type CurrencyCode = string

/**
 * Indicative USD → X rates, covering every code returned by
 * GET /api/v1/home/currencies. Replace with a live rates feed when available.
 */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  AED: 3.67,
  AMD: 385.0,
  ARS: 1010.0,
  AUD: 1.5,
  BHD: 0.376,
  BTN: 88.5,
  CAD: 1.36,
  CLP: 950.0,
  EUR: 0.92,
  FJD: 2.25,
  GBP: 0.79,
  INR: 88.5,
  KWD: 0.307,
  MMK: 2100.0,
  MUR: 46.5,
  MXN: 18.5,
  MYR: 4.2,
  MVR: 15.42,
  NPR: 141.6,
  NZD: 1.64,
  OMR: 0.385,
  RUB: 90.0,
  SAR: 3.75,
  SCR: 14.2,
  SGD: 1.29,
  // Extra codes kept for resilience if the API adds them later.
  QAR: 3.64,
  LKR: 300.0,
  BDT: 122.0,
  CHF: 0.87,
  JPY: 150.0,
  ZAR: 18.0,
}

const FALLBACK_CURRENCIES: { code: string; name: string }[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'MVR', name: 'Maldivian Rufiyaa' },
  { code: 'MUR', name: 'Mauritian Rupee' },
  { code: 'SCR', name: 'Seychellois Rupee' },
  { code: 'NPR', name: 'Nepalese Rupee' },
  { code: 'BTN', name: 'Bhutanese Ngultrum' },
  { code: 'LKR', name: 'Sri Lankan Rupee' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
]

/** Currencies conventionally shown without decimals. */
const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'IDR'])

interface CurrencyContextValue {
  /** Active display currency code, e.g. "AED". */
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  /** Currency codes available in the picker. */
  currencies: { code: string; name: string }[]
  /** Convert a USD amount into the active currency. */
  convert: (amountUSD: number) => number
  /** Convert + format a USD amount for display, e.g. "AED 352.00". */
  formatPrice: (amountUSD: number) => string
  /** Format an amount that is already in the given currency. */
  format: (amount: number, code?: CurrencyCode) => string
  /** True when the active currency is not the base (prices are estimates). */
  isConverted: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

function loadCurrency(): CurrencyCode {
  try {
    return localStorage.getItem(STORAGE_KEY) || BASE
  } catch {
    return BASE
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(loadCurrency)
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES)
  const [rates] = useState<Record<string, number>>(FALLBACK_RATES)

  // Pull the supported list from the API; keep the fallback if unreachable.
  useEffect(() => {
    let cancelled = false
    api
      .getSupportedCurrencies()
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return
        // Only offer currencies we can actually convert.
        const usable = list.filter((c) => FALLBACK_RATES[c.code] !== undefined)
        if (usable.length) setCurrencies(usable)
      })
      .catch(() => {
        /* offline or API down — keep fallback list */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* memory only */
    }
  }

  const value = useMemo<CurrencyContextValue>(() => {
    const rate = rates[currency] ?? 1

    const format = (amount: number, code: CurrencyCode = currency) => {
      const digits = ZERO_DECIMAL.has(code) ? 0 : 2
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: code,
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(amount)
      } catch {
        return `${code} ${amount.toFixed(digits)}`
      }
    }

    const convert = (amountUSD: number) => amountUSD * rate

    return {
      currency,
      setCurrency,
      currencies,
      convert,
      formatPrice: (amountUSD: number) => format(convert(amountUSD)),
      format,
      isConverted: currency !== BASE,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, currencies, rates])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}

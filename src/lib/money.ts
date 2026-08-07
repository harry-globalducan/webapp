import type { PriceRef } from './api'

export interface Money {
  amount: number
  currency: string
}

/** Coerce API price fields that may arrive as numbers or formatted strings. */
export function toAmount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

/**
 * Prefer the shopper-facing amount the server already converted.
 * Never treat a non-USD payment amount as USD for display conversion.
 */
export function pickMoney(p?: PriceRef | null): Money {
  if (!p) return { amount: 0, currency: 'USD' }

  if (p.priceInUserCurrency != null && p.userCurrency) {
    return { amount: toAmount(p.priceInUserCurrency), currency: p.userCurrency }
  }
  if (p.priceInPaymentCurrency != null && p.paymentCurrency) {
    return { amount: toAmount(p.priceInPaymentCurrency), currency: p.paymentCurrency }
  }
  if (p.priceInBaseCurrency != null && p.baseCurrency) {
    return { amount: toAmount(p.priceInBaseCurrency), currency: p.baseCurrency }
  }

  // Last resort — amount without a currency label (legacy / incomplete payloads).
  const amount =
    toAmount(p.priceInUserCurrency) ||
    toAmount(p.priceInPaymentCurrency) ||
    toAmount(p.priceInBaseCurrency)
  return { amount, currency: 'USD' }
}

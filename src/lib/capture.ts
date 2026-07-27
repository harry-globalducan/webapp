import { stores, type Store } from '../data/stores'
import * as api from './api'

export interface ProductVariant {
  label: string
  options: string[]
}

export interface ResolvedProduct {
  url: string
  store: Store
  /** Server cart-item id, present once the product has been added. */
  cartItemId?: string
  title: string
  /** Store price in its base currency (INR) — shown as "x in store". */
  priceINR: number
  /**
   * Price in USD as calculated by the server. The backend already applies the
   * live FX rate, so we never re-convert from INR ourselves.
   */
  priceUSD: number
  /** Real product image from the scraper, when available. */
  imageUrl?: string
  emoji: string
  variants: ProductVariant[]
  weightKg: number
}

/** Neutral stand-in shown only until the real product image loads. */
const PLACEHOLDER_EMOJI = '\u{1F4E6}'

export interface LandedCost {
  item: number
  /** Estimated international shipping, based on the item's tentative weight. */
  shipping: number
  serviceFee: number
  duties: number
  /** Everything above — charged as a single payment up front. */
  total: number
}

/** INR → currency conversion rates (mock; swap for a live FX feed later). */
export const FX_RATES: Record<string, { rate: number; symbol: string }> = {
  USD: { rate: 1 / 83.2, symbol: '$' },
  EUR: { rate: 1 / 90.1, symbol: '€' },
  GBP: { rate: 1 / 105.4, symbol: '£' },
  AED: { rate: 1 / 22.65, symbol: 'AED ' },
  CAD: { rate: 1 / 60.8, symbol: 'C$' },
  AUD: { rate: 1 / 54.6, symbol: 'A$' },
  SGD: { rate: 1 / 61.9, symbol: 'S$' },
}

export function inrTo(currency: string, amountINR: number): number {
  const fx = FX_RATES[currency] ?? FX_RATES.USD
  return amountINR * fx.rate
}

export function formatMoney(currency: string, amount: number): string {
  const fx = FX_RATES[currency] ?? FX_RATES.USD
  return `${fx.symbol}${amount.toFixed(2)}`
}

/** Match a pasted URL against the supported-store list. */
export function detectStore(raw: string): Store | null {
  let host: string
  try {
    host = new URL(raw.trim()).hostname.toLowerCase()
  } catch {
    return null
  }
  return (
    stores.find((s) => {
      const domain = s.domain.toLowerCase()
      return host === domain || host.endsWith(`.${domain}`)
    }) ?? null
  )
}

/** True when the text looks like a URL from a supported store. */
export function isSupportedProductUrl(text: string): boolean {
  return detectStore(text) !== null
}

/** Pull the first http(s) URL out of arbitrary shared text. */
export function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s"'<>]+/)
  return match ? match[0] : null
}


/** Map a priced cart item into the shape the capture UI renders. */
function toResolved(item: api.ApiCartItem, url: string, store: Store): ResolvedProduct {
  const pd = item.priceDetails
  // Trust the server's conversions rather than re-deriving them from INR.
  const priceUSD =
    (pd?.paymentCurrency === 'USD' ? pd?.priceInPaymentCurrency : undefined) ??
    (pd?.userCurrency === 'USD' ? pd?.priceInUserCurrency : undefined) ??
    pd?.priceInPaymentCurrency ??
    0
  return {
    url,
    store,
    cartItemId: item.id,
    title: item.productTitle ?? 'Product',
    priceINR: pd?.priceInBaseCurrency ?? 0,
    priceUSD,
    imageUrl: item.imageUrl,
    emoji: PLACEHOLDER_EMOJI,
    weightKg: 0.5,
    variants: [],
  }
}

/**
 * Resolve a product URL into displayable product data.
 *
 * There is no standalone preview endpoint: the backend scrapes a product when
 * it is added to the cart, so we POST the link and then read the created cart
 * item back. Scraping is asynchronous, so we poll briefly for the title.
 *
 * Requires a signed-in user — the cart endpoints are authenticated.
 */
export async function resolveProduct(url: string, storeApiId?: number): Promise<ResolvedProduct> {
  const store = detectStore(url)
  if (!store) {
    throw new Error('This link is not from a supported store yet.')
  }

  const storeId = storeApiId ?? store.apiId
  if (!storeId) {
    throw new Error('We could not identify that store. Please try another link.')
  }

  // Reuse an existing cart entry for this link rather than adding another —
  // resolving the same URL twice must not create duplicate cart items.
  const priced = (it: api.ApiCartItem) => Boolean(it.productTitle)
  const sameUrl = (it: api.ApiCartItem) => it.productUrl === url

  const existing = (await api.getCart()).filter(sameUrl)
  const alreadyPriced = existing.find(priced)
  if (alreadyPriced) return toResolved(alreadyPriced, url, store)

  // Only add when this link isn't in the cart at all; if it is there but still
  // being priced, fall through to polling.
  if (existing.length === 0) {
    await api.addCartItem({ storeId, productUrl: url, count: 1 })
  }

  // Pricing is asynchronous (status NEW → PRICED), so poll for the details.
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await new Promise((r) => setTimeout(r, 1200))
    const item = (await api.getCart()).filter(sameUrl).find(priced)
    if (item) return toResolved(item, url, store)
  }

  throw new Error(
    'We are still reading this product. Check your cart in a moment — it will appear there.',
  )
}

/** Landed-cost estimate in USD; format with the app's currency context. */
export function landedCost(product: ResolvedProduct, qty: number): LandedCost {
  const item = product.priceUSD * qty
  // Shipping is quoted from the tentative weight; the server recalculates it
  // from the actual weight once the parcel is packed.
  const shipping = Math.max(6, product.weightKg * qty * 11)
  const serviceFee = item * 0.07
  const duties = item * 0.1
  const total = item + serviceFee + shipping + duties
  return { item, shipping, serviceFee, duties, total }
}

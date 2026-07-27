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
  priceINR: number
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
  shipping: number
  serviceFee: number
  duties: number
  /** Item + proxy fee — paid now */
  itemPayment: number
  /** Intl shipping + duties — paid after warehouse */
  shipLater: number
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

  await api.addCartItem({ storeId, productUrl: url, count: 1 })

  // Poll the cart until the scraper fills in the product details.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const cart = await api.getCart()
    const item = cart.find((it) => it.productUrl === url)
    if (item?.productTitle) {
      const priceINR =
        item.priceDetails?.priceInBaseCurrency ?? item.priceDetails?.priceInUserCurrency ?? 0
      return {
        url,
        store,
        cartItemId: item.id,
        title: item.productTitle,
        priceINR,
        imageUrl: item.imageUrl,
        emoji: PLACEHOLDER_EMOJI,
        weightKg: 0.5,
        variants: [],
      }
    }
    await new Promise((r) => setTimeout(r, 1200))
  }

  throw new Error(
    'We are still reading this product. Check your cart in a moment — it will appear there.',
  )
}

/** Landed-cost estimate in the given currency. Mock rates, API-ready shape. */
export function landedCost(product: ResolvedProduct, qty: number, currency: string): LandedCost {
  const item = inrTo(currency, product.priceINR) * qty
  const shipping = Math.max(6, product.weightKg * qty * 11) * (FX_RATES[currency]?.rate ?? 1) * 83.2
  const serviceFee = item * 0.07
  const duties = item * 0.1
  const itemPayment = item + serviceFee
  const shipLater = shipping + duties
  const total = itemPayment + shipLater
  return { item, shipping, serviceFee, duties, itemPayment, shipLater, total }
}

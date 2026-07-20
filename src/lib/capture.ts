import { stores, type Store } from '../data/stores'

export interface ProductVariant {
  label: string
  options: string[]
}

export interface ResolvedProduct {
  url: string
  store: Store
  title: string
  priceINR: number
  emoji: string
  variants: ProductVariant[]
  weightKg: number
}

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

// Mock catalog: one representative product per store so the resolved card
// feels real. Replaced by a server-side resolver when the API exists.
const SAMPLE_PRODUCTS: Record<string, Omit<ResolvedProduct, 'url' | 'store'>> = {
  'amazon.in': {
    title: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
    priceINR: 4499, emoji: '🔊', weightKg: 0.5,
    variants: [{ label: 'Colour', options: ['Black', 'White', 'Blue'] }],
  },
  'banarasithreads.com': {
    title: 'Banarasi Silk Saree — Royal Blue with Gold Zari',
    priceINR: 6999, emoji: '🥻', weightKg: 0.8,
    variants: [{ label: 'Blouse piece', options: ['Included', 'Without'] }],
  },
  'flipkart.com': {
    title: 'Noise ColorFit Pro 4 Smartwatch',
    priceINR: 2999, emoji: '⌚', weightKg: 0.3,
    variants: [{ label: 'Strap', options: ['Black', 'Teal', 'Rose'] }],
  },
  'nykaa.com': {
    title: 'Lakmé Absolute Skin Dew Serum Foundation',
    priceINR: 850, emoji: '💄', weightKg: 0.2,
    variants: [{ label: 'Shade', options: ['Ivory', 'Beige', 'Honey'] }],
  },
  'jockey.in': {
    title: 'Jockey Cotton Crew Neck T-Shirt (Pack of 2)',
    priceINR: 1099, emoji: '👕', weightKg: 0.4,
    variants: [
      { label: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { label: 'Colour', options: ['Navy', 'Grey', 'White'] },
    ],
  },
  'bombayshavingcompany.com': {
    title: 'Precision Safety Razor Shaving Kit',
    priceINR: 1745, emoji: '🪒', weightKg: 0.45,
    variants: [],
  },
  'myntra.com': {
    title: 'Roadster Men Slim Fit Denim Jacket',
    priceINR: 1889, emoji: '🧥', weightKg: 0.9,
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
  },
  'boat-lifestyle.com': {
    title: 'boAt Airdopes 141 ANC True Wireless Earbuds',
    priceINR: 1799, emoji: '🎧', weightKg: 0.25,
    variants: [{ label: 'Colour', options: ['Bold Black', 'Pearl White'] }],
  },
  'nykaafashion.com': {
    title: 'Anarkali Embroidered Kurta Set — Emerald',
    priceINR: 3450, emoji: '👗', weightKg: 0.7,
    variants: [{ label: 'Size', options: ['XS', 'S', 'M', 'L'] }],
  },
  'bblunt.com': {
    title: 'BBlunt Salon Secret High Shine Hair Colour',
    priceINR: 350, emoji: '💇', weightKg: 0.3,
    variants: [{ label: 'Shade', options: ['Natural Black', 'Coffee', 'Wine'] }],
  },
  'thedermaco.com': {
    title: 'The Derma Co 1% Hyaluronic Sunscreen SPF 50',
    priceINR: 499, emoji: '🧴', weightKg: 0.15,
    variants: [],
  },
  'drsheths.com': {
    title: "Dr. Sheth's Ceramide & Vitamin C Moisturiser",
    priceINR: 449, emoji: '🧴', weightKg: 0.15,
    variants: [],
  },
  'aqualogica.in': {
    title: 'Aqualogica Glow+ Dewy Sunscreen SPF 50 PA++++',
    priceINR: 399, emoji: '☀️', weightKg: 0.15,
    variants: [],
  },
  'staze9to9.com': {
    title: 'Staze Oversized Graphic Streetwear Tee',
    priceINR: 799, emoji: '👕', weightKg: 0.35,
    variants: [{ label: 'Size', options: ['M', 'L', 'XL'] }],
  },
  'firstcry.com': {
    title: 'Babyhug Cotton Romper Set (Pack of 3)',
    priceINR: 999, emoji: '👶', weightKg: 0.4,
    variants: [{ label: 'Age', options: ['0-3m', '3-6m', '6-12m'] }],
  },
  'bombae.in': {
    title: 'Bombae Face & Body Razor Kit for Women',
    priceINR: 545, emoji: '🪒', weightKg: 0.2,
    variants: [],
  },
  'ikea.com': {
    title: 'IKEA FADO Table Lamp — White Glass',
    priceINR: 1990, emoji: '💡', weightKg: 1.2,
    variants: [],
  },
}

/**
 * Resolve a product URL into displayable product data.
 * Mock implementation: matches the store and returns a sample product after a
 * short delay. The real version calls the Ducan resolver API with the same
 * signature, so callers never change.
 */
export async function resolveProduct(url: string): Promise<ResolvedProduct> {
  const store = detectStore(url)
  if (!store) {
    throw new Error('This link is not from a supported store yet.')
  }
  await new Promise((r) => setTimeout(r, 900))
  const sample = SAMPLE_PRODUCTS[store.domain]
  if (!sample) {
    throw new Error('We could not read this product. Try another link.')
  }
  return { url, store, ...sample }
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

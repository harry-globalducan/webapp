export type BannerTone = 'navy' | 'tangerine' | 'leaf'
export type BannerPlacement = 'home' | 'home-stores' | 'coupons' | 'cart'
export type BannerVisual = 'default' | 'beauty' | 'image'

export interface PromoBanner {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  to: string
  tone: BannerTone
  badge?: string
  placement: BannerPlacement
  /** Optional richer artwork treatment for the slide. Defaults to 'default'. */
  visual?: BannerVisual
  /** Full-bleed artwork URL, used when `visual` is 'image' (API banners). */
  imageUrl?: string
  /** Partner brands surfaced as an elegant inline row (used by richer visuals). */
  accentStores?: string[]
}

export const banners: PromoBanner[] = [
  {
    id: 'welcome15',
    eyebrow: 'New customers',
    title: '15% off your first order',
    subtitle: 'Use WELCOME15 at checkout — up to $25 off the item subtotal.',
    ctaLabel: 'View coupons',
    to: '/coupons',
    tone: 'tangerine',
    badge: '15% OFF',
    placement: 'home',
  },
  {
    id: 'freeship',
    eyebrow: 'Limited offer',
    title: 'Free shipping over $50',
    subtitle: 'International shipping waived on consolidated parcels with FREESHIP50.',
    ctaLabel: 'Shop stores',
    to: '/#stores',
    tone: 'navy',
    badge: 'FREE SHIP',
    placement: 'home',
  },
  {
    id: 'beauty',
    eyebrow: 'The Ducan Beauty Edit',
    title: '10% off Nykaa & skincare',
    subtitle: 'Apply BEAUTY10 for 10% off dewy sunscreens, serums and moisturisers from India’s cult skincare labels.',
    ctaLabel: 'Browse beauty',
    to: '/#stores',
    tone: 'leaf',
    badge: 'BEAUTY10',
    placement: 'home',
    visual: 'beauty',
    accentStores: ['Nykaa', 'The Derma Co', 'Aqualogica', "Dr. Sheth's"],
  },
  {
    id: 'wallet-fund',
    eyebrow: 'Wallet',
    title: 'Fund once, shop every store',
    subtitle: 'Add funds via bank transfer — one balance covers many Indian store orders.',
    ctaLabel: 'Open wallet',
    to: '/wallet',
    tone: 'navy',
    badge: 'SWIFT',
    placement: 'home',
  },
  {
    id: 'stores-fashion',
    eyebrow: 'Shop the real sites',
    title: 'Fashion on Myntra, Nykaa Fashion & more',
    subtitle: 'Open the store, then Buy with Ducan via Chrome extension or paste the link.',
    ctaLabel: 'Ways to shop',
    to: '/ways-to-shop',
    tone: 'tangerine',
    badge: 'EXTENSION',
    placement: 'home-stores',
  },
  {
    id: 'coupons-summer',
    eyebrow: 'Active offer',
    title: 'Grab WELCOME15 before it expires',
    subtitle: '15% off your first order — stack it with store discounts at checkout.',
    ctaLabel: 'Copy codes below',
    to: '/coupons',
    tone: 'tangerine',
    badge: 'WELCOME15',
    placement: 'coupons',
  },
  {
    id: 'cart-freeship',
    eyebrow: 'Checkout tip',
    title: 'Free shipping over $50',
    subtitle: 'Add FREESHIP50 at checkout when your consolidated parcel clears $50.',
    ctaLabel: 'See coupons',
    to: '/coupons',
    tone: 'navy',
    badge: 'FREESHIP50',
    placement: 'cart',
  },
]

export function bannersFor(placement: BannerPlacement): PromoBanner[] {
  return banners.filter((b) => b.placement === placement)
}

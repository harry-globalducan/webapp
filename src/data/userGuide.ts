/**
 * New Users' Guide content — a Doorzo-style novice strategy, adapted for
 * Global Ducan's India proxy-shopping flow. Icons are lucide-react names,
 * resolved to components in the page.
 */

export interface GuideStep {
  id: number
  icon: string
  title: string
  summary: string
  details: string[]
  /** Optional in-context link. */
  link?: { label: string; to: string }
}

export const guideSteps: GuideStep[] = [
  {
    id: 1,
    icon: 'UserPlus',
    title: 'Create your account & fund your wallet',
    summary:
      'Sign up in under a minute, then top up your Ducan wallet so we can pay Indian stores the moment you order.',
    details: [
      'Register with email or phone — no Indian card or address needed.',
      'Add funds via card, bank transfer or UPI; your balance shows in your local currency.',
      'Wallet balance covers item fees now and shipping later, so checkout is one tap.',
    ],
    link: { label: 'Open your wallet', to: '/wallet' },
  },
  {
    id: 2,
    icon: 'Store',
    title: 'Shop real Indian stores',
    summary:
      'Browse Amazon.in, Myntra, Nykaa, Ajio and more exactly as a local would — add items via our Chrome extension or by pasting the product link.',
    details: [
      'Use the "Buy with Ducan" Chrome extension right on the store page for a live landed-cost estimate.',
      'On mobile, use the share sheet or simply paste any product URL into the capture page.',
      'Pick the exact size, colour and variant on the real store before sending it to Ducan.',
    ],
    link: { label: 'See all ways to shop', to: '/ways-to-shop' },
  },
  {
    id: 3,
    icon: 'CreditCard',
    title: 'Pay the item fee (step one)',
    summary:
      'Confirm your cart and pay the first invoice: product price plus a transparent proxy service fee. We buy on your behalf immediately.',
    details: [
      'The item fee = product price + proxy service fee, shown clearly before you confirm.',
      'This is separate from international shipping, which you pay later by real weight.',
      'Store discounts, coupons and cashback are passed on to you where available.',
    ],
    link: { label: 'Capture a product', to: '/capture' },
  },
  {
    id: 4,
    icon: 'Warehouse',
    title: 'Items arrive at our India warehouse',
    summary:
      'Your orders land at our India hub, where we inspect and photograph every item so you know exactly what you got.',
    details: [
      'We receive from all your stores and log each parcel to your account.',
      'Photo QC catches wrong sizes, colours or damage before anything ships abroad.',
      'Enjoy up to 30 days of free storage while you gather more items.',
    ],
    link: { label: 'Track in your orders', to: '/orders' },
  },
  {
    id: 5,
    icon: 'PackageCheck',
    title: 'Consolidate & pay shipping (step two)',
    summary:
      'Combine multiple stores into one parcel, choose your courier, and pay international postage based on actual weight — never a guess.',
    details: [
      'Consolidation merges many orders into one box to cut per-parcel shipping cost.',
      'You see real (or volumetric) weight and a firm quote before paying the second invoice.',
      'Apply FREESHIP50 on eligible $50+ parcels to save on standard postage.',
    ],
    link: { label: 'See fees & restrictions', to: '/shipping' },
  },
  {
    id: 6,
    icon: 'Home',
    title: 'Delivered to your door',
    summary:
      'We dispatch from India and deliver to your address — DDP (duties paid) on supported routes, so there are no surprises.',
    details: [
      'DDP delivery to UAE, Saudi, Maldives and Mauritius means duties are settled up front.',
      'Track every leg from India dispatch to final-mile delivery in your account.',
      'Manage saved delivery addresses for faster future checkouts.',
    ],
    link: { label: 'Manage addresses', to: '/addresses' },
  },
]

export interface GuideTip {
  icon: string
  title: string
  text: string
}

export const guideTips: GuideTip[] = [
  {
    icon: 'Layers',
    title: 'Consolidate to save',
    text: 'Wait until you have a few items, then ship them together. One heavier parcel almost always beats several small ones.',
  },
  {
    icon: 'Camera',
    title: 'Check your QC photos',
    text: 'Review warehouse photos before consolidating. If a size or colour is wrong, sort it out with the store while it is still in India.',
  },
  {
    icon: 'Wallet',
    title: 'Pre-fund your wallet',
    text: 'Keep a small balance topped up so we can buy flash-sale and limited-stock items the instant you order.',
  },
  {
    icon: 'Scale',
    title: 'Mind the weight tiers',
    text: 'A little over a tier boundary bumps the rate. Bundling can nudge you into a cheaper per-kg band on big hauls.',
  },
]

export interface GuideMistake {
  wrong: string
  right: string
}

export const commonMistakes: GuideMistake[] = [
  {
    wrong: 'Ordering restricted items like perfumes, power banks or aerosols.',
    right: 'Check the restrictions list first — flammables and loose batteries cannot fly.',
  },
  {
    wrong: 'Shipping each order separately as it arrives.',
    right: 'Let items pool at the warehouse, then consolidate into one parcel.',
  },
  {
    wrong: 'Picking the wrong size or variant on the store page.',
    right: 'Confirm size, colour and variant on the real store before sending to Ducan.',
  },
  {
    wrong: 'Expecting the item fee to include international shipping.',
    right: 'Remember it is two steps: item fee first, real-weight postage second.',
  },
]

export const guideFaqLink = { label: 'Still have questions? Contact support', to: '/support' }

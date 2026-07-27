/**
 * Content for the Shipping fees & restrictions page.
 * Rates are indicative estimates in USD for a single parcel dispatched from our
 * India warehouse. Final postage is quoted on the second-step shipping invoice
 * once your consolidated parcel is weighed and measured.
 */

export const FREE_SHIP_CODE = 'FREESHIP50'

export const freeShippingNote =
  'Spend $50 or more on a single consolidated parcel and apply code ' +
  `${FREE_SHIP_CODE} to knock $8 off international postage. Applies to the ` +
  'shipping invoice (second step), not the item fee, and to standard courier only.'

/** Destinations we quote for, in the order shown on the page. */
export interface Destination {
  id: string
  country: string
  flag: string
  /** Typical door-to-door transit once dispatched from India. */
  transit: string
  ddp: boolean
  note: string
}

export const destinations: Destination[] = [
  {
    id: 'uae',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    transit: '3–6 days',
    ddp: true,
    note: 'Fastest lane. Delivered duty paid (DDP) to Dubai, Abu Dhabi, Sharjah and all emirates — no charges at your door.',
  },
  {
    id: 'saudi',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    transit: '4–8 days',
    ddp: true,
    note: 'DDP to major cities. SABER/SFDA-regulated goods (some electronics, cosmetics) may need extra lead time.',
  },
  {
    id: 'maldives',
    country: 'Maldives',
    flag: '🇲🇻',
    transit: '5–9 days',
    ddp: true,
    note: 'DDP to Malé. Island-hop delivery to resorts and atolls adds 1–3 days via domestic ferry/air.',
  },
  {
    id: 'mauritius',
    country: 'Mauritius',
    flag: '🇲🇺',
    transit: '6–11 days',
    ddp: true,
    note: 'DDP island-wide. High-value electronics above local thresholds may attract VAT collected at checkout.',
  },
  {
    id: 'seychelles',
    country: 'Seychelles',
    flag: '🇸🇨',
    transit: '7–12 days',
    ddp: false,
    note: 'Duty is estimated before dispatch; a small local handling fee may apply on collection at Mahé.',
  },
  {
    id: 'nepal',
    country: 'Nepal',
    flag: '🇳🇵',
    transit: '5–9 days',
    ddp: false,
    note: 'Overland + air options. Duty and local VAT are estimated up front and settled on delivery in Kathmandu.',
  },
  {
    id: 'bhutan',
    country: 'Bhutan',
    flag: '🇧🇹',
    transit: '6–10 days',
    ddp: false,
    note: 'Delivered via Phuentsholing/Thimphu. Green-tax and duty are estimated before you pay shipping.',
  },
]

/** Weight tiers with indicative USD postage to the four headline markets. */
export interface WeightTier {
  id: string
  label: string
  /** Upper bound in kg for sorting/quotes; null = open-ended. */
  maxKg: number | null
  rates: {
    uae: number
    maldives: number
    mauritius: number
    saudi: number
  }
}

export const weightTiers: WeightTier[] = [
  { id: 't1', label: '0 – 0.5 kg', maxKg: 0.5, rates: { uae: 9, maldives: 12, mauritius: 15, saudi: 11 } },
  { id: 't2', label: '0.5 – 1 kg', maxKg: 1, rates: { uae: 14, maldives: 18, mauritius: 23, saudi: 17 } },
  { id: 't3', label: '1 – 2 kg', maxKg: 2, rates: { uae: 22, maldives: 29, mauritius: 37, saudi: 27 } },
  { id: 't4', label: '2 – 5 kg', maxKg: 5, rates: { uae: 41, maldives: 55, mauritius: 69, saudi: 50 } },
  { id: 't5', label: '5 – 10 kg', maxKg: 10, rates: { uae: 74, maldives: 98, mauritius: 121, saudi: 89 } },
  { id: 't6', label: '10 kg +', maxKg: null, rates: { uae: 7.2, maldives: 9.4, mauritius: 11.5, saudi: 8.6 } },
]

/** Footnote for the 10kg+ row, where rates are per-kg rather than flat. */
export const perKgNote =
  'The 10 kg+ tier is billed per additional kilogram (USD/kg) on top of the 5–10 kg rate. ' +
  'Volumetric weight (L×W×H in cm ÷ 5000) applies when it exceeds actual weight.'

/** Hard limits per single parcel dispatched from the India warehouse. */
export interface ParcelLimit {
  id: string
  label: string
  value: string
  detail: string
}

export const parcelLimits: ParcelLimit[] = [
  {
    id: 'weight',
    label: 'Max weight per parcel',
    value: '30 kg',
    detail: 'Heavier orders are split across multiple parcels automatically, each quoted separately.',
  },
  {
    id: 'longest',
    label: 'Longest single side',
    value: '120 cm',
    detail: 'Oversized items (furniture, large appliances) need a manual freight quote from support.',
  },
  {
    id: 'girth',
    label: 'Length + girth',
    value: '≤ 300 cm',
    detail: 'Girth = 2 × (width + height). Bulky-but-light parcels are charged on volumetric weight.',
  },
  {
    id: 'value',
    label: 'Declared value',
    value: 'up to $2,500',
    detail: 'Parcels above this may require additional customs paperwork depending on destination.',
  },
]

/** Prohibited / restricted categories for India → international proxy shipping. */
export interface RestrictionGroup {
  id: string
  title: string
  /** 'prohibited' = never shippable, 'restricted' = conditional limits. */
  level: 'prohibited' | 'restricted'
  items: string[]
}

export const restrictions: RestrictionGroup[] = [
  {
    id: 'batteries',
    title: 'Batteries & power banks',
    level: 'restricted',
    items: [
      'Loose lithium batteries and power banks cannot ship by air.',
      'Devices with built-in batteries (phones, laptops, earbuds) are fine, subject to courier limits.',
      'Power banks above 100Wh are not accepted on any lane.',
    ],
  },
  {
    id: 'liquids',
    title: 'Liquids, gels & aerosols',
    level: 'restricted',
    items: [
      'Perfumes, nail polish and aerosols are hazardous — most air lanes refuse them.',
      'Non-flammable cosmetics/serums allowed up to 500 ml total per parcel on supported routes.',
      'Alcohol-based sanitizers and sprays are not accepted.',
    ],
  },
  {
    id: 'flammable',
    title: 'Flammables & hazardous goods',
    level: 'prohibited',
    items: [
      'Lighters, matches, fireworks and camping fuel.',
      'Paints, solvents, adhesives and pressurized cylinders.',
      'Magnets, corrosives and any dangerous goods (DG-classified) items.',
    ],
  },
  {
    id: 'food',
    title: 'Food, plants & perishables',
    level: 'restricted',
    items: [
      'Sealed dry packaged foods and spices allowed to most markets (check destination limits).',
      'Perishable, fresh, homemade or meat/dairy products are not accepted.',
      'Seeds, plants and Ayurvedic items may need import permits — check destination rules.',
    ],
  },
  {
    id: 'counterfeit',
    title: 'Counterfeit & restricted brands',
    level: 'prohibited',
    items: [
      'Replica, first-copy or counterfeit branded goods of any kind.',
      'Products that infringe trademarks or copyrights.',
      'Currency, stamps and unauthorized resale of licensed media.',
    ],
  },
  {
    id: 'regulated',
    title: 'Regulated & sensitive items',
    level: 'prohibited',
    items: [
      'Weapons, ammunition, and replica/airsoft firearms.',
      'Prescription drugs, medical narcotics and CBD/cannabis products.',
      'Precious metals, loose gemstones, live animals and human remains.',
    ],
  },
]

/** Short reassurance points shown near the fee table. */
export const feeHighlights = [
  'Shipping is quoted from the item weight up front — if the packed parcel is lighter, we refund the difference.',
  'Consolidate multiple stores into one parcel to save on international shipping.',
  '30 days of free storage at our India warehouse while you gather your haul.',
  'Photo QC on every item before it leaves India — no blind shipping.',
]

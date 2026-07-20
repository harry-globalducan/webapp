export type OrderStatus =
  | 'Buying'
  | 'At warehouse'
  | 'Ready to ship'
  | 'In transit'
  | 'Delivered'

export interface OrderItem {
  emoji: string
  title: string
  store: string
  qty: number
}

export interface ShippingMethod {
  id: string
  label: string
  eta: string
  priceUSD: number
}

export interface Order {
  id: string
  placed: string
  /** Item payment already charged (product + proxy fee) */
  itemTotal: string
  /** Intl shipping — set after warehouse / pay shipping */
  shippingTotal?: string
  shipTo: string
  status: OrderStatus
  eta: string
  items: OrderItem[]
  /** Estimated weight at warehouse (kg) */
  weightKg?: number
  shippingMethodId?: string
  freeStorageDays: number
}

export const shippingMethods: ShippingMethod[] = [
  { id: 'ems', label: 'India Post EMS', eta: '5–9 days', priceUSD: 28.5 },
  { id: 'dhl', label: 'DHL Express', eta: '3–5 days', priceUSD: 42.0 },
  { id: 'air', label: 'Air Parcel', eta: '8–14 days', priceUSD: 18.0 },
]

export const orderStatusSteps: OrderStatus[] = [
  'Buying',
  'At warehouse',
  'Ready to ship',
  'In transit',
  'Delivered',
]

export const seedOrders: Order[] = [
  {
    id: 'GD-2841',
    placed: 'July 12, 2026',
    itemTotal: '$98.40',
    shippingTotal: '$28.50',
    shipTo: 'Natasha · Dubai, UAE',
    status: 'In transit',
    eta: 'Arriving July 21',
    weightKg: 1.4,
    shippingMethodId: 'ems',
    freeStorageDays: 30,
    items: [
      { emoji: '🥻', title: 'Banarasi Silk Saree — Royal Blue with Gold Zari', store: 'Banarasi Threads', qty: 1 },
      { emoji: '🧴', title: 'Aqualogica Glow+ Dewy Sunscreen SPF 50', store: 'Aqualogica', qty: 2 },
    ],
  },
  {
    id: 'GD-2779',
    placed: 'June 30, 2026',
    itemTotal: '$43.00',
    shippingTotal: '$18.00',
    shipTo: 'Natasha · Dubai, UAE',
    status: 'Delivered',
    eta: 'Delivered July 8',
    weightKg: 0.6,
    shippingMethodId: 'air',
    freeStorageDays: 30,
    items: [{ emoji: '🎧', title: 'boAt Airdopes 141 ANC True Wireless Earbuds', store: 'boAt', qty: 2 }],
  },
  {
    id: 'GD-2712',
    placed: 'June 18, 2026',
    itemTotal: '$12.40',
    shipTo: 'Natasha · Dubai, UAE',
    status: 'Buying',
    eta: 'Purchasing from store',
    freeStorageDays: 30,
    items: [{ emoji: '🧴', title: 'The Derma Co 1% Hyaluronic Sunscreen SPF 50', store: 'The Derma Co', qty: 1 }],
  },
  {
    id: 'GD-2690',
    placed: 'June 10, 2026',
    itemTotal: '$67.20',
    shipTo: 'Natasha · Dubai, UAE',
    status: 'At warehouse',
    eta: 'Ready to consolidate — free storage 22 days left',
    weightKg: 2.1,
    freeStorageDays: 30,
    items: [
      { emoji: '🔊', title: 'Echo Dot (5th Gen) Smart Speaker with Alexa', store: 'Amazon', qty: 1 },
      { emoji: '👕', title: 'Jockey Soft Cotton Crew Neck T-Shirt', store: 'Jockey', qty: 2 },
    ],
  },
]

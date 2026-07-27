export type StoreCategory = 'Fashion' | 'Health & Beauty' | 'Electronics' | 'Home & Kids'

export interface Store {
  name: string
  domain: string
  category: StoreCategory
  preferred?: boolean
  /** Absolute logo URL from the API; falls back to a favicon when absent. */
  logo?: string
  /** Marketing line for featured (preferred) store cards */
  offer?: string
  /** Typical door-to-door delivery estimate */
  delivery?: string
}

export const stores: Store[] = [
  {
    name: 'Amazon', domain: 'amazon.in', category: 'Electronics', preferred: true,
    offer: 'Electronics, books & everything else — millions of products',
    delivery: '6–10 days',
  },
  {
    name: 'Banarasi Threads', domain: 'banarasithreads.com', category: 'Fashion', preferred: true,
    offer: 'Handwoven silk sarees direct from Varanasi looms',
    delivery: '8–12 days',
  },
  { name: 'Flipkart', domain: 'flipkart.com', category: 'Electronics', delivery: '6–10 days' },
  { name: 'Nykaa', domain: 'nykaa.com', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'Jockey', domain: 'jockey.in', category: 'Fashion', delivery: '8–12 days' },
  { name: 'Bombay Shaving', domain: 'bombayshavingcompany.com', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'Myntra', domain: 'myntra.com', category: 'Fashion', delivery: '8–12 days' },
  { name: 'boAt', domain: 'boat-lifestyle.com', category: 'Electronics', delivery: '6–10 days' },
  { name: 'Nykaa Fashion', domain: 'nykaafashion.com', category: 'Fashion', delivery: '8–12 days' },
  { name: 'BBlunt', domain: 'bblunt.com', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'The Derma Co', domain: 'thedermaco.com', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: "Dr. Sheth's", domain: 'drsheths.com', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'Aqualogica', domain: 'aqualogica.in', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'Staze 9To9', domain: 'staze9to9.com', category: 'Fashion', delivery: '8–12 days' },
  { name: 'First Cry', domain: 'firstcry.com', category: 'Home & Kids', delivery: '9–14 days' },
  { name: 'Bombae', domain: 'bombae.in', category: 'Health & Beauty', delivery: '7–10 days' },
  { name: 'Ikea', domain: 'ikea.com', category: 'Home & Kids', delivery: '9–14 days' },
]

export const categories = ['All', 'Fashion', 'Health & Beauty', 'Electronics', 'Home & Kids'] as const

export const currencies = ['USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'SGD'] as const

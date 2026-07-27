/**
 * Store types and a small live registry.
 *
 * There is no bundled store list — names, logos, categories and the URL
 * patterns used to recognise a product link all come from
 * GET /api/v1/home/stores. `HomeDataContext` publishes the fetched list here so
 * non-React helpers such as `detectStore` can read it too.
 */

export type StoreCategory = 'Fashion' | 'Health & Beauty' | 'Electronics' | 'Home & Kids'

export interface Store {
  /** Server-side store id, required when adding items to the cart. */
  apiId?: number
  name: string
  domain: string
  category: StoreCategory
  preferred?: boolean
  /** Logo URL served by the API. */
  logo?: string
  /** Patterns that identify a product page on this store. */
  productRegex?: string[]
  /** Marketing line for featured (preferred) store cards */
  offer?: string
  /** Typical door-to-door delivery estimate */
  delivery?: string
}

export const categories = ['All', 'Fashion', 'Health & Beauty', 'Electronics', 'Home & Kids'] as const

/** Most recent list fetched from the API. */
let registry: Store[] = []

export function setStoreRegistry(next: Store[]) {
  registry = next
}

export function getStoreRegistry(): Store[] {
  return registry
}

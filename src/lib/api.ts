/**
 * Thin REST client for the Global Ducan backend.
 *
 * Base URL resolution:
 *
 * - **Development** — always calls same-origin `/api/v1/*`; the Vite dev server
 *   proxies that to `VITE_API_BASE` (see vite.config.ts). This avoids CORS and
 *   mixed-content issues against a plain-HTTP LAN backend.
 *
 * - **Production** (Vercel et al.) — there is no dev proxy, so:
 *     • If `VITE_API_BASE` is set at build time, requests go directly to that
 *       absolute origin, e.g. `https://api.globalducan.com/api/v1/auth/signin`.
 *     • If it is NOT set, requests stay relative (`/api/v1/...`) so they can be
 *       forwarded by a same-origin rewrite — see `vercel.json`.
 *
 * ⚠️ A browser on an HTTPS page cannot call an `http://` API (mixed content).
 *    For production either expose the backend over HTTPS, or leave
 *    `VITE_API_BASE` unset and proxy through the `vercel.json` rewrite.
 */
const API_HOST = import.meta.env.DEV
  ? '' // same-origin → handled by the Vite dev proxy
  : (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '')

export const API_ROOT = `${API_HOST}/api/v1`

/** Matches com.technosfirst.ducan.resources.rest.* controllers in app-service. */
export const AUTH_ENDPOINTS = {
  signup: `${API_ROOT}/auth/signup`,
  signin: `${API_ROOT}/auth/signin`,
  forgotPassword: `${API_ROOT}/auth/forgotPassword`,
  resetPassword: `${API_ROOT}/auth/resetPassword`,
  me: `${API_ROOT}/users/me`,
} as const

export interface AuthUser {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  referralCode?: string
  /** Convenience display name derived from firstName/lastName. */
  name?: string
}

/** Server returns { accessToken, tokenType, role } — no user object. */
export interface JwtAuthResponse {
  accessToken: string
  tokenType?: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export class ApiError extends Error {
  status: number
  /** Raw server text, kept for logging — never rendered to users. */
  detail?: string
  constructor(message: string, status: number, detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
  /** 401 — the session is missing or expired. */
  get isAuth() {
    return this.status === 401
  }
  /** 403 — authenticated, but this action is not permitted. */
  get isForbidden() {
    return this.status === 403
  }
  /** No response at all (offline, DNS, CORS, mixed content). */
  get isNetwork() {
    return this.status === 0
  }
}

/** Friendly copy per status. The server may answer with an HTML error page,
 *  so we never surface raw response bodies. */
function messageForStatus(status: number, serverMessage?: string): string {
  switch (status) {
    case 400:
      return serverMessage || 'Some details were invalid. Please check and try again.'
    case 401:
      return 'Your session has expired. Please sign in again.'
    case 403:
      return serverMessage || 'You do not have permission to do that.'
    case 404:
      return 'We could not find what you were looking for.'
    case 408:
      return 'The request timed out. Please try again.'
    case 409:
      return serverMessage || 'An account with this email already exists.'
    case 422:
      return serverMessage || 'Some details were invalid. Please check and try again.'
    case 429:
      return 'Too many attempts. Please wait a moment and try again.'
    case 500:
      return 'Something went wrong on our side. Please try again shortly.'
    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable. Please try again shortly.'
    default:
      if (status >= 500) return 'Something went wrong on our side. Please try again shortly.'
      return serverMessage || 'Something went wrong. Please try again.'
  }
}

/**
 * Called on 401 so the app can clear a dead session.
 *
 * 403 is deliberately excluded: it means the request was understood but not
 * allowed, which is not the same as a bad token, and signing the user out on
 * one would throw away a perfectly good session.
 */
type AuthFailureHandler = () => void
let onAuthFailure: AuthFailureHandler | null = null
export function setAuthFailureHandler(fn: AuthFailureHandler | null) {
  onAuthFailure = fn
}

let authToken: string | null = null
export function setAuthToken(token: string | null) {
  authToken = token
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Backend/mobile clients send a platform hint on every call.
        'X-Platform': 'web',
        Accept: 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      0,
    )
  }

  const raw = await res.text()
  const contentType = res.headers.get('content-type') ?? ''
  const looksJson = contentType.includes('json') || /^\s*[[{]/.test(raw)
  // Tomcat and proxies answer with HTML error pages; parse only real JSON.
  const data = looksJson ? safeJson(raw) : null

  if (!res.ok) {
    const serverMessage =
      data && typeof data === 'object'
        ? (data.message ?? data.error ?? data.detail ?? undefined)
        : undefined

    if (res.status === 401) onAuthFailure?.()

    throw new ApiError(
      messageForStatus(res.status, typeof serverMessage === 'string' ? serverMessage : undefined),
      res.status,
      raw.slice(0, 500),
    )
  }

  // A 2xx that isn't JSON (e.g. an HTML login page from a proxy) is not usable.
  if (raw && !looksJson) {
    throw new ApiError('Unexpected response from the server. Please try again.', res.status, raw.slice(0, 500))
  }

  return data as T
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export interface RegisterInput {
  email: string
  /** Backend enforces a minimum of 8 characters. */
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  referralCode?: string
}

/** POST /api/v1/auth/signup → { accessToken, tokenType, role } */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await request<JwtAuthResponse>(AUTH_ENDPOINTS.signup, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return toAuthResponse(res, { email: input.email, firstName: input.firstName, lastName: input.lastName })
}

export interface LoginInput {
  /** Backend field is `username` — we send the email address here. */
  email: string
  password: string
}

/** POST /api/v1/auth/signin → { accessToken, tokenType, role } */
export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await request<JwtAuthResponse>(AUTH_ENDPOINTS.signin, {
    method: 'POST',
    body: JSON.stringify({ username: input.email, password: input.password }),
  })
  return toAuthResponse(res, { email: input.email })
}

/** POST /api/v1/auth/forgotPassword */
export function forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
  return request(AUTH_ENDPOINTS.forgotPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

function toAuthResponse(res: JwtAuthResponse, seed: Partial<AuthUser> & { email: string }): AuthResponse {
  const name = [seed.firstName, seed.lastName].filter(Boolean).join(' ').trim() || undefined
  return { token: res.accessToken, user: { ...seed, name } }
}

/* ------------------------------------------------------------------ *
 * Home — PUBLIC endpoints (/api/v1/home/**), no token required.
 * ------------------------------------------------------------------ */

export interface ApiStore {
  id: number
  name: string
  url: string
  image?: string
  category?: 'FASHION' | 'HEALTH_BEAUTY' | 'ELECTRONICS' | string
  active?: boolean
  preferred?: boolean
  productRegex?: string[]
  cartRegex?: string[]
}

export interface ApiBanner {
  id: number
  active: boolean
  title?: string
  imageUrl?: string
}

export interface SupportedCountry {
  name: string
  code: string
}

export interface SupportedCurrency {
  name: string
  code: string
}

export const getStores = () => request<ApiStore[]>(`${API_ROOT}/home/stores`)
export const getBanners = (country?: string, loggedIn = true) =>
  request<ApiBanner[]>(
    `${API_ROOT}/home/banners?loggedIn=${loggedIn}${country ? `&country=${encodeURIComponent(country)}` : ''}`,
  )
export const getServiceBanners = () => request<string[]>(`${API_ROOT}/home/service-banners`)
export const getSupportedCountries = () => request<SupportedCountry[]>(`${API_ROOT}/home/countries`)
export const getSupportedCurrencies = () => request<SupportedCurrency[]>(`${API_ROOT}/home/currencies`)
export const getPaymentCurrencies = () => request<SupportedCurrency[]>(`${API_ROOT}/home/payment-currencies`)

/* ------------------------------------------------------------------ *
 * Users — AUTH required.
 * ------------------------------------------------------------------ */

export interface UserProfile {
  id: number
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  active?: boolean
  emailVerified?: boolean
  userType?: string
  paymentCurrency?: string
  preferredCurrency?: string
}

export interface UserAddress {
  id: number
  fullName: string
  street1: string
  street2?: string
  city: string
  state?: string
  country: string
  zipCode?: string
  phone: string
  active?: boolean
  formattedAddress?: string
}

export type CreateAddressInput = Omit<UserAddress, 'id' | 'active' | 'formattedAddress'>

export const getMe = () => request<UserProfile>(`${API_ROOT}/users/me`)

export const updateProfile = (input: {
  firstName: string
  lastName: string
  phone?: string
  paymentCurrency?: string
  preferredCurrency?: string
}) => request<UserProfile>(`${API_ROOT}/users/profile`, { method: 'PUT', body: JSON.stringify(input) })

export const updatePassword = (currentPassword: string, newPassword: string) =>
  request<GeneralResponse>(`${API_ROOT}/users/updatePassword`, {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

export const requestEmailVerification = () =>
  request<GeneralResponse>(`${API_ROOT}/users/verifyEmail`)

export const verifyEmail = (code: string) =>
  request<GeneralResponse>(`${API_ROOT}/users/verifyEmail`, {
    method: 'POST',
    body: JSON.stringify({ code, type: 'EMAIL_VERIFICATION' }),
  })

export const getAddresses = () => request<UserAddress[]>(`${API_ROOT}/users/address`)
export const createAddress = (input: CreateAddressInput) =>
  request<GeneralResponse>(`${API_ROOT}/users/address`, { method: 'POST', body: JSON.stringify(input) })
export const updateAddress = (id: number, input: Partial<UserAddress>) =>
  request<UserAddress>(`${API_ROOT}/users/address/${id}`, { method: 'PUT', body: JSON.stringify(input) })
export const deleteAddress = (id: number) =>
  request<GeneralResponse>(`${API_ROOT}/users/address/${id}`, { method: 'DELETE' })

export interface GeneralResponse<T = string> {
  success: boolean
  message?: string
  body?: T
}

/* ------------------------------------------------------------------ *
 * Cart & Orders — AUTH required.
 * ------------------------------------------------------------------ */

export interface PriceRef {
  priceInBaseCurrency?: number
  baseCurrency?: string
  priceInUserCurrency?: number
  userCurrency?: string
  priceInPaymentCurrency?: number
  paymentCurrency?: string
}

export interface ApiCartItem {
  id: string
  storeId: number
  productUrl: string
  count: number
  variant?: string
  variantInfo?: Record<string, string>
  status?: string
  productTitle?: string
  imageUrl?: string
  category?: string
  expectedDispatchDate?: string
  priceDetails?: PriceRef
  priceExpiry?: string
}

export const getCart = () => request<ApiCartItem[]>(`${API_ROOT}/orders/cart`)
export const addCartItem = (input: {
  storeId: number
  productUrl: string
  count?: number
  variant?: string
  variantInfo?: Record<string, string>
}) => request<GeneralResponse>(`${API_ROOT}/orders/cart`, { method: 'POST', body: JSON.stringify(input) })
export const setCartItemCount = (itemId: string, count: number) =>
  request<ApiCartItem>(`${API_ROOT}/orders/cart/${itemId}?count=${count}`, { method: 'PATCH' })
export const removeCartItem = (itemId: string) =>
  request<GeneralResponse>(`${API_ROOT}/orders/cart/${itemId}`, { method: 'DELETE' })

/** A price that may carry a discount, as returned for gross/shipping figures. */
export interface DiscountedPriceRef {
  basePrice?: PriceRef
  discounted?: boolean
  discount?: PriceRef
  discountedPrice?: PriceRef
}

export interface ApiOrder {
  id: string
  visualId?: string
  createdAt?: string
  status?: string
  items?: unknown[]
  priceCurrency?: string
  grossPriceDetails?: DiscountedPriceRef
  shippingFeeDetails?: DiscountedPriceRef
  commissionFeeDetails?: DiscountedPriceRef
  importTaxDetails?: PriceRef
  totalAmountDetails?: PriceRef
  paymentOrderId?: string
  payments?: unknown[]
  shippingCompany?: string
  shippingTrackingNumber?: string
  /** Set when a supplied coupon could not be applied. */
  couponError?: string
}

export const getOrders = (showArchived = false) =>
  request<ApiOrder[]>(`${API_ROOT}/orders?showArchived=${showArchived}`)
export const getOrderTracking = (orderId: string) =>
  request<unknown>(`${API_ROOT}/orders/${orderId}/tracking`)
export const quoteOrder = (input: {
  deliveryAddressId: number
  itemIds: string[]
  couponCode?: string
  paymentGateway?: string
}) => request<ApiOrder>(`${API_ROOT}/orders/price`, { method: 'POST', body: JSON.stringify(input) })
export const createOrder = (input: {
  deliveryAddressId: number
  itemIds: string[]
  couponCode?: string
  paymentGateway?: string
}) => request<ApiOrder>(`${API_ROOT}/orders`, { method: 'POST', body: JSON.stringify(input) })

/* ------------------------------------------------------------------ *
 * Wallet, coupons, referral — AUTH required.
 * ------------------------------------------------------------------ */

export interface WalletBalance {
  walletId?: string
  userId?: number
  balance: number
  currency: string
}

export interface WalletTransaction {
  id: string
  type: 'CREDIT' | 'DEBIT'
  category?: string
  label?: string
  amount: number
  currency: string
  balanceAfter?: number
  referenceId?: string
  createdAt?: string
}

export const getWallet = () => request<WalletBalance>(`${API_ROOT}/wallet`)
export const getWalletTransactions = () =>
  request<WalletTransaction[]>(`${API_ROOT}/wallet/transactions`)
export const getWalletDeposits = () => request<unknown[]>(`${API_ROOT}/wallet/deposits`)

export interface ApiCoupon {
  id: string
  code: string
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value?: number
  minimumOrderValue?: number
  maxDiscountAmount?: number
  allowedUsage?: number
  usedTimes?: number
  expiry?: string
  applicableCountries?: string[]
}

export const getCoupons = () => request<ApiCoupon[]>(`${API_ROOT}/discount-coupons`)
export const assignCoupon = (couponCode: string) =>
  request<ApiCoupon | null>(
    `${API_ROOT}/discount-coupons/assign?couponCode=${encodeURIComponent(couponCode)}`,
    { method: 'POST' },
  )

export const getReferral = () => request<{ referralCode: string }>(`${API_ROOT}/referral`)

/* ------------------------------------------------------------------ *
 * Payments — AUTH required (only /payments/hook/** is public).
 * ------------------------------------------------------------------ */

export type PaymentGateway =
  | 'RAZORPAY'
  | 'STRIPE'
  | 'PAYPAL'
  | 'WALLET'
  | 'BHUTAN_POST'
  | 'BHUTAN_NATIONAL_BANK'

export interface PaymentConfig {
  paymentGateway: PaymentGateway
  displayName?: string
  accountName?: string
  deferredPayment?: boolean
}

export interface BankAccount {
  country?: string
  flag?: string
  currency?: string
  beneficiary?: string
  bank?: string
  account?: string
  ifsc?: string
  swift?: string
}

/** GET /api/v1/payments — gateways available for a country. */
export const getPaymentConfigs = (country?: string) =>
  request<PaymentConfig[]>(
    `${API_ROOT}/payments${country ? `?country=${encodeURIComponent(country)}` : ''}`,
  )

export const getBankAccounts = () => request<BankAccount[]>(`${API_ROOT}/payments/banks`)

/** POST /api/v1/orders/{id}/payments — start payment for an order. */
export const initiateOrderPayment = (orderId: string, gateway: PaymentGateway, amount?: number) =>
  request<ApiOrder>(
    `${API_ROOT}/orders/${orderId}/payments?gateway=${gateway}` +
      (amount != null ? `&amount=${amount}` : ''),
    { method: 'POST' },
  )

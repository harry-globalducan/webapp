import * as amplitude from '@amplitude/analytics-browser'
import { Identify } from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'
import type { AuthUser } from './api'

const API_KEY =
  (import.meta.env.VITE_AMPLITUDE_API_KEY as string | undefined)?.trim() ||
  'a099e95a2708a30d43d28feb57d9a356'

const REPLAY_SAMPLE = Number(import.meta.env.VITE_AMPLITUDE_REPLAY_SAMPLE_RATE ?? '1')

let ready: Promise<void> | null = null

/** Initialise Amplitude + Session Replay once. Safe to call multiple times. */
export function initAnalytics(): Promise<void> {
  if (ready) return ready
  if (!API_KEY) {
    ready = Promise.resolve()
    return ready
  }

  ready = (async () => {
    try {
      amplitude.add(
        sessionReplayPlugin({
          sampleRate: Number.isFinite(REPLAY_SAMPLE) ? Math.min(1, Math.max(0, REPLAY_SAMPLE)) : 1,
        }),
      )
      await amplitude.init(API_KEY, undefined, {
        defaultTracking: {
          sessions: true,
          pageViews: false, // we send our own with route path
          formInteractions: false,
          fileDownloads: true,
        },
        appVersion: import.meta.env.VITE_APP_VERSION || undefined,
      }).promise
    } catch (err) {
      console.warn('[amplitude] init failed', err)
    }
  })()

  return ready
}

function displayName(user: AuthUser): string | undefined {
  if (user.name?.trim()) return user.name.trim()
  const joined = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return joined || undefined
}

/**
 * Bind the Amplitude user to the signed-in profile.
 * Uses email (or id) as userId and sets email / name / phone traits.
 */
export function identifyUser(user: AuthUser | null | undefined) {
  if (!user?.email) return

  const userId = user.id || user.email
  amplitude.setUserId(userId)

  const id = new Identify()
  id.set('email', user.email)
  if (user.id) id.set('user_id', user.id)
  const name = displayName(user)
  if (name) id.set('name', name)
  if (user.firstName) id.set('first_name', user.firstName)
  if (user.lastName) id.set('last_name', user.lastName)
  if (user.phone) id.set('phone', user.phone)
  if (user.referralCode) id.set('referral_code', user.referralCode)
  amplitude.identify(id)
}

/** Clear identity on sign-out (new anonymous device session). */
export function resetAnalyticsUser() {
  amplitude.reset()
}

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

/** Track a product / behavioural event. */
export function track(event: string, properties?: AnalyticsProps) {
  const cleaned: Record<string, string | number | boolean> = {}
  if (properties) {
    for (const [k, v] of Object.entries(properties)) {
      if (v === undefined || v === null) continue
      cleaned[k] = v
    }
  }
  void amplitude.track(event, cleaned)
}

export function trackPageView(pathname: string, search = '') {
  track('Page Viewed', {
    path: pathname,
    search: search || undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    title: typeof document !== 'undefined' ? document.title : undefined,
  })
}

export const AnalyticsEvents = {
  signedUp: 'Signed Up',
  signedIn: 'Signed In',
  signedOut: 'Signed Out',
  storeOpened: 'Store Opened',
  productCaptureStarted: 'Product Capture Started',
  productCaptured: 'Product Captured',
  productCaptureFailed: 'Product Capture Failed',
  addedToCart: 'Added to Cart',
  wishlistToggled: 'Wishlist Toggled',
  checkoutStarted: 'Checkout Started',
  orderPlaced: 'Order Placed',
  searchSubmitted: 'Search Submitted',
} as const

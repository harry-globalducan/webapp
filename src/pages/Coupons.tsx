import { useMemo, useState, type FormEvent } from 'react'
import { Copy, Check, Clock3, Store, Plus, Loader2, AlertCircle } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import PromoStrip from '../components/PromoStrip'
import { bannersFor } from '../data/banners'
import { useAuth } from '../context/AuthContext'
import { useApiData } from '../lib/useApiData'
import ApiErrorNotice from '../components/ApiErrorNotice'
import { useCurrency } from '../context/CurrencyContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'

const couponsBanner = bannersFor('coupons')[0]

type CouponState = 'Available' | 'Used' | 'Expired'

interface Coupon {
  code: string
  headline: string
  detail: string
  scope: string
  expires: string
  state: CouponState
}


const tabs: CouponState[] = ['Available', 'Used', 'Expired']

/** Map a server coupon (GET /api/v1/discount-coupons) into the card shape. */
function fromApi(c: api.ApiCoupon, fmt: (n: number) => string): Coupon {
  const expired = c.expiry ? new Date(c.expiry).getTime() < Date.now() : false
  const usedUp = (c.usedTimes ?? 0) >= (c.allowedUsage ?? Infinity)
  const value =
    c.type === 'PERCENTAGE' ? `${c.value}% off` : `${fmt(Number(c.value ?? 0))} off`
  const detail = [
    c.minimumOrderValue ? `On orders above ${fmt(Number(c.minimumOrderValue))}.` : null,
    c.maxDiscountAmount ? `Up to ${fmt(Number(c.maxDiscountAmount))} off.` : null,
    c.allowedUsage ? `Usage: ${c.usedTimes ?? 0} of ${c.allowedUsage}.` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const when = c.expiry
    ? new Date(c.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return {
    code: c.code,
    headline: value,
    detail: detail || 'Applies at checkout.',
    scope: c.applicableCountries?.length ? c.applicableCountries.join(', ') : 'All stores',
    expires: when ? `${expired ? 'Expired' : 'Expires'} ${when}` : 'No expiry',
    state: expired ? 'Expired' : usedUp ? 'Used' : 'Available',
  }
}

export default function Coupons() {
  const [tab, setTab] = useState<CouponState>('Available')
  const [copied, setCopied] = useState('')
  const [newCode, setNewCode] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const { isAuthed } = useAuth()
  const { formatPrice } = useCurrency()

  const { data: apiCoupons, error, refresh } = useApiData(() => api.getCoupons(), {
    enabled: isAuthed,
    fallback: [] as api.ApiCoupon[],
  })

  // Signed-in users see their real coupons; guests see the sample set.
  const coupons = useMemo(
    () => apiCoupons.map((c) => fromApi(c, formatPrice)),
    [apiCoupons, formatPrice],
  )

  const addCoupon = async (e: FormEvent) => {
    e.preventDefault()
    const code = newCode.trim()
    if (!code) return
    setAdding(true)
    setAddError(null)
    try {
      const res = await api.assignCoupon(code)
      if (!res) {
        setAddError('That code is not valid for your account.')
        return
      }
      setNewCode('')
      refresh()
    } catch (err) {
      setAddError(err instanceof ApiError ? err.message : 'Could not add that coupon.')
    } finally {
      setAdding(false)
    }
  }

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      // clipboard unavailable — user can read the code
    }
  }

  const visible = coupons.filter((c) => c.state === tab)

  return (
    <AccountLayout
      title="Coupons & offers"
      description="Codes apply at checkout, on top of store discounts."
    >
      {couponsBanner && (
        <div className="mb-6">
          <PromoStrip banner={couponsBanner} />
        </div>
      )}
      <ApiErrorNotice
        message={error}
        onRetry={refresh}
        hint="We could not load your coupons."
      />

      {/* Redeem a code — POST /api/v1/discount-coupons/assign */}
      {isAuthed && (
        <form onSubmit={addCoupon} className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Enter a coupon code"
              aria-label="Coupon code"
              className="min-w-0 flex-1 rounded-2xl border border-navy-900/10 bg-white px-4 py-3 text-sm uppercase tracking-wide shadow-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-black dark:text-white"
            />
            <button
              type="submit"
              disabled={adding || !newCode.trim()}
              className="flex items-center gap-2 rounded-2xl bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add coupon
            </button>
          </div>
          {addError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" /> {addError}
            </p>
          )}
        </form>
      )}

      <div className="flex gap-1 border-b border-navy-900/10 dark:border-white/10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t
                ? 'border-tangerine-500 text-navy-900 dark:text-white'
                : 'border-transparent text-slate-400 hover:text-navy-700 dark:hover:text-cream-50/80'
            }`}
          >
            {t}
            <span className="ml-1.5 text-xs text-slate-400">
              {coupons.filter((c) => c.state === t).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {visible.map((coupon) => {
          const inactive = coupon.state !== 'Available'
          return (
            <div
              key={coupon.code}
              className={`flex overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-black ${
                inactive ? 'opacity-55 grayscale-[0.4]' : ''
              }`}
            >
              {/* Code stub */}
              <div className="flex w-32 shrink-0 flex-col items-center justify-center gap-2 border-r border-dashed border-navy-900/15 bg-cream-50 px-3 py-6 dark:border-white/15 dark:bg-white/5">
                <span className="font-display text-sm font-bold tracking-wider text-navy-900 dark:text-white">
                  {coupon.code}
                </span>
                {!inactive && (
                  <button
                    onClick={() => void copy(coupon.code)}
                    className="flex items-center gap-1 rounded-full border border-navy-900/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-600 transition hover:border-navy-400 dark:border-white/15 dark:text-navy-200 dark:hover:border-white/30"
                  >
                    {copied === coupon.code ? (
                      <>
                        <Check className="h-3 w-3 text-leaf-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              {/* Details */}
              <div className="flex-1 px-5 py-4">
                <div className="font-display text-base font-semibold text-navy-900 dark:text-white">
                  {coupon.headline}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {coupon.detail}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Store className="h-3 w-3" /> {coupon.scope}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3 w-3" /> {coupon.expires}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="mt-6 rounded-2xl border border-navy-900/5 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-black">
          <p className="text-sm text-slate-500 dark:text-slate-400">Nothing here yet.</p>
        </div>
      )}
    </AccountLayout>
  )
}

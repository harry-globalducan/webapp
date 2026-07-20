import { useState } from 'react'
import { Copy, Check, Clock3, Store } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import PromoStrip from '../components/PromoStrip'
import { bannersFor } from '../data/banners'

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

const coupons: Coupon[] = [
  {
    code: 'WELCOME15',
    headline: '15% off your first order',
    detail: 'Up to $25 off the item subtotal. New customers only.',
    scope: 'All stores',
    expires: 'Expires Aug 31, 2026',
    state: 'Available',
  },
  {
    code: 'FREESHIP50',
    headline: 'Free shipping over $50',
    detail: 'International shipping fee waived on consolidated parcels.',
    scope: 'All stores',
    expires: 'Expires Jul 31, 2026',
    state: 'Available',
  },
  {
    code: 'BEAUTY10',
    headline: '10% off beauty & skincare',
    detail: 'Applies to Nykaa, The Derma Co, Aqualogica and Dr. Sheth’s.',
    scope: 'Health & Beauty',
    expires: 'Expires Sep 15, 2026',
    state: 'Available',
  },
  {
    code: 'DUCAN5',
    headline: '$5 off any order',
    detail: 'Applied to order GD-2779 on June 30.',
    scope: 'All stores',
    expires: 'Used Jun 30, 2026',
    state: 'Used',
  },
  {
    code: 'SUMMER20',
    headline: '20% off fashion',
    detail: 'Myntra, Nykaa Fashion and Jockey.',
    scope: 'Fashion',
    expires: 'Expired Jun 1, 2026',
    state: 'Expired',
  },
]

const tabs: CouponState[] = ['Available', 'Used', 'Expired']

export default function Coupons() {
  const [tab, setTab] = useState<CouponState>('Available')
  const [copied, setCopied] = useState('')

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

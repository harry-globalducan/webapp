import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  Receipt,
  ShoppingCart,
  Tag,
  Wallet as WalletIcon,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAddresses } from '../context/AddressContext'
import { useCurrency } from '../context/CurrencyContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { pickMoney } from '../lib/money'
import AddressForm from '../components/AddressForm'
import { formatPhone } from '../lib/phone'
import { AnalyticsEvents, track } from '../lib/analytics'

type Step = 1 | 2 | 3
const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Summary' },
  { id: 3, label: 'Payment' },
]

/**
 * Use the amount the server already converted for the shopper, together with
 * the currency it used — never re-convert or pair a figure with another code.
 */
function money(p?: api.PriceRef): { amount: number; currency?: string } {
  const m = pickMoney(p)
  return { amount: m.amount, currency: m.currency }
}
function discountedMoney(d?: api.DiscountedPriceRef) {
  return money(d?.discountedPrice ?? d?.basePrice)
}

function Stepper({ current }: { current: Step }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = current > s.id
        const active = current === s.id
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                done
                  ? 'bg-tangerine-500 text-white'
                  : active
                    ? 'bg-navy-800 text-white dark:bg-white dark:text-navy-900'
                    : 'bg-navy-900/10 text-slate-400 dark:bg-white/10'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.id}
            </span>
            <span
              className={`text-sm font-semibold ${
                active ? 'text-navy-900 dark:text-white' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`ml-1 hidden h-px flex-1 sm:block ${
                  done ? 'bg-tangerine-500' : 'bg-navy-900/10 dark:bg-white/10'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { itemIds?: string[] } }
  const { items, refresh: refreshCart } = useCart()
  const { addresses, active, setDefault, refresh: refreshAddresses } = useAddresses()
  const { format } = useCurrency()

  const [step, setStep] = useState<Step>(1)
  const [addingAddress, setAddingAddress] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [quote, setQuote] = useState<api.ApiOrder | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [useWallet, setUseWallet] = useState(false)

  // Only the rows chosen in the cart are being checked out.
  const itemIds = useMemo(
    () => state?.itemIds ?? items.map((it) => it.id),
    [state?.itemIds, items],
  )
  const lineItems = items.filter((it) => itemIds.includes(it.id))
  const totalQty = lineItems.reduce((sum, it) => sum + it.qty, 0)

  const [walletBalance, setWalletBalance] = useState<api.WalletBalance | null>(null)
  useEffect(() => {
    api
      .getWallet()
      .then(setWalletBalance)
      .catch(() => setWalletBalance(null))
  }, [])

  // Ask the server to price the order whenever the inputs change.
  const requestQuote = async (couponCode?: string) => {
    if (!active || itemIds.length === 0) return
    setQuoting(true)
    setError(null)
    try {
      const res = await api.quoteOrder({
        deliveryAddressId: Number(active.id),
        itemIds,
        couponCode: couponCode || undefined,
      })
      setQuote(res)
      if (couponCode && res.couponError) setError(res.couponError)
      else if (couponCode) setAppliedCoupon(couponCode)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not price this order.')
    } finally {
      setQuoting(false)
    }
  }

  useEffect(() => {
    if (step === 2) void requestQuote(appliedCoupon)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, active?.id])

  useEffect(() => {
    track(AnalyticsEvents.checkoutStarted, {
      item_count: itemIds.length,
      step,
    })
    // Fire once when checkout mounts — step changes are their own UX signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const grossM = discountedMoney(quote?.grossPriceDetails)
  const shippingM = discountedMoney(quote?.shippingFeeDetails)
  const totalM = money(quote?.totalAmountDetails)
  const total = totalM.amount || grossM.amount + shippingM.amount
  const cur = totalM.currency ?? grossM.currency

  const payNow = async (gateway: api.PaymentGateway) => {
    if (!active) return
    setPaying(true)
    setError(null)
    try {
      const order = await api.createOrder({
        deliveryAddressId: Number(active.id),
        itemIds,
        couponCode: appliedCoupon || undefined,
      })
      await api.initiateOrderPayment(order.id, gateway)
      refreshCart()
      track(AnalyticsEvents.orderPlaced, {
        order_id: String(order.visualId ?? order.id),
        gateway,
        item_count: itemIds.length,
      })
      navigate(`/orders?placed=${order.visualId ?? order.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment could not be started.')
    } finally {
      setPaying(false)
    }
  }

  if (itemIds.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <ShoppingCart className="mx-auto h-10 w-10 text-navy-300" />
        <h1 className="mt-4 text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Select at least one priced item in your cart first.
        </p>
        <Link
          to="/cart"
          className="mt-6 inline-block rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white dark:bg-tangerine-500"
        >
          Back to cart
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (step === 1 ? navigate('/cart') : setStep((s) => (s - 1) as Step))}
          className="rounded-full p-2 text-navy-700 transition hover:bg-navy-900/5 dark:text-white dark:hover:bg-white/10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      </div>

      <div className="mt-6">
        <Stepper current={step} />
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ---------------------------------------------------------- Step 1 */}
      {step === 1 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl font-bold">Delivery address</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose where to ship your order
          </p>

          <div className="mt-4 space-y-3">
            {addresses.map((a) => {
              const selected = active?.id === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setDefault(a.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? 'border-navy-800 bg-navy-50 dark:border-tangerine-500 dark:bg-tangerine-500/10'
                      : 'border-navy-900/10 bg-white hover:border-navy-300 dark:border-white/10 dark:bg-black'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      selected
                        ? 'border-navy-800 bg-navy-800 text-white dark:border-tangerine-500 dark:bg-tangerine-500'
                        : 'border-navy-900/20 dark:border-white/20'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-900 dark:text-white">
                      {a.name || a.label}
                    </span>
                    {a.lines.map((l) => (
                      <span key={l} className="block text-sm text-slate-500 dark:text-slate-400">
                        {l}
                      </span>
                    ))}
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                      {formatPhone(a.phone)}
                    </span>
                  </span>
                </button>
              )
            })}

            {addingAddress ? (
              <AddressForm
                onCancel={() => setAddingAddress(false)}
                onSaved={() => {
                  setAddingAddress(false)
                  refreshAddresses()
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAddingAddress(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-900/20 py-4 text-sm font-semibold text-navy-700 transition hover:border-navy-400 dark:border-white/20 dark:text-tangerine-300"
              >
                <Plus className="h-4 w-4" /> Add a new address
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={!active}
            onClick={() => setStep(2)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* ---------------------------------------------------------- Step 2 */}
      {step === 2 && (
        <section className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <div className="flex items-center justify-between border-b border-navy-900/10 bg-cream-50 px-5 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="flex items-center gap-2 font-semibold text-navy-900 dark:text-white">
                <ShoppingCart className="h-4 w-4 text-navy-500" /> Cart items
              </span>
              <span className="text-xs text-slate-500">
                {lineItems.length} item{lineItems.length === 1 ? '' : 's'}
              </span>
            </div>
            {lineItems.map((it) => (
              <div key={it.id} className="flex items-start gap-3 px-5 py-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-100 dark:bg-white/5">
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-2xl">{it.emoji}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold text-navy-900 dark:text-white">
                    {it.title}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {it.variants && Object.values(it.variants).join(' · ')}
                    {it.variants && Object.keys(it.variants).length > 0 ? ' · ' : ''}Qty {it.qty}
                  </div>
                  {it.expectedDispatchDate && (
                    <div className="mt-0.5 text-xs text-slate-400">
                      Dispatch by{' '}
                      {new Date(it.expectedDispatchDate).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-sm font-bold text-navy-900 dark:text-white">
                  {format(it.price * it.qty, it.currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-navy-900/10 bg-cream-50 px-5 py-3 font-semibold text-navy-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <Tag className="h-4 w-4 text-navy-500" /> Apply coupon
            </div>
            <div className="flex items-center gap-2 p-4">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="min-w-0 flex-1 rounded-xl border border-navy-900/10 bg-white px-4 py-2.5 text-sm uppercase tracking-wide outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-black dark:text-white"
              />
              <button
                type="button"
                onClick={() => void requestQuote(coupon)}
                disabled={!coupon.trim() || quoting}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50 disabled:opacity-40 dark:text-tangerine-300 dark:hover:bg-white/5"
              >
                APPLY
              </button>
            </div>
            {appliedCoupon && !quote?.couponError && (
              <p className="px-4 pb-4 text-xs font-medium text-leaf-700 dark:text-leaf-400">
                Coupon {appliedCoupon} applied.
              </p>
            )}
          </div>

          {/* Price summary */}
          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-navy-900/10 bg-cream-50 px-5 py-3 font-semibold text-navy-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <Receipt className="h-4 w-4 text-navy-500" /> Price summary
            </div>
            {quoting ? (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Calculating shipping…
              </div>
            ) : (
              <dl className="space-y-2 p-5 text-sm tabular-nums">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Gross price</dt>
                  <dd className="font-semibold text-navy-900 dark:text-white">
                    {format(grossM.amount, grossM.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Shipping &amp; handling</dt>
                  <dd className="font-semibold text-navy-900 dark:text-white">
                    {format(shippingM.amount, shippingM.currency)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-navy-900/10 pt-3 text-base dark:border-white/10">
                  <dt className="font-bold text-navy-900 dark:text-white">Total amount</dt>
                  <dd className="font-display text-xl font-bold text-navy-900 dark:text-white">
                    {format(total, cur)}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <button
            type="button"
            disabled={quoting || !quote}
            onClick={() => setStep(3)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
          >
            Make payment <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* ---------------------------------------------------------- Step 3 */}
      {step === 3 && (
        <section className="mt-6 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-navy-900/10 bg-cream-50 px-5 py-3 font-semibold text-navy-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <Receipt className="h-4 w-4 text-tangerine-500" /> Review your order
            </div>
            <dl className="space-y-2 p-5 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">No. of items</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">{lineItems.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Total item quantity</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">{totalQty}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Gross amount</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">
                  {format(grossM.amount, grossM.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Shipping</dt>
                <dd className="font-semibold text-navy-900 dark:text-white">
                  {format(shippingM.amount, shippingM.currency)}
                </dd>
              </div>
              <div className="flex items-start justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Coupon applied</dt>
                <dd className="text-right">
                  <span className="block font-semibold text-navy-900 dark:text-white">
                    {appliedCoupon || 'No coupon applied'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-navy-600 hover:underline dark:text-tangerine-300"
                  >
                    ← Go back to apply
                  </button>
                </dd>
              </div>
              <div className="flex justify-between border-t border-navy-900/10 pt-3 text-base dark:border-white/10">
                <dt className="font-bold text-navy-900 dark:text-white">Total</dt>
                <dd className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  {format(total, cur)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-navy-900/10 bg-cream-50 px-5 py-3 font-semibold text-navy-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <MapPin className="h-4 w-4 text-navy-500" /> Delivering to
            </div>
            <div className="p-5 text-sm">
              <div className="font-semibold text-navy-900 dark:text-white">
                {active?.name || active?.label}
              </div>
              {active?.lines.map((l) => (
                <div key={l} className="text-slate-500 dark:text-slate-400">
                  {l}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold">Pay with</h2>
            <span className="font-display text-xl font-bold text-navy-900 dark:text-white">
              {format(total, cur)}
            </span>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-4 rounded-2xl border border-navy-900/10 p-4 dark:border-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
              <WalletIcon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-navy-900 dark:text-white">
                GD Wallet
              </span>
              <span
                className={`block text-xs ${
                  (walletBalance?.balance ?? 0) > 0 ? 'text-slate-500' : 'text-red-500'
                }`}
              >
                Available balance:{' '}
                {format(walletBalance?.balance ?? 0, walletBalance?.currency ?? 'USD')}
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={useWallet}
              disabled={(walletBalance?.balance ?? 0) <= 0}
              onClick={() => setUseWallet((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-40 ${
                useWallet ? 'bg-navy-600 dark:bg-tangerine-500' : 'bg-slate-300 dark:bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  useWallet ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            disabled={paying}
            onClick={() => void payNow(useWallet ? 'WALLET' : 'STRIPE')}
            className="flex w-full items-center gap-4 rounded-2xl bg-navy-800 p-4 text-left text-white transition hover:bg-navy-700 disabled:opacity-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              {paying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold">International credit card</span>
              <span className="block text-xs text-white/60">
                Cards, UPI &amp; net-banking · pay now
              </span>
            </span>
            <ChevronDown className="h-5 w-5 -rotate-90 text-white/70" />
          </button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" /> Secure &amp; encrypted payment
          </p>
        </section>
      )}
    </main>
  )
}

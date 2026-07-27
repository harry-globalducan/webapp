import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Package, ChevronDown, Loader2 } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import { useOrders } from '../context/OrdersContext'
import { orderStatusSteps, type OrderStatus } from '../data/orders'

const tabs = ['All orders', ...orderStatusSteps] as const

const statusStyles: Record<OrderStatus, string> = {
  Buying: 'bg-tangerine-100 text-tangerine-700 dark:bg-tangerine-500/20 dark:text-tangerine-300',
  'At warehouse': 'bg-navy-100 text-navy-700 dark:bg-navy-500/25 dark:text-navy-200',
  'Ready to ship': 'bg-navy-100 text-navy-700 dark:bg-navy-500/25 dark:text-navy-200',
  'In transit': 'bg-navy-100 text-navy-700 dark:bg-navy-500/25 dark:text-navy-200',
  Delivered: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300',
}

function StatusProgress({ status }: { status: OrderStatus }) {
  const current = orderStatusSteps.indexOf(status)
  return (
    <div className="flex items-center gap-1">
      {orderStatusSteps.map((step, i) => (
        <div
          key={step}
          className={`h-1.5 w-5 rounded-full transition sm:w-7 ${
            i <= current ? 'bg-leaf-500' : 'bg-navy-900/10 dark:bg-white/10'
          }`}
          title={step}
        />
      ))}
    </div>
  )
}

export default function Orders() {
  const { orders, loading } = useOrders()
  const [params] = useSearchParams()
  const placedId = params.get('placed')
  const [tab, setTab] = useState<(typeof tabs)[number]>('All orders')
  const [query, setQuery] = useState('')

  const visible = useMemo(
    () =>
      orders.filter((o) => {
        const tabOk = tab === 'All orders' || o.status === tab
        const q = query.trim().toLowerCase()
        const qOk =
          !q ||
          o.id.toLowerCase().includes(q) ||
          o.items.some(
            (it) => it.title.toLowerCase().includes(q) || it.store.toLowerCase().includes(q),
          )
        return tabOk && qOk
      }),
    [orders, tab, query],
  )

  return (
    <AccountLayout
      title="Your orders"
      description={`${orders.length} orders · India warehouse proxy flow`}
      actions={
        <label className="relative block w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all orders"
            className="w-full rounded-full border border-navy-900/10 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-black dark:text-white"
          />
        </label>
      }
    >
      {placedId && (
        <div className="mb-6 rounded-2xl border border-leaf-500/30 bg-leaf-50 px-5 py-4 text-sm text-leaf-800 dark:border-leaf-500/30 dark:bg-leaf-500/10 dark:text-leaf-300">
          Buy request <strong>{placedId}</strong> placed — we are purchasing from the store and
          will keep you posted as it moves to our India warehouse.
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-navy-900/10 dark:border-white/10 [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition sm:px-4 ${
              tab === t
                ? 'border-tangerine-500 text-navy-900 dark:text-white'
                : 'border-transparent text-slate-400 hover:text-navy-700 dark:hover:text-cream-50/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {loading && orders.length === 0 && (
          <div className="space-y-5" aria-busy="true">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-black"
              >
                <div className="h-14 border-b border-navy-900/10 bg-cream-50 dark:border-white/10 dark:bg-white/5" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-40 rounded-full bg-navy-900/10 dark:bg-white/10" />
                  <div className="h-3 w-2/3 rounded-full bg-navy-900/10 dark:bg-white/10" />
                  <div className="h-3 w-1/3 rounded-full bg-navy-900/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
            <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading your orders…
            </p>
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="rounded-2xl border border-navy-900/5 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-black">
            <Package className="mx-auto h-8 w-8 text-navy-300" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {orders.length === 0
                ? 'No orders yet — paste a product link to place your first buy request.'
                : 'No orders match — try a different search or tab.'}
            </p>
          </div>
        )}

        {visible.map((order) => {
          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-black"
            >
              <header className="flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-navy-900/10 bg-cream-50 px-6 py-4 text-xs dark:border-white/10 dark:bg-white/5">
                <div>
                  <div className="uppercase tracking-wide text-slate-400">Order placed</div>
                  <div className="mt-0.5 font-semibold text-navy-900 dark:text-white">
                    {order.placed}
                  </div>
                </div>
                <div>
                  <div className="uppercase tracking-wide text-slate-400">Item payment</div>
                  <div className="mt-0.5 font-semibold tabular-nums text-navy-900 dark:text-white">
                    {order.itemTotal}
                  </div>
                </div>
                {order.shippingTotal && (
                  <div>
                    <div className="uppercase tracking-wide text-slate-400">Shipping paid</div>
                    <div className="mt-0.5 font-semibold tabular-nums text-navy-900 dark:text-white">
                      {order.shippingTotal}
                    </div>
                  </div>
                )}
                <div>
                  <div className="uppercase tracking-wide text-slate-400">Ship to</div>
                  <button className="mt-0.5 flex items-center gap-1 font-semibold text-navy-600 hover:text-navy-800 dark:text-navy-200">
                    {order.shipTo} <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="ml-auto text-right">
                  <div className="uppercase tracking-wide text-slate-400">Order # {order.id}</div>
                  <div className="mt-0.5 flex gap-3 font-semibold">
                    <Link
                      to="/support"
                      className="text-navy-600 hover:text-navy-800 hover:underline dark:text-navy-200"
                    >
                      Get support
                    </Link>
                  </div>
                </div>
              </header>

              <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-navy-900 dark:text-white">
                    {order.eta}
                  </span>
                </div>
                <StatusProgress status={order.status} />
              </div>

              <div className="grid gap-6 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_220px]">
                <ul className="space-y-4">
                  {order.items.map((item) => (
                    <li key={item.title} className="flex items-center gap-4">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-3xl dark:bg-white/10">
                        {item.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-navy-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {item.store} · Qty {item.qty}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 self-start">
                  {order.status === 'In transit' && (
                    <button className="rounded-full bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400">
                      Track package
                    </button>
                  )}
                  <Link
                    to="/support"
                    className="rounded-full border border-navy-900/15 px-4 py-2.5 text-center text-sm font-medium text-navy-800/80 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
                  >
                    Get support
                  </Link>
                </div>
              </div>

            </article>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-navy-900/15 bg-white/60 p-5 dark:border-white/15 dark:bg-white/5">
        <Package className="h-7 w-7 shrink-0 text-navy-300" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          How it works: you pay once at checkout — items plus shipping and handling. We buy from
          the Indian stores, consolidate everything at our India warehouse, and deliver it to your
          door under one tracking number.
        </p>
      </div>
    </AccountLayout>
  )
}

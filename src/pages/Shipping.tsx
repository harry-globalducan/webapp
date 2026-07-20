import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plane,
  Package,
  Ruler,
  Scale,
  ShieldAlert,
  Ban,
  AlertTriangle,
  Check,
  ArrowRight,
  Calculator,
  BadgePercent,
  Truck,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import {
  destinations,
  weightTiers,
  parcelLimits,
  restrictions,
  feeHighlights,
  freeShippingNote,
  perKgNote,
  FREE_SHIP_CODE,
  type Destination,
} from '../data/shipping'

const rateKeys = [
  { key: 'uae', label: 'UAE' },
  { key: 'maldives', label: 'Maldives' },
  { key: 'mauritius', label: 'Mauritius' },
  { key: 'saudi', label: 'Saudi' },
] as const

const limitIcons = {
  weight: Scale,
  longest: Ruler,
  girth: Package,
  value: BadgePercent,
} as const

function fmtRate(tierId: string, value: number) {
  return tierId === 't6' ? `$${value}/kg` : `$${value}`
}

export default function Shipping() {
  const [active, setActive] = useState<Destination>(destinations[0])

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-10 bg-tangerine-500" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-tangerine-600">
            Shipping
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Shipping fees, weight limits &{' '}
          <span className="text-tangerine-500">restrictions</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Transparent, two-step pricing: pay the item fee to buy from Indian stores, then only
          real-weight international postage once we consolidate your haul. Here's exactly what it
          costs and what can (and can't) fly.
        </p>
      </div>

      {/* Fee highlights */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {feeHighlights.map((h, i) => (
          <Reveal key={h} delay={i * 60}>
            <div className="flex h-full items-start gap-3 rounded-2xl border border-navy-900/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{h}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Destination chips */}
      <section className="mt-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Where we ship
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active.id === d.id
                  ? 'border-navy-800 bg-navy-800 text-white dark:border-tangerine-500 dark:bg-tangerine-500'
                  : 'border-navy-900/12 bg-white text-navy-900 hover:border-navy-400 dark:border-white/12 dark:bg-black dark:text-white dark:hover:border-white/30'
              }`}
            >
              <span>{d.flag}</span>
              {d.country}
            </button>
          ))}
        </div>

        {/* Active destination note */}
        <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-navy-900/5 bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-white shadow-sm shadow-navy-900/25 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            {active.flag}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{active.country}</h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  active.ddp
                    ? 'bg-leaf-500/20 text-leaf-300'
                    : 'bg-tangerine-500/20 text-tangerine-200'
                }`}
              >
                <Truck className="h-3 w-3" />
                {active.ddp ? 'DDP — duties paid' : 'Duty estimated up front'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-white/80">
                <Plane className="h-3 w-3" /> {active.transit}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{active.note}</p>
          </div>
        </div>
      </section>

      {/* Fee table */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Shipping fee estimates</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Indicative USD postage per parcel from our India warehouse. Final quote is by actual
              (or volumetric) weight.
            </p>
          </div>
          <Link
            to="/capture"
            className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-xs font-semibold text-navy-800/80 transition hover:border-navy-400 dark:border-white/15 dark:text-white dark:hover:border-white/30"
          >
            <Calculator className="h-3.5 w-3.5" /> Estimate my order
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 bg-cream-100 dark:border-white/10 dark:bg-white/5">
                  <th className="px-5 py-4 font-semibold text-navy-900 dark:text-white">
                    Weight tier
                  </th>
                  {rateKeys.map((r) => (
                    <th
                      key={r.key}
                      className="px-5 py-4 text-right font-semibold text-navy-900 dark:text-white"
                    >
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5 dark:divide-white/5">
                {weightTiers.map((tier) => (
                  <tr
                    key={tier.id}
                    className="transition hover:bg-cream-100/60 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-semibold text-navy-900 dark:text-white">
                      {tier.label}
                    </td>
                    {rateKeys.map((r) => (
                      <td
                        key={r.key}
                        className="px-5 py-4 text-right tabular-nums text-slate-600 dark:text-slate-300"
                      >
                        {fmtRate(tier.id, tier.rates[r.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-navy-900/10 px-5 py-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            {perKgNote}
          </p>
        </div>

        {/* Free shipping note */}
        <div className="mt-4 flex items-start gap-4 rounded-3xl border border-dashed border-leaf-500/40 bg-leaf-50 p-5 dark:border-leaf-500/30 dark:bg-leaf-500/10">
          <BadgePercent className="mt-0.5 h-6 w-6 shrink-0 text-leaf-600 dark:text-leaf-300" />
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="text-navy-900 dark:text-white">
              Free shipping over $50 — {FREE_SHIP_CODE}.
            </strong>{' '}
            {freeShippingNote}
          </p>
        </div>
      </section>

      {/* Weight & dimension limits */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Weight & dimension limits</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Per single parcel dispatched from India. Larger hauls are split automatically.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parcelLimits.map((limit, i) => {
            const Icon = limitIcons[limit.id as keyof typeof limitIcons] ?? Package
            return (
              <Reveal key={limit.id} delay={i * 60}>
                <div className="flex h-full flex-col rounded-3xl border border-navy-900/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {limit.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-navy-900 dark:text-white">
                    {limit.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {limit.detail}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Restricted / prohibited items */}
      <section className="mt-14">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-tangerine-500" />
          <h2 className="text-2xl font-bold tracking-tight">Restricted & prohibited items</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Common India → international proxy rules. When in doubt, ask support before you pay the
          item fee.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restrictions.map((group, i) => {
            const prohibited = group.level === 'prohibited'
            return (
              <Reveal key={group.id} delay={i * 50}>
                <div className="flex h-full flex-col rounded-3xl border border-navy-900/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-navy-900 dark:text-white">
                      {group.title}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        prohibited
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
                          : 'bg-tangerine-100 text-tangerine-700 dark:bg-tangerine-500/15 dark:text-tangerine-300'
                      }`}
                    >
                      {prohibited ? (
                        <>
                          <Ban className="h-3 w-3" /> Prohibited
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3" /> Restricted
                        </>
                      )}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            prohibited ? 'bg-red-400' : 'bg-tangerine-400'
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 text-white shadow-lg shadow-navy-900/25 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to estimate your landed cost?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Paste a product link and we'll show the item fee up front. After your haul reaches
                India, you'll get a real-weight shipping quote before you pay a cent of postage.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/capture"
                className="inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
              >
                <Calculator className="h-4 w-4" /> Estimate an order
              </Link>
              <Link
                to="/support?topic=shipping"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Ask about shipping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

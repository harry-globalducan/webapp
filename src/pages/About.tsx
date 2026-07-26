import { Link } from 'react-router-dom'
import {
  Globe2,
  Target,
  Eye,
  ShieldCheck,
  Users,
  Package,
  Handshake,
  Sparkles,
  ArrowRight,
  Building2,
  Plane,
  BadgeDollarSign,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

const stats = [
  { value: '20+', label: 'Countries served' },
  { value: '25k+', label: 'Global shoppers' },
  { value: '120k+', label: 'Parcels delivered' },
  { value: '4.8★', label: 'Average rating' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Transparency first',
    text: 'Two-step pricing with duties estimated upfront. You always know the landed cost before you pay — no hidden markup on the product price.',
    tint: 'bg-leaf-100 text-leaf-600 dark:bg-leaf-500/15 dark:text-leaf-300',
  },
  {
    icon: Package,
    title: 'Care for every parcel',
    text: 'Every item is received, photographed and quality-checked at our India warehouse before it ships across the ocean.',
    tint: 'bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300',
  },
  {
    icon: Handshake,
    title: 'Partnership-led',
    text: 'We work hand-in-hand with national postal services — Maldives Post, Bhutan Post and Mauritius Post — for reliable last-mile delivery.',
    tint: 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200',
  },
]

const leadership = [
  {
    role: 'Founder & CEO',
    focus: 'Vision, partnerships and market expansion across the Indian Ocean and Gulf.',
    icon: Sparkles,
  },
  {
    role: 'Head of Operations',
    focus: 'India warehouse, consolidation, quality checks and outbound logistics.',
    icon: Package,
  },
  {
    role: 'Head of Technology',
    focus: 'The Ducan platform — web, mobile apps and the Buy with Ducan extension.',
    icon: Globe2,
  },
  {
    role: 'Head of Customer Experience',
    focus: 'Multi-timezone support, returns, refunds and shopper trust.',
    icon: Users,
  },
]

const milestones = [
  { year: 'Founded', text: 'Global Ducan starts with one idea: make Indian e-commerce reachable from anywhere.' },
  { year: 'Warehouse', text: 'Our India consolidation hub opens — multi-store parcels become one shipment.' },
  { year: 'Partnerships', text: 'National post partnerships launch across Maldives, Bhutan and Mauritius.' },
  { year: 'Today', text: 'Apps on iOS and Android, a Chrome extension, and 120k+ parcels delivered.' },
]

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-tangerine-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-navy-500/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-300 ring-1 ring-inset ring-white/15">
              <Building2 className="h-3.5 w-3.5" /> About us
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              E-commerce, <span className="text-tangerine-400">globalized.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Global Ducan is a proxy shopping and shipping service that lets people outside India
              buy from India&apos;s biggest online stores — Amazon.in, Myntra, Nykaa, Flipkart and
              more — and have everything delivered to their door as one consolidated parcel.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* The business */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Our business" title="What" accent="we do" />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                <p>
                  Millions of people live away from India but still want the brands they grew up
                  with — a Banarasi saree from Varanasi, Nykaa skincare, a boAt smartwatch, FirstCry
                  essentials for a new baby. The problem is that most Indian stores don&apos;t ship
                  internationally, and those that do charge per-parcel rates that make it
                  impractical.
                </p>
                <p>
                  Global Ducan solves that. You shop on the real store — through our Chrome
                  extension or simply by pasting a product link — and we buy on your behalf. Your
                  items arrive at our India warehouse, where we photograph and quality-check them,
                  then consolidate everything into a single box with one tracking number.
                </p>
                <p>
                  You pay in two clear steps: the item fee upfront so we can purchase, then
                  international shipping once we know the real weight. Duties are estimated before
                  you commit, so there are no surprises at your door.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-navy-900/5 bg-cream-50 p-6 dark:border-white/5 dark:bg-white/5">
                <Plane className="h-6 w-6 text-tangerine-500" />
                <h3 className="mt-3 text-base font-semibold">One box, one tracking number</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Consolidation across multiple stores cuts international shipping cost
                  dramatically versus shipping each order separately.
                </p>
              </div>
              <div className="rounded-3xl border border-navy-900/5 bg-cream-50 p-6 dark:border-white/5 dark:bg-white/5">
                <BadgeDollarSign className="h-6 w-6 text-leaf-500" />
                <h3 className="mt-3 text-base font-semibold">Pay in your own currency</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Transparent FX with landed-cost clarity, so the price you see is the price you
                  pay.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-8 dark:border-white/5 dark:bg-white/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold">Our mission</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  To remove every barrier between Indian e-commerce and the people who want it —
                  making cross-border shopping as simple, affordable and trustworthy as ordering
                  from a store down the road.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-8 dark:border-white/5 dark:bg-white/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
                  <Eye className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold">Our vision</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  To become the default gateway to India&apos;s marketplaces for the Indian Ocean,
                  the Gulf and beyond — a trusted bridge where any shopper, in any country, can buy
                  from any Indian store with one account and one cart.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="What we stand for" title="Our" accent="values" />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/10 dark:border-white/5 dark:bg-white/5">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${v.tint}`}>
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {v.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Our journey" title="How we" accent="got here" />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 90}>
                <div className="relative h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-6 dark:border-white/5 dark:bg-white/5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-tangerine-600 dark:text-tangerine-300">
                    {m.year}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {m.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Management" title="The team behind" accent="Global Ducan" />
          <p className="mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            A lean, cross-border team spanning our India operations hub and our destination
            markets.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((p, i) => (
            <Reveal key={p.role} delay={i * 90}>
              <div className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/10 dark:border-white/5 dark:bg-white/5">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-white dark:bg-tangerine-500">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{p.role}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {p.focus}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-8 py-12 text-center text-white sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-tangerine-500/20 blur-3xl" />
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Questions about Global Ducan?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              Our team is online across time zones — we&apos;re happy to help with orders,
              shipping or customs.
            </p>
            <Link
              to="/support"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-tangerine-400"
            >
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

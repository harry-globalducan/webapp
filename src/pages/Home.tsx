import { useMemo, useState } from 'react'
import {
  Package,
  TicketPercent,
  Users,
  MapPin,
  Headphones,
  Link2,
  ShieldCheck,
  Globe2,
  Plane,
  BadgeDollarSign,
  Gift,
  Heart,
  Star,
  Quote,
  Puzzle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/stores'
import { useHomeData } from '../context/HomeDataContext'
import type { PromoBanner } from '../data/banners'
import StoreCard, { FeaturedStoreCard } from '../components/StoreCard'
import AddProductPanel from '../components/AddProductPanel'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import PromoCarousel from '../components/PromoCarousel'
import AppDownload from '../components/AppDownload'
import HeroBento from '../components/HeroBento'


const quickActions = [
  { icon: Package, label: 'Orders', to: '/orders', tint: 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200' },
  { icon: TicketPercent, label: 'Coupons', to: '/coupons', tint: 'bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/20 dark:text-tangerine-300' },
  { icon: Users, label: 'Refer', to: '/refer', tint: 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200' },
  { icon: MapPin, label: 'Addresses', to: '/addresses', tint: 'bg-leaf-100 text-leaf-600 dark:bg-leaf-500/20 dark:text-leaf-300' },
  { icon: Headphones, label: 'Support', to: '/support', tint: 'bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/20 dark:text-tangerine-300' },
]

const steps = [
  {
    icon: Globe2,
    title: 'Shop on the real store',
    text: 'Open Amazon.in, Myntra, Nykaa and more — browse their full catalog as usual.',
  },
  {
    icon: Link2,
    title: 'Buy with Ducan',
    text: 'Use our Chrome extension on the product page, or paste the link into Ducan.',
  },
  {
    icon: Package,
    title: 'We buy & receive in India',
    text: 'Items land at our India warehouse. We photograph them before anything ships.',
  },
  {
    icon: ShieldCheck,
    title: 'Consolidate & pick shipping',
    text: 'Combine multi-store parcels and choose EMS, DHL or Air — shipping is quoted by weight.',
  },
  {
    icon: Plane,
    title: 'We ship worldwide',
    text: 'Door-to-door delivery with duties estimated upfront in your currency.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Track & enjoy',
    text: 'Follow progress from Buying → Warehouse → In transit → Delivered.',
  },
]

const recentlyShipped = [
  '🎧 boAt Airdopes → Malé',
  '🥻 Banarasi Saree → Dubai',
  '🧴 Derma Co SPF50 → Victoria',
  '⌚ Noise Smartwatch → Thimphu',
  '👗 Anarkali Set → Port Louis',
  '💄 Nykaa Beauty Box → Riyadh',
  '🧥 Denim Jacket → Kathmandu',
  '👶 FirstCry Rompers → Colombo',
]

const testimonials = [
  {
    quote: 'Ordered Nykaa skincare and a Banarasi saree from Mumbai — landed in Port Louis at the exact price quoted, no customs surprise.',
    name: 'Devi R.',
    where: 'Port Louis, Mauritius',
  },
  {
    quote: "Shopping Amazon.in from Malé feels local now. One box, one tracking number all the way to the islands.",
    name: 'Aishath R.',
    where: 'Malé, Maldives',
  },
  {
    quote: 'Three stores consolidated into a single parcel to Victoria — half of what I would have paid shipping each one myself.',
    name: 'Anjali P.',
    where: 'Victoria, Seychelles',
  },
  {
    quote: 'Fast delivery to Thimphu and duties shown upfront in my currency. Finally a reliable way to shop India.',
    name: 'Tashi D.',
    where: 'Thimphu, Bhutan',
  },
]

const stats = [
  { value: '20+', label: 'Countries served' },
  { value: '25k+', label: 'Global shoppers' },
  { value: '120k+', label: 'Parcels delivered' },
  { value: '4.8★', label: 'Average rating' },
]

function ShippedTicker() {
  const items = [...recentlyShipped, ...recentlyShipped]
  return (
    <div className="relative mt-12 overflow-hidden border-y border-navy-900/5 bg-white/60 py-3 backdrop-blur dark:border-white/5 dark:bg-white/5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const { stores, banners: apiBanners } = useHomeData()

  // Only banners from GET /api/v1/home/banners are shown — no local placeholders.
  const carouselBanners = useMemo(
    () =>
      apiBanners
        .filter((b) => b.imageUrl)
        .map<PromoBanner>((b) => ({
          id: `api-${b.id}`,
          eyebrow: '',
          title: b.title ?? 'Global Ducan',
          subtitle: '',
          ctaLabel: '',
          to: '',
          tone: 'navy',
          placement: 'home',
          visual: 'image',
          imageUrl: b.imageUrl,
        })),
    [apiBanners],
  )

  const featured = stores.filter((s) => s.preferred)
  const visibleStores = (
    activeCategory === 'All' ? stores : stores.filter((s) => s.category === activeCategory)
  ).filter((s) => activeCategory !== 'All' || !s.preferred)

  return (
    <main>
      {/* Hero — cream grid background lives only here */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-navy-200/60 via-navy-100/40 to-transparent blur-2xl dark:from-navy-600/30 dark:via-navy-800/20" />
        <div className="pointer-events-none absolute -left-32 top-40 h-72 w-72 rounded-full bg-tangerine-200/40 blur-3xl dark:bg-tangerine-500/10" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-4 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-10 bg-tangerine-500" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-tangerine-600">
                  Global shopping
                </span>
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-[1.03] tracking-tight sm:text-7xl">
                Shop India,
                <br />
                shipped <span className="text-tangerine-500">home.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Browse Amazon, Myntra, Nykaa and more on their real sites — then Buy with Ducan via
                our Chrome extension or by pasting the product link.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/ways-to-shop"
                  className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-800/20 transition hover:-translate-y-0.5 hover:bg-navy-700 dark:bg-tangerine-500 dark:shadow-tangerine-500/20 dark:hover:bg-tangerine-400"
                >
                  <Puzzle className="h-4 w-4" /> Get the Chrome extension
                </Link>
                <a
                  href="#stores"
                  className="inline-flex items-center gap-2 rounded-full border border-navy-900/12 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:-translate-y-0.5 hover:border-navy-300 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30"
                >
                  Browse stores
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Or paste any product link into the search bar above to add it to your cart.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-leaf-500" /> Buyer protection
                </span>
                <span className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-leaf-500" /> Indian Ocean & Gulf
                </span>
                <span className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-leaf-500" /> Transparent landed cost
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <HeroBento />
            </div>
          </Reveal>
        </div>

        <ShippedTicker />
      </section>

      <AppDownload />

      {/* Promo offers carousel */}
      {carouselBanners.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <Reveal>
            <PromoCarousel banners={carouselBanners} />
          </Reveal>
        </section>
      )}

      {/* White band: quick actions + how it works */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 rounded-3xl border border-navy-900/5 bg-cream-50 p-4 sm:grid-cols-5 dark:border-white/5 dark:bg-white/5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl px-4 py-5 transition hover:bg-white dark:hover:bg-white/5"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.tint} transition duration-300 group-hover:scale-110`}
                  >
                    <action.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-navy-800 dark:text-white">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          <div className="mt-20">
            <Reveal>
              <SectionHeading eyebrow="How it works" title="Shop India," accent="we handle the rest" />
            </Reveal>
            <div className="relative mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {/* animated connector line behind the icons (desktop) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-[16%] top-9 hidden h-px bg-[repeating-linear-gradient(to_right,var(--color-navy-300)_0_6px,transparent_6px_14px)] opacity-40 lg:block dark:bg-[repeating-linear-gradient(to_right,var(--color-white)_0_6px,transparent_6px_14px)] dark:opacity-15"
              />
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 90}>
                  <div className="group relative flex flex-col items-center px-2 text-center">
                    <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-3xl bg-navy-800 text-white shadow-lg shadow-navy-900/20 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl dark:bg-tangerine-500 dark:shadow-tangerine-500/25">
                      {/* pulsing halo */}
                      <span className="absolute inset-0 rounded-3xl bg-navy-800 animate-pulse-ring dark:bg-tangerine-500" />
                      <step.icon className="relative h-7 w-7" />
                      {/* step number */}
                      <span className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-navy-800 shadow ring-1 ring-navy-900/5 dark:text-tangerine-600">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stores */}
      <section id="stores" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionHeading eyebrow="Partner stores" title="Shop on the" accent="real site" />
              <p className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                We’ll remind you how to Buy with Ducan before opening the store — Chrome extension or
                paste the product link.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === cat
                      ? 'bg-navy-800 text-white shadow-lg shadow-navy-800/20 dark:bg-white dark:text-navy-900'
                      : 'border border-navy-900/10 bg-white text-navy-800/70 hover:border-navy-300 dark:border-white/10 dark:bg-black dark:text-white dark:hover:border-white/25'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {activeCategory === 'All' && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featured.map((store, i) => (
              <Reveal key={store.name} delay={i * 120}>
                <FeaturedStoreCard store={store} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={120}>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {visibleStores.map((store) => (
              <StoreCard key={store.name} store={store} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Add product by URL */}
      <section id="add-product" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-4 sm:px-6">
        <Reveal>
          <AddProductPanel />
        </Reveal>
      </section>

      {/* Social proof band */}
      <section className="mt-20 bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <figure className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-7 dark:border-white/5 dark:bg-white/5">
                  <Quote className="h-6 w-6 text-tangerine-400" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-navy-900 dark:text-white">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.where}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-tangerine-400 text-tangerine-400" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Perks" title="More from" accent="Ducan" />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Gift,
              iconColor: 'text-tangerine-300',
              title: 'Refer friends & save',
              text: 'Earn wallet credit for every friend who places their first order.',
            },
            {
              icon: Heart,
              iconColor: 'text-tangerine-300',
              title: 'Follow us for offers',
              text: 'Weekly drops, coupon codes and store spotlights on our socials.',
            },
            {
              icon: BadgeDollarSign,
              iconColor: 'text-leaf-300',
              title: 'Pay in your local currency',
              text: 'Transparent FX with no surprise fees — USD, EUR, AED and more.',
            },
          ].map((perk, i) => (
            <Reveal key={perk.title} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/30">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-navy-500/30 blur-2xl transition duration-500 group-hover:bg-tangerine-500/20" />
                <perk.icon className={`h-7 w-7 ${perk.iconColor}`} />
                <h3 className="mt-4 font-display text-xl font-semibold text-white">{perk.title}</h3>
                <p className="mt-1.5 text-sm text-white/60">{perk.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

import { useState } from 'react'
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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { stores, categories } from '../data/stores'
import { bannersFor } from '../data/banners'
import StoreCard, { FeaturedStoreCard } from '../components/StoreCard'
import AddProductPanel from '../components/AddProductPanel'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import PromoCarousel from '../components/PromoCarousel'
import PromoStrip from '../components/PromoStrip'
import AppDownload from '../components/AppDownload'
import ProxySearch from '../components/ProxySearch'
import Globe3D from '../components/Globe3D'

const homeBanners = bannersFor('home')
const storesBanner = bannersFor('home-stores')[0]

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
    text: 'Combine multi-store parcels, choose EMS, DHL or Air, then pay intl. shipping.',
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
  '🎧 boAt Airdopes → Toronto',
  '🥻 Banarasi Saree → Dubai',
  '🧴 Derma Co SPF50 → London',
  '⌚ Noise Smartwatch → Singapore',
  '👗 Anarkali Set → New Jersey',
  '💄 Nykaa Beauty Box → Sydney',
  '🧥 Denim Jacket → Berlin',
  '👶 FirstCry Rompers → Auckland',
]

const testimonials = [
  {
    quote: 'Ordered a silk saree from Varanasi to Dubai. Landed exactly at the price they quoted — no customs surprise.',
    name: 'Priya M.',
    where: 'Dubai, UAE',
  },
  {
    quote: "The share-to-app flow is magic. I shop Myntra on my phone like I'm still in Mumbai.",
    name: 'Ankit S.',
    where: 'Toronto, Canada',
  },
  {
    quote: 'Three stores, one box, one tracking number. Half the shipping cost of doing it myself.',
    name: 'Sarah K.',
    where: 'London, UK',
  },
]

const stats = [
  { value: '180+', label: 'Countries served' },
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
              <h1 className="mt-6 text-5xl font-bold leading-[0.98] tracking-tighter sm:text-7xl xl:text-[5.25rem]">
                Shop India.
                <br />
                Shipped <span className="italic text-tangerine-500">home.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Browse Amazon, Myntra, Nykaa and more on their real sites — then Buy with Ducan via
                our Chrome extension or by pasting the product link.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-8 max-w-lg">
                <ProxySearch variant="hero" />
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Paste a product link to add it here — or{' '}
                  <Link to="/ways-to-shop" className="font-semibold text-navy-600 hover:underline dark:text-navy-200">
                    install the Chrome extension
                  </Link>{' '}
                  and shop on the store itself.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-leaf-500" /> Buyer protection
                </span>
                <span className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-leaf-500" /> Indian Ocean & Gulf
                </span>
                <span className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-leaf-500" /> Two-step proxy pricing
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <Globe3D />
            </div>
          </Reveal>
        </div>

        <ShippedTicker />
      </section>

      <AppDownload />

      {/* Promo offers carousel */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Reveal>
          <PromoCarousel banners={homeBanners} />
        </Reveal>
      </section>

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
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <div className="relative h-full overflow-hidden rounded-3xl border border-navy-900/5 bg-cream-50 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/10 dark:border-white/5 dark:bg-white/5">
                    <span className="absolute -right-3 -top-6 font-display text-[90px] font-bold text-navy-900/5 dark:text-white/5">
                      {i + 1}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-white dark:bg-tangerine-500">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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
        {storesBanner && (
          <Reveal>
            <div className="mb-8">
              <PromoStrip banner={storesBanner} />
            </div>
          </Reveal>
        )}
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

          <div className="mt-14 grid gap-4 md:grid-cols-3">
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

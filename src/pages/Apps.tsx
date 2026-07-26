import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Smartphone,
  Link2,
  PackageSearch,
  BadgeDollarSign,
  BellRing,
  ShieldCheck,
  ShoppingBag,
  QrCode,
  Star,
  Download,
  ScanLine,
  Plane,
} from 'lucide-react'
import { appStores, qrCodeUrl } from '../data/apps'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M3.6 2.2c-.3.2-.6.6-.6 1.1v17.4c0 .5.3.9.6 1.1l.1.1 9.7-9.7v-.2L3.7 2.1l-.1.1Zm12.1 7-2.5 2.5 2.5 2.5 3.1-1.8c.9-.5.9-1.3 0-1.8l-3.1-1.4ZM4.9 21.6l8.5-8.5-2.3-2.3-7.4 7.4c.2.8.6 1.2 1.2 1.4Zm0-19.2c-.6.2-1 .6-1.2 1.4l7.4 7.4 2.3-2.3L4.9 2.4Z" />
    </svg>
  )
}

function StoreButton({
  href,
  label,
  sub,
  icon,
  dark,
}: {
  href: string
  label: string
  sub: string
  icon: ReactNode
  dark?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex min-w-[10.5rem] items-center gap-3 rounded-2xl px-4 py-2.5 transition hover:-translate-y-0.5 ${
        dark
          ? 'bg-white text-navy-900 shadow-lg shadow-navy-900/20 hover:bg-cream-100'
          : 'border border-navy-900/10 bg-white text-navy-900 hover:border-navy-400 dark:border-white/15 dark:bg-white/5 dark:text-white'
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center">{icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-medium uppercase tracking-wider opacity-60">
          {sub}
        </span>
        <span className="block text-sm font-bold">{label}</span>
      </span>
    </a>
  )
}

const features = [
  {
    icon: Link2,
    title: 'Paste any product link',
    text: 'Amazon, Myntra, Nykaa, Flipkart and more — drop a link and we buy it for you.',
    tint: 'bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300',
  },
  {
    icon: PackageSearch,
    title: 'Live parcel tracking',
    text: 'Follow every order from Buying → Warehouse → In transit → Delivered.',
    tint: 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200',
  },
  {
    icon: BadgeDollarSign,
    title: 'Pay in your currency',
    text: 'Transparent FX and duties estimated upfront — no surprises at customs.',
    tint: 'bg-leaf-100 text-leaf-600 dark:bg-leaf-500/15 dark:text-leaf-300',
  },
  {
    icon: BellRing,
    title: 'Push notifications',
    text: 'Price drops, warehouse photos and shipping updates the moment they happen.',
    tint: 'bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300',
  },
  {
    icon: ShoppingBag,
    title: 'One global cart',
    text: 'Combine parcels from multiple stores into a single consolidated shipment.',
    tint: 'bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200',
  },
  {
    icon: ShieldCheck,
    title: 'Buyer protection',
    text: 'We photograph and check every item at our India warehouse before it ships.',
    tint: 'bg-leaf-100 text-leaf-600 dark:bg-leaf-500/15 dark:text-leaf-300',
  },
]

/** Play Store screenshots — drop the image files in /public/app-screens (see README there). */
const screenshots = [
  { src: '/app-screens/1-shop-anywhere.webp', alt: 'Shop India from anywhere — app home' },
  { src: '/app-screens/2-stores.webp', alt: '20+ Indian stores, one cart' },
  { src: '/app-screens/3-orders.webp', alt: 'All shipments, one view' },
  { src: '/app-screens/4-tracking.webp', alt: 'Every item, every step — live tracking' },
  { src: '/app-screens/5-profile.webp', alt: 'One profile, every store' },
  { src: '/app-screens/6-coupons.webp', alt: 'Save on every order with coupons' },
]

function Screenshot({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex h-[540px] w-[260px] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-navy-300/50 bg-white text-center text-navy-400 shadow-sm dark:border-white/15 dark:bg-white/5">
        <Smartphone className="h-9 w-9" />
        <span className="px-6 text-sm font-semibold text-navy-700 dark:text-white/80">{alt}</span>
        <span className="px-6 text-[11px] leading-relaxed text-slate-400">
          Add this screenshot to<br />/public/app-screens
        </span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
      className="h-[540px] w-auto shrink-0 snap-center rounded-[2rem] shadow-xl shadow-navy-900/10 ring-1 ring-navy-900/5 dark:ring-white/10"
    />
  )
}

const steps = [
  { icon: ScanLine, title: 'Scan the QR', text: 'Point your camera at the code — it opens the right store for your device.' },
  { icon: Download, title: 'Install the app', text: 'Grab it free from the App Store or Google Play in a couple of taps.' },
  { icon: Plane, title: 'Shop & ship', text: 'Sign in, paste a link, and get India delivered to your door worldwide.' },
]

/** Phone mockup showing a mini Global Ducan app screen. */
function PhoneMock() {
  return (
    <div className="relative mx-auto w-[260px] shrink-0">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-tangerine-400/25 via-navy-400/15 to-transparent blur-2xl" />
      <div className="relative rounded-[2.6rem] border-[6px] border-navy-950 bg-navy-950 shadow-2xl shadow-navy-900/40 dark:border-black dark:bg-black">
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy-950 dark:bg-black" />
        <div className="overflow-hidden rounded-[2.1rem] bg-cream-50 dark:bg-[#131921]">
          {/* app top bar */}
          <div className="flex items-center justify-between bg-gradient-to-r from-navy-900 to-navy-800 px-4 pb-3 pt-7 text-white">
            <span className="font-display text-sm font-bold tracking-tight">Ducan</span>
            <ShoppingBag className="h-4 w-4 text-tangerine-300" />
          </div>
          {/* search */}
          <div className="px-3 pt-3">
            <div className="flex items-center gap-2 rounded-xl border border-navy-900/10 bg-white px-3 py-2 text-[10px] text-slate-400 dark:border-white/10 dark:bg-white/5">
              <Link2 className="h-3 w-3" /> Paste a product link…
            </div>
          </div>
          {/* tracking card */}
          <div className="mx-3 mt-3 rounded-xl bg-white p-3 shadow-sm dark:bg-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-400">Order #GD-2903</span>
              <span className="rounded-full bg-leaf-100 px-1.5 py-0.5 text-[8px] font-bold text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300">
                In transit
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-navy-900 dark:text-white">
              <Plane className="h-3 w-3 text-tangerine-500" /> India → UAE
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy-900/10 dark:bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-tangerine-500 to-tangerine-400" />
            </div>
          </div>
          {/* product tiles */}
          <div className="grid grid-cols-2 gap-2 p-3">
            {['🎧', '🥻', '⌚', '💄'].map((e, i) => (
              <div
                key={i}
                className="flex h-14 items-center justify-center rounded-xl bg-white text-2xl shadow-sm dark:bg-white/5"
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Apps() {
  const qrSrc = qrCodeUrl(appStores.landing, 160)

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-tangerine-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-navy-500/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-300 ring-1 ring-inset ring-white/15">
                <Smartphone className="h-3.5 w-3.5" /> Mobile app
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl">
                Shop India from
                <br />
                your <span className="text-tangerine-400">pocket.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
                Paste product links, track parcels, and pay in your own currency — the whole
                Global Ducan experience, built for shopping on the go.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <StoreButton
                  href={appStores.ios.href}
                  label={appStores.ios.label}
                  sub="Download on the"
                  icon={<AppleIcon className="h-6 w-6" />}
                  dark
                />
                <StoreButton
                  href={appStores.android.href}
                  label={appStores.android.label}
                  sub="Get it on"
                  icon={<PlayIcon className="h-6 w-6" />}
                  dark
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-tangerine-400 text-tangerine-400" />
                    ))}
                  </span>
                  4.8 rating
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-leaf-400" /> 100k+ installs
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-leaf-400" /> iOS &amp; Android
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="flex items-center justify-center gap-6">
              <PhoneMock />
              {/* QR card */}
              <div className="hidden shrink-0 rounded-3xl bg-white p-4 text-center text-navy-900 shadow-xl sm:block">
                <div className="rounded-2xl border border-navy-900/8 p-2">
                  <img
                    src={qrSrc}
                    alt="QR code to download the Global Ducan app"
                    width={140}
                    height={140}
                    className="h-[140px] w-[140px] rounded-lg"
                  />
                </div>
                <p className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold">
                  <QrCode className="h-3.5 w-3.5 text-tangerine-500" /> Scan to install
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Why the app" title="Everything you need," accent="in one tap" />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-navy-900/5 bg-cream-50 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/10 dark:border-white/5 dark:bg-white/5">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.tint}`}>
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Screenshot gallery */}
      <section className="overflow-hidden bg-cream-50 py-20 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Take a look" title="A closer look at" accent="the app" />
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* leading spacer so the first shot aligns with the container */}
            <div className="hidden w-[max(0px,calc((100vw-80rem)/2))] shrink-0 sm:block" />
            {screenshots.map((s) => (
              <Screenshot key={s.src} src={s.src} alt={s.alt} />
            ))}
          </div>
        </Reveal>
        <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6">
          <p className="text-xs text-slate-400">← Swipe to browse app screens</p>
        </div>
      </section>

      {/* Get started + QR */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Reveal>
                <SectionHeading eyebrow="Get started" title="Up and running in" accent="under a minute" />
              </Reveal>
              <div className="mt-8 space-y-5">
                {steps.map((step, i) => (
                  <Reveal key={step.title} delay={i * 100}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-800 text-white dark:bg-tangerine-500">
                        <step.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="flex items-center gap-2 text-base font-semibold">
                          <span className="text-tangerine-500">{i + 1}.</span> {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={150}>
              <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl border border-navy-900/8 bg-cream-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
                <div className="rounded-2xl border border-navy-900/8 bg-white p-3 dark:border-white/10">
                  <img
                    src={qrCodeUrl(appStores.landing, 180)}
                    alt="QR code to download the Global Ducan app"
                    width={180}
                    height={180}
                    className="h-[180px] w-[180px] rounded-lg"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-navy-900 dark:text-white">
                  Scan with your phone camera
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Opens the download page — choose App Store or Google Play.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <StoreButton
                    href={appStores.ios.href}
                    label={appStores.ios.label}
                    sub="Download on the"
                    icon={<AppleIcon className="h-5 w-5" />}
                  />
                  <StoreButton
                    href={appStores.android.href}
                    label={appStores.android.label}
                    sub="Get it on"
                    icon={<PlayIcon className="h-5 w-5" />}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-8 py-12 text-center text-white sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-tangerine-500/20 blur-3xl" />
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Not near your phone?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              You can start shopping right now on the web — the app just makes it pocket-sized.
            </p>
            <Link
              to="/ways-to-shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-tangerine-400"
            >
              Start shopping on the web
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

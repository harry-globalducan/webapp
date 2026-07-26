import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Smartphone, ArrowRight } from 'lucide-react'
import { appStores, qrCodeUrl } from '../data/apps'

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
}: {
  href: string
  label: string
  sub: string
  icon: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-[11.5rem] items-center gap-3 rounded-full border border-navy-900/10 bg-white px-4 py-2.5 text-navy-900 transition hover:border-navy-400 dark:border-white/15 dark:bg-black dark:text-white dark:hover:border-white/30"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-navy-800 dark:text-white">
        {icon}
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
          {sub}
        </span>
        <span className="block text-sm font-semibold">{label}</span>
      </span>
    </a>
  )
}

export default function AppDownload() {
  const qrSrc = qrCodeUrl(appStores.landing, 148)

  return (
    <section className="border-y border-navy-900/5 bg-white dark:border-white/5 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-600">
            <Smartphone className="h-3.5 w-3.5" />
            Mobile app
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl dark:text-white">
            Shop India from your phone
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Paste product links, track parcels, and pay in your currency — built for shopping on
            the go. Available on iOS and Android.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <StoreButton
              href={appStores.ios.href}
              label={appStores.ios.label}
              sub="Download on the"
              icon={<AppleIcon className="h-6 w-6" />}
            />
            <StoreButton
              href={appStores.android.href}
              label={appStores.android.label}
              sub="Get it on"
              icon={<PlayIcon className="h-6 w-6" />}
            />
          </div>
          <Link
            to="/apps"
            className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-600 transition hover:text-tangerine-600 dark:text-navy-200 dark:hover:text-tangerine-300"
          >
            Explore app features
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-3 dark:border-white/10 dark:bg-black">
            <img
              src={qrSrc}
              alt="QR code to download the Global Ducan app"
              width={132}
              height={132}
              className="h-[132px] w-[132px] rounded-lg"
              loading="lazy"
            />
          </div>
          <p className="max-w-[9rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Scan to open the download page, then choose App Store or Google Play.
          </p>
        </div>
      </div>
    </section>
  )
}

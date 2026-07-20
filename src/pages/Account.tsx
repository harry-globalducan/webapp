import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Wallet,
  MapPin,
  KeyRound,
  TicketPercent,
  Users,
  Headphones,
  Heart,
  SlidersHorizontal,
  Info,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogIn,
} from 'lucide-react'
import AccountLayout from '../components/AccountLayout'

const hubCards = [
  {
    icon: Package,
    title: 'Your orders',
    text: 'Track packages, view details, buy again or start a return.',
    to: '/orders',
  },
  {
    icon: Wallet,
    title: 'Wallet & payments',
    text: 'Balances, SWIFT deposits, transactions and refunds.',
    to: '/wallet',
  },
  {
    icon: KeyRound,
    title: 'Login & security',
    text: 'Email, password and account protection settings.',
    to: '/login',
  },
  {
    icon: MapPin,
    title: 'Addresses',
    text: 'Delivery addresses for every country you ship to.',
    to: '/addresses',
  },
  {
    icon: Heart,
    title: 'Wishlist',
    text: 'Saved products ready to move into your cart.',
    to: '/wishlist',
  },
  {
    icon: TicketPercent,
    title: 'Coupons & offers',
    text: 'Active coupons, promo codes and store deals.',
    to: '/coupons',
  },
  {
    icon: Users,
    title: 'Refer & earn',
    text: 'Share your link, earn wallet credit for every friend.',
    to: '/refer',
  },
  {
    icon: Headphones,
    title: 'Support',
    text: 'Chat with us about orders, shipping or customs.',
    to: '/support',
  },
]

const legalRows = [
  { icon: Info, label: 'About Global Ducan' },
  { icon: FileText, label: 'Terms & conditions' },
  { icon: ShieldCheck, label: 'Privacy policy' },
]

export default function Account() {
  const [showTutorial, setShowTutorial] = useState(true)

  return (
    <AccountLayout title="Your account" description="Everything about your Ducan account in one place.">
      {/* Guest banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-900/10 bg-white dark:border-white/10 dark:bg-black p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 font-display text-xl font-bold text-white dark:bg-tangerine-500">
            G
          </span>
          <div>
            <div className="font-display text-lg font-semibold text-navy-900 dark:text-white">
              Guest
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to sync your cart, orders and wallet across devices.
            </div>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-800/20 transition hover:bg-navy-700 dark:bg-tangerine-500 dark:shadow-tangerine-500/20 dark:hover:bg-tangerine-400"
        >
          <LogIn className="h-4 w-4" /> Login / Sign up
        </Link>
      </div>

      {/* Hub cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group relative rounded-2xl border border-navy-900/10 bg-white dark:border-white/10 dark:bg-black p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg hover:shadow-navy-900/10 dark:hover:border-white/25"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200 transition group-hover:scale-105">
              <card.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{card.text}</p>
          </Link>
        ))}
      </div>

      {/* Preferences + legal */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Preferences</h2>
          <div className="mt-3 flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white dark:border-white/10 dark:bg-black px-5 py-4 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-navy-900 dark:text-white">Show tutorial</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Shown on next store visit</span>
            </span>
            <button
              role="switch"
              aria-checked={showTutorial}
              onClick={() => setShowTutorial(!showTutorial)}
              className={`relative h-7 w-12 rounded-full transition ${
                showTutorial ? 'bg-navy-600' : 'bg-slate-300 dark:bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  showTutorial ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">About & legal</h2>
          <div className="mt-3 divide-y divide-navy-900/5 dark:divide-white/10 overflow-hidden rounded-2xl border border-navy-900/10 bg-white dark:border-white/10 dark:bg-black shadow-sm">
            {legalRows.map((row) => (
              <button
                key={row.label}
                className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition hover:bg-cream-100 dark:hover:bg-white/5"
              >
                <row.icon className="h-4 w-4 text-navy-400" />
                <span className="flex-1 text-sm font-semibold text-navy-900 dark:text-white">{row.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </AccountLayout>
  )
}

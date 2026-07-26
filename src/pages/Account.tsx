import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  Wallet,
  MapPin,
  UserRound,
  TicketPercent,
  Users,
  Headphones,
  Heart,
  SlidersHorizontal,
  Fingerprint,
  Info,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import { useAuth } from '../context/AuthContext'

const hubCards = [
  { icon: UserRound, title: 'Profile', text: 'Manage your profile, addresses and details.', to: '/addresses' },
  { icon: Users, title: 'Refer & Save', text: 'Refer friends and save on your orders.', to: '/refer' },
  { icon: TicketPercent, title: 'My Coupons', text: 'Active coupons, promo codes and store deals.', to: '/coupons' },
  { icon: Package, title: 'Your orders', text: 'Track packages, view details or buy again.', to: '/orders' },
  { icon: Wallet, title: 'Wallet & payments', text: 'Balances, deposits, transactions and refunds.', to: '/wallet' },
  { icon: MapPin, title: 'Addresses', text: 'Delivery addresses for every country.', to: '/addresses' },
  { icon: Heart, title: 'Wishlist', text: 'Saved products ready to move into your cart.', to: '/wishlist' },
  { icon: Headphones, title: 'Support', text: 'Chat with us about orders, shipping or customs.', to: '/support' },
]

const legalRows = [
  { icon: Info, label: 'About Global Ducan' },
  { icon: FileText, label: 'Terms & conditions' },
  { icon: ShieldCheck, label: 'Privacy policy' },
]

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        on ? 'bg-navy-600 dark:bg-tangerine-500' : 'bg-slate-300 dark:bg-white/20'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showTutorial, setShowTutorial] = useState(true)
  const [biometric, setBiometric] = useState(false)

  const displayName =
    user?.name?.trim() ||
    (user?.email ? user.email.split('@')[0].replace(/[._]/g, ' ') : 'Your account')
  const initial = (displayName || user?.email || '?').charAt(0).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AccountLayout title="Your account" description="Everything about your Ducan account in one place.">
      {/* Profile card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 font-display text-xl font-bold uppercase text-white ring-2 ring-tangerine-400/40 dark:bg-tangerine-500">
            {initial}
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-lg font-semibold capitalize text-navy-900 dark:text-white">
              {displayName}
            </div>
            <div className="truncate text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-navy-900/10 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:text-white dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      {/* Account hub */}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Account</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg hover:shadow-navy-900/10 dark:border-white/10 dark:bg-black dark:hover:border-white/25"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-600 transition group-hover:scale-105 dark:bg-navy-500/20 dark:text-navy-200">
              <card.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{card.text}</p>
          </Link>
        ))}
      </div>

      {/* Preferences + about */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Preferences</h2>
          <div className="mt-3 divide-y divide-navy-900/5 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-black">
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
                <SlidersHorizontal className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-navy-900 dark:text-white">Show tutorial</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Shown on next store visit</span>
              </span>
              <Toggle on={showTutorial} onClick={() => setShowTutorial((v) => !v)} />
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
                <Fingerprint className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-navy-900 dark:text-white">Biometric login</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Use fingerprint or Face ID to log in
                </span>
              </span>
              <Toggle on={biometric} onClick={() => setBiometric((v) => !v)} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">About &amp; legal</h2>
          <div className="mt-3 divide-y divide-navy-900/5 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-black">
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

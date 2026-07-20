import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Heart,
  MapPin,
  Languages,
  CircleDollarSign,
} from 'lucide-react'
import Logo from './Logo'
import { currencies } from '../data/stores'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useLocale } from '../context/LocaleContext'
import { useAddresses } from '../context/AddressContext'

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('ducan-theme', next ? 'dark' : 'light')
    } catch {
      // ignore
    }
  }
  return { dark, toggle }
}

export default function Header() {
  const [currency, setCurrency] = useState('USD')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [addrOpen, setAddrOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const addrRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { dark, toggle } = useTheme()
  const { t, locale, setLocale, options, dir } = useLocale()
  const { active, addresses, setDefault } = useAddresses()

  const navLinks = [
    { to: '/ways-to-shop', label: t('nav.ways') },
    { to: '/orders', label: t('nav.orders') },
    { to: '/wallet', label: t('nav.wallet') },
    { to: '/account', label: t('nav.account') },
  ]

  useEffect(() => {
    if (!mobileOpen) return
    const close = () => setMobileOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [mobileOpen])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const node = e.target as Node
      if (addrRef.current && !addrRef.current.contains(node)) setAddrOpen(false)
      if (langRef.current && !langRef.current.contains(node)) setLangOpen(false)
      if (currencyRef.current && !currencyRef.current.contains(node)) setCurrencyOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const pillButton =
    'rounded-full border border-navy-900/10 bg-white p-2.5 text-navy-800 shadow-sm transition hover:border-navy-300 dark:border-white/10 dark:bg-black dark:text-white dark:hover:border-white/25'

  const menuPanel =
    'absolute z-[60] mt-2 w-44 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-xl dark:border-white/10 dark:bg-black'

  return (
    <header className="relative z-30 border-b border-navy-900/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
      <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:min-h-[5.25rem]">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <div ref={addrRef} className="relative hidden min-w-0 sm:block">
          <button
            type="button"
            onClick={() => {
              setAddrOpen((v) => !v)
              setLangOpen(false)
              setCurrencyOpen(false)
            }}
            className="flex max-w-[11rem] items-center gap-2 rounded-2xl border border-navy-900/10 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-navy-300 md:max-w-[14rem] dark:border-white/10 dark:bg-black dark:hover:border-white/25"
            aria-expanded={addrOpen}
            aria-label={t('deliver.to')}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-tangerine-500 text-white">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('deliver.to')}
              </span>
              <span className="block truncate text-sm font-semibold text-navy-900 dark:text-white">
                {active ? active.city : t('deliver.add')}
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-navy-400" />
          </button>
          {addrOpen && (
            <div className="absolute start-0 z-[60] mt-2 w-72 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-xl dark:border-white/10 dark:bg-black">
              <div className="border-b border-navy-900/8 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/10">
                {t('deliver.to')}
                {active ? ` · ${active.country}` : ''}
              </div>
              <ul className="max-h-64 overflow-y-auto py-1">
                {addresses.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDefault(a.id)
                        setAddrOpen(false)
                      }}
                      className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition hover:bg-navy-50 dark:hover:bg-white/5 ${
                        a.isDefault ? 'bg-tangerine-50/60 dark:bg-tangerine-500/10' : ''
                      }`}
                    >
                      <span className="font-semibold text-navy-900 dark:text-white">
                        {a.label} · {a.city}
                      </span>
                      <span className="text-xs text-slate-500">{a.country}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to="/addresses"
                onClick={() => setAddrOpen(false)}
                className="block border-t border-navy-900/8 px-3 py-2.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 dark:border-white/10 dark:text-tangerine-300 dark:hover:bg-white/5"
              >
                {t('deliver.change')} →
              </Link>
            </div>
          )}
        </div>

        <nav className="ms-1 hidden flex-1 items-center justify-center gap-1 xl:ms-4 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-navy-800 text-white dark:bg-white dark:text-navy-900'
                    : 'text-navy-800/75 hover:bg-navy-900/5 hover:text-navy-900 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 sm:gap-2.5">
          <div ref={langRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setLangOpen((v) => !v)
                setCurrencyOpen(false)
                setAddrOpen(false)
              }}
              className={pillButton}
              aria-label={t('action.language')}
              aria-expanded={langOpen}
            >
              <Languages className="h-5 w-5" />
            </button>
            {langOpen && (
              <div className={`${menuPanel} ${dir === 'rtl' ? 'start-0' : 'end-0'}`}>
                {options.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLocale(opt.code)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-navy-50 dark:hover:bg-white/5 ${
                      opt.code === locale
                        ? 'font-semibold text-tangerine-600'
                        : 'text-navy-800 dark:text-white'
                    }`}
                  >
                    <span>{opt.native}</span>
                    <span className="text-[10px] uppercase text-slate-400">{opt.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={currencyRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setCurrencyOpen((v) => !v)
                setLangOpen(false)
                setAddrOpen(false)
              }}
              className={pillButton}
              aria-label={t('action.currency')}
              aria-expanded={currencyOpen}
            >
              <CircleDollarSign className="h-5 w-5" />
            </button>
            {currencyOpen && (
              <div className={`${menuPanel} ${dir === 'rtl' ? 'start-0' : 'end-0'}`}>
                {currencies.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCurrency(c)
                      setCurrencyOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-navy-50 dark:hover:bg-white/5 ${
                      c === currency
                        ? 'font-semibold text-tangerine-600'
                        : 'text-navy-800 dark:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={toggle} className={pillButton} aria-label={t('action.theme')}>
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link to="/wishlist" className={`relative ${pillButton}`} aria-label={t('action.wishlist')}>
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span
                key={wishCount}
                className="absolute -right-1 -top-1 flex h-5 w-5 animate-pop items-center justify-center rounded-full bg-tangerine-500 text-[10px] font-bold text-white"
              >
                {wishCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className={`relative ${pillButton}`} aria-label={t('action.cart')}>
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span
                key={count}
                className="absolute -right-1 -top-1 flex h-5 w-5 animate-pop items-center justify-center rounded-full bg-tangerine-500 text-[10px] font-bold text-white"
              >
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            className="hidden rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-navy-800/20 transition hover:bg-navy-700 sm:block dark:bg-tangerine-500 dark:shadow-tangerine-500/20 dark:hover:bg-tangerine-400"
          >
            {t('action.signIn')}
          </Link>

          <button
            type="button"
            className={`xl:hidden ${pillButton}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t('action.menu')}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-navy-900/5 bg-cream-50 px-4 py-3 xl:hidden dark:border-white/5 dark:bg-black">
          <div className="mb-2 sm:hidden">
            <button
              type="button"
              onClick={() => setAddrOpen((v) => !v)}
              className="flex w-full items-center gap-3 rounded-xl border border-navy-900/10 bg-white px-4 py-3 text-left dark:border-white/10 dark:bg-black"
            >
              <MapPin className="h-4 w-4 text-tangerine-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  {t('deliver.to')}
                </span>
                <span className="block truncate text-sm font-semibold text-navy-900 dark:text-white">
                  {active ? `${active.city}, ${active.country}` : t('deliver.add')}
                </span>
              </span>
            </button>
            {addrOpen && (
              <ul className="mt-1 overflow-hidden rounded-xl border border-navy-900/10 bg-white dark:border-white/10 dark:bg-black">
                {addresses.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDefault(a.id)
                        setAddrOpen(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-navy-900 dark:text-white"
                    >
                      {a.label} · {a.city}
                    </button>
                  </li>
                ))}
                <li>
                  <Link
                    to="/addresses"
                    onClick={() => {
                      setAddrOpen(false)
                      setMobileOpen(false)
                    }}
                    className="block px-4 py-2.5 text-xs font-semibold text-tangerine-600"
                  >
                    {t('deliver.change')} →
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-navy-800 text-white dark:bg-white dark:text-navy-900'
                    : 'text-navy-800/70 dark:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/support"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-navy-800/70 dark:text-white"
          >
            {t('nav.support')}
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-xl bg-tangerine-500 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            {t('action.signIn')}
          </Link>
        </nav>
      )}
    </header>
  )
}

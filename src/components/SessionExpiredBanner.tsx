import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Shown when a 401/403 forced a sign-out, so the user understands why they
 * were logged out instead of silently losing their session.
 */
export default function SessionExpiredBanner() {
  const { sessionExpired, clearSessionExpired } = useAuth()
  const { pathname, search } = useLocation()

  if (!sessionExpired) return null

  const redirect = encodeURIComponent(pathname + search)

  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-20 z-[70] mx-auto flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-2xl border border-navy-900/10 bg-white px-4 py-3 shadow-xl shadow-navy-900/15 md:bottom-6 dark:border-white/15 dark:bg-[#1a2332]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tangerine-100 text-tangerine-600 dark:bg-tangerine-500/15 dark:text-tangerine-300">
        <ShieldAlert className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-900 dark:text-white">
          You&apos;ve been signed out
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Your session expired. Sign in again to see your orders and wallet.
        </p>
        <Link
          to={`/login?redirect=${redirect}`}
          onClick={clearSessionExpired}
          className="mt-2 inline-block rounded-full bg-navy-800 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
        >
          Sign in
        </Link>
      </div>
      <button
        type="button"
        onClick={clearSessionExpired}
        aria-label="Dismiss"
        className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-navy-900/5 hover:text-navy-700 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

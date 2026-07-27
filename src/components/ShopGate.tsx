import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Puzzle, X, ExternalLink, Link2, Smartphone } from 'lucide-react'
import { chromeExtension } from '../data/apps'

export interface ShopTarget {
  name: string
  domain: string
  /** Logo URL from the API, shown in the gate dialog. */
  logo?: string
}

interface ShopGateContextValue {
  requestShop: (store: ShopTarget) => void
  resetSkip: () => void
}

const SKIP_KEY = 'ducan-shop-gate'

const ShopGateContext = createContext<ShopGateContextValue | null>(null)

function isSkipped(): boolean {
  try {
    return localStorage.getItem(SKIP_KEY) === 'skip'
  } catch {
    return false
  }
}

function openStore(domain: string) {
  window.open(`https://${domain}`, '_blank', 'noopener,noreferrer')
}

export function ShopGateProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<ShopTarget | null>(null)
  const [dontShow, setDontShow] = useState(false)
  const [reminder, setReminder] = useState(false)

  const close = useCallback(() => {
    setStore(null)
    setDontShow(false)
    setReminder(false)
  }, [])

  const requestShop = useCallback((target: ShopTarget) => {
    if (isSkipped()) {
      openStore(target.domain)
      return
    }
    setStore(target)
    setDontShow(false)
    setReminder(false)
  }, [])

  const resetSkip = useCallback(() => {
    try {
      localStorage.removeItem(SKIP_KEY)
    } catch {
      // ignore
    }
  }, [])

  const persistSkip = () => {
    if (!dontShow) return
    try {
      localStorage.setItem(SKIP_KEY, 'skip')
    } catch {
      // ignore
    }
  }

  const continueToStore = () => {
    if (!store) return
    persistSkip()
    openStore(store.domain)
    setReminder(true)
  }

  useEffect(() => {
    if (!store) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [store, close])

  return (
    <ShopGateContext.Provider value={{ requestShop, resetSkip }}>
      {children}
      {store && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shop-gate-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-2xl dark:border-white/10 dark:bg-black">
            <div className="flex items-start justify-between gap-3 border-b border-navy-900/5 px-6 py-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={store.logo}
                  alt=""
                  className="h-10 w-10 rounded-xl bg-cream-100 p-1.5 dark:bg-white/10"
                />
                <div>
                  <h2
                    id="shop-gate-title"
                    className="font-display text-lg font-bold text-navy-900 dark:text-white"
                  >
                    Shop {store.name} with Ducan
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {store.domain}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-slate-400 transition hover:bg-cream-100 hover:text-navy-800 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Browse the real {store.name} site. To buy through us, install the Chrome extension —
                or copy the product link and paste it in Ducan.
              </p>

              <a
                href={chromeExtension.href}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-tangerine-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
              >
                <Puzzle className="h-4 w-4" /> {chromeExtension.label}
              </a>

              <button
                type="button"
                onClick={continueToStore}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-navy-900/15 bg-white px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:bg-black dark:text-white dark:hover:border-white/30"
              >
                <ExternalLink className="h-4 w-4" /> Continue to {store.name}
              </button>

              <Link
                to="/capture"
                onClick={close}
                className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-navy-600 hover:underline dark:text-navy-200"
              >
                <Link2 className="h-4 w-4" /> Paste a product link instead
              </Link>

              {reminder && (
                <p className="rounded-2xl bg-cream-100 px-4 py-3 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  On a product page, copy the link and paste it in Ducan — or use{' '}
                  <strong>Buy with Ducan</strong> if the extension is installed.
                </p>
              )}

              <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                <Smartphone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Extension works on desktop Chrome. On phone, use the app, share sheet, or paste a
                link.
              </p>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                  className="rounded border-navy-900/20 text-navy-800 focus:ring-navy-500"
                />
                Don’t show this again — open stores directly
              </label>
            </div>
          </div>
        </div>
      )}
    </ShopGateContext.Provider>
  )
}

export function useShopGate(): ShopGateContextValue {
  const ctx = useContext(ShopGateContext)
  if (!ctx) throw new Error('useShopGate must be used inside ShopGateProvider')
  return ctx
}

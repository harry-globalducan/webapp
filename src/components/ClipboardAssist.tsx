import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ClipboardPaste, X } from 'lucide-react'
import { detectStore, extractUrl } from '../lib/capture'
import type { Store } from '../data/stores'

/**
 * When the user returns to the tab with a supported-store product URL on the
 * clipboard, offer a one-tap "add to cart". Reads the clipboard only when the
 * document is focused (browsers require this + user permission) and remembers
 * handled/dismissed links so the toast never nags.
 */
export default function ClipboardAssist() {
  const [offer, setOffer] = useState<{ url: string; store: Store } | null>(null)
  const seen = useRef<Set<string>>(new Set())
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const check = async () => {
      if (!document.hasFocus() || !navigator.clipboard?.readText) return
      // Don't interrupt an in-progress capture
      if (pathname === '/capture') return
      let text = ''
      try {
        text = await navigator.clipboard.readText()
      } catch {
        return // permission denied or unavailable — stay quiet
      }
      const url = extractUrl(text)
      if (!url || seen.current.has(url)) return
      const store = detectStore(url)
      if (!store) return
      seen.current.add(url)
      setOffer({ url, store })
    }

    void check()
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [pathname])

  if (!offer) return null

  return (
    <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 md:bottom-6">
      <div className="flex animate-toast-in items-center gap-3 rounded-3xl border border-navy-900/10 bg-white p-4 shadow-2xl shadow-navy-900/20 dark:border-white/10 dark:bg-black dark:shadow-black/50">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tangerine-100 text-tangerine-600">
          <ClipboardPaste className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-navy-900 dark:text-white">
            {offer.store.name} link copied
          </div>
          <div className="truncate text-xs text-slate-400">{offer.url}</div>
        </div>
        <button
          onClick={() => {
            const target = offer.url
            setOffer(null)
            navigate(`/capture?url=${encodeURIComponent(target)}`)
          }}
          className="shrink-0 rounded-full bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-navy-700"
        >
          Review & add
        </button>
        <button
          onClick={() => setOffer(null)}
          className="shrink-0 rounded-full p-1.5 text-slate-300 transition hover:bg-cream-100 hover:text-slate-500"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

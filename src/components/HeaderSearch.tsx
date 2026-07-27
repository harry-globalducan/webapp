import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Link2, Sparkles } from 'lucide-react'
import { looksLikeUrl, normalizeProductUrl } from '../lib/search'
import { useHomeData } from '../context/HomeDataContext'
import { useShopGate } from './ShopGate'

/**
 * Doorzo-style command search band.
 * Paste a product URL → Capture. Pick a store scope + keyword → open the real store via ShopGate.
 */
export default function HeaderSearch({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<string>('All stores')
  const [scopeOpen, setScopeOpen] = useState(false)
  const scopeRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { requestShop } = useShopGate()
  const { stores } = useHomeData()

  // Scope options come from the live store list — nothing hardcoded.
  const scopes = ['All stores', ...stores.slice(0, 8).map((s) => s.name)]

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (scopeRef.current && !scopeRef.current.contains(e.target as Node)) setScopeOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (looksLikeUrl(q)) {
      navigate(`/capture?url=${encodeURIComponent(normalizeProductUrl(q))}`)
      return
    }
    // Keyword search → open the scoped (or first) real store through the Shop Gate
    const target =
      scope !== 'All stores'
        ? stores.find((s) => s.name === scope)
        : stores[0]
    if (target) {
      requestShop({ name: target.name, domain: target.domain })
      return
    }
    navigate('/ways-to-shop')
  }

  return (
    <form
      onSubmit={submit}
      className={`group flex w-full items-stretch rounded-2xl border border-navy-900/10 bg-white shadow-sm ring-tangerine-500/0 transition focus-within:border-tangerine-400 focus-within:ring-4 focus-within:ring-tangerine-500/10 dark:border-white/12 dark:bg-white/5 ${className}`}
    >
      {/* store scope */}
      <div ref={scopeRef} className="relative hidden shrink-0 sm:block">
        <button
          type="button"
          onClick={() => setScopeOpen((v) => !v)}
          className="flex h-full items-center gap-1.5 rounded-l-2xl border-r border-navy-900/10 px-4 text-sm font-semibold text-navy-800 transition hover:bg-navy-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          aria-expanded={scopeOpen}
        >
          {scope}
          <ChevronDown className={`h-3.5 w-3.5 text-navy-400 transition ${scopeOpen ? 'rotate-180' : ''}`} />
        </button>
        {scopeOpen && (
          <div className="absolute start-0 top-full z-[60] mt-2 w-44 overflow-hidden rounded-2xl border border-navy-900/10 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-black">
            {scopes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setScope(s)
                  setScopeOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-navy-50 dark:hover:bg-white/5 ${
                  s === scope ? 'font-semibold text-tangerine-600' : 'text-navy-800 dark:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* input */}
      <div className="relative flex min-w-0 flex-1 items-center">
        <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste a product link, or search a brand…"
          aria-label="Paste a product URL or search a store"
          className="w-full bg-transparent py-3 pl-11 pr-3 text-sm text-navy-900 outline-none placeholder:text-slate-400 dark:text-white sm:text-[15px]"
        />
        {looksLikeUrl(query.trim()) && (
          <span className="mr-2 hidden shrink-0 items-center gap-1 rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-700 md:inline-flex dark:bg-leaf-500/15 dark:text-leaf-300">
            <Link2 className="h-3 w-3" /> Link detected
          </span>
        )}
      </div>

      {/* submit */}
      <button
        type="submit"
        className="m-1.5 flex shrink-0 items-center gap-1.5 rounded-xl bg-navy-800 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-navy-700 sm:px-5 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Buy with Ducan</span>
        <span className="sm:hidden">Buy</span>
      </button>
    </form>
  )
}

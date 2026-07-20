import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { looksLikeUrl, normalizeProductUrl } from '../lib/search'

interface ProxySearchProps {
  variant?: 'header' | 'hero'
  placeholder?: string
  className?: string
  initialQuery?: string
}

/**
 * Paste a product URL → Capture.
 * Keywords → browse real stores (no in-app catalog); tip points to Chrome extension.
 */
export default function ProxySearch({
  variant = 'header',
  placeholder = 'Paste a product link from Amazon, Myntra, Nykaa…',
  className = '',
  initialQuery = '',
}: ProxySearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const navigate = useNavigate()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    if (looksLikeUrl(q)) {
      navigate(`/capture?url=${encodeURIComponent(normalizeProductUrl(q))}`)
      return
    }
    // No mock catalog — send shoppers to real stores + extension guide
    navigate('/ways-to-shop')
  }

  const isHero = variant === 'hero'

  return (
    <form onSubmit={submit} className={`relative w-full ${className}`}>
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${
          isHero ? 'left-5 h-5 w-5' : 'left-3.5 h-4 w-4'
        }`}
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Paste a product URL from a supported store"
        className={
          isHero
            ? 'w-full rounded-full border border-navy-900/10 bg-white py-4 pl-14 pr-32 text-base text-navy-900 shadow-xl shadow-navy-900/10 outline-none transition placeholder:text-slate-400 focus:border-navy-400 dark:border-white/15 dark:bg-black dark:text-white'
            : 'w-full rounded-full border border-navy-900/10 bg-white py-2 pl-10 pr-24 text-sm text-navy-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-navy-400 dark:border-white/10 dark:bg-black dark:text-white'
        }
      />
      <button
        type="submit"
        className={
          isHero
            ? 'absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400'
            : 'absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400'
        }
      >
        Go
      </button>
    </form>
  )
}

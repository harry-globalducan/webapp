import { useEffect, useMemo, useState } from 'react'
import type { Store } from '../data/stores'

const CACHE_NAME = 'ducan-store-icons-v2'

/** Warm the Cache Storage copy in the background — never blocks the <img>. */
function warmCache(src: string) {
  if (typeof caches === 'undefined') return
  void (async () => {
    try {
      const cache = await caches.open(CACHE_NAME)
      if (await cache.match(src)) return
      const res = await fetch(src, { mode: 'cors', cache: 'reload', credentials: 'omit' })
      if (res.ok) await cache.put(src, res.clone())
    } catch {
      // ignore — network <img> still works
    }
  })()
}

async function readCachedBlobUrl(src: string): Promise<string | null> {
  if (typeof caches === 'undefined') return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const res = await cache.match(src)
    if (!res?.ok) return null
    const blob = await res.blob()
    if (!blob.size) return null
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

function faviconFor(domain?: string): string | undefined {
  if (!domain) return undefined
  const host = domain.replace(/^https?:\/\//, '').split('/')[0]
  if (!host) return undefined
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
}

interface StoreLogoProps {
  src?: string
  name?: string
  domain?: string
  alt?: string
  className?: string
  /** Legacy callers sometimes passed the whole store object. */
  store?: Store
  /** Legacy size class (merged into className). */
  size?: string
}

/**
 * Always paints something useful:
 * 1. Cached blob (fast, survives CDN `no-store`)
 * 2. API logo URL
 * 3. Google favicon for the store domain
 * 4. Initials
 *
 * Caching runs in the background and never blanking the tile.
 */
export default function StoreLogo({
  src,
  name,
  domain,
  alt = '',
  className,
  store,
  size,
}: StoreLogoProps) {
  const logoSrc = src || store?.logo
  const label = name || store?.name
  const host = domain || store?.domain
  const favicon = useMemo(() => faviconFor(host), [host])
  const mergedClass = [size, className].filter(Boolean).join(' ')

  const [displaySrc, setDisplaySrc] = useState<string | undefined>(logoSrc || favicon)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    setDisplaySrc(logoSrc || favicon)

    if (!logoSrc) return

    let cancelled = false
    let objectUrl: string | null = null

    warmCache(logoSrc)
    readCachedBlobUrl(logoSrc).then((cached) => {
      if (cancelled || !cached) return
      objectUrl = cached
      setDisplaySrc(cached)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [logoSrc, favicon])

  if (failed || !displaySrc) {
    if (label) {
      return (
        <span
          className={`inline-flex items-center justify-center font-display text-[10px] font-bold text-navy-500 dark:text-navy-200 ${mergedClass}`}
          aria-hidden
        >
          {label.slice(0, 2).toUpperCase()}
        </span>
      )
    }
    return <span className={mergedClass} aria-hidden />
  }

  return (
    <img
      src={displaySrc}
      alt={alt || label || ''}
      className={mergedClass}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        // Step down: blob/API → favicon → initials
        if (logoSrc && displaySrc === logoSrc && favicon) {
          setDisplaySrc(favicon)
          return
        }
        if (favicon && displaySrc !== favicon) {
          setDisplaySrc(favicon)
          return
        }
        setFailed(true)
      }}
    />
  )
}

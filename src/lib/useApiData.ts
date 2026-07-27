import { useCallback, useEffect, useState } from 'react'

interface Options<T> {
  /** Skip the request until this is true (e.g. only when signed in). */
  enabled?: boolean
  /** Value to show while loading or when the request fails. */
  fallback: T
}

interface Result<T> {
  data: T
  loading: boolean
  /** Set when the request failed — the UI keeps showing `fallback`. */
  error: string | null
  /** True once live data has been received at least once. */
  live: boolean
  refresh: () => void
}

/**
 * Fetch a resource from the API, degrading gracefully.
 *
 * The site must stay usable for signed-out visitors and when the backend is
 * unreachable, so failures never throw — they surface as `error` while `data`
 * keeps the supplied fallback.
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  { enabled = true, fallback }: Options<T>,
): Result<T> {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [live, setLive] = useState(false)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((res) => {
        if (cancelled) return
        if (res != null) {
          setData(res)
          setLive(true)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not load data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // `fetcher` is intentionally not a dep — callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick])

  return { data, loading, error, live, refresh }
}

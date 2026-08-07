import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

/** Sends a "Page Viewed" event on every client-side route change. */
export default function AnalyticsPageViews() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    trackPageView(pathname, search)
  }, [pathname, search])

  return null
}

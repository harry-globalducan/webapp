import { useSearchParams } from 'react-router-dom'
import AddProductPanel from '../components/AddProductPanel'
import { extractUrl } from '../lib/capture'

/**
 * Landing route for every external capture channel:
 * - PWA share target (`/capture?url=…` or `?text=…` from the Android share sheet)
 * - Bookmarklet (`/capture?url=…`)
 * - Clipboard assist
 * Falls back to a blank capture form when opened directly.
 */
export default function Capture() {
  const [params] = useSearchParams()
  const shared = params.get('url') || params.get('text') || params.get('title') || ''
  const initialUrl = shared ? (extractUrl(shared) ?? shared) : ''

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <AddProductPanel initialUrl={initialUrl} />
    </main>
  )
}

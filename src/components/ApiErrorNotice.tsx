import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'

interface ApiErrorNoticeProps {
  /** Message from ApiError — already mapped to friendly copy. */
  message: string | null
  /** Optional retry handler; renders a "Try again" button when provided. */
  onRetry?: () => void
  /** Shown under the message, e.g. "Showing sample data instead." */
  hint?: string
}

/**
 * Inline banner for a failed API call. The page keeps rendering its fallback
 * data underneath, so this explains *why* the content may look wrong.
 */
export default function ApiErrorNotice({ message, onRetry, hint }: ApiErrorNoticeProps) {
  if (!message) return null
  const offline = /could not reach the server/i.test(message)
  const Icon = offline ? WifiOff : AlertCircle

  return (
    <div
      role="status"
      className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-tangerine-200 bg-tangerine-50 px-4 py-3 text-sm text-tangerine-900 dark:border-tangerine-500/30 dark:bg-tangerine-500/10 dark:text-tangerine-200"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{message}</p>
        {hint && <p className="mt-0.5 text-xs opacity-80">{hint}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-tangerine-300 px-3 py-1.5 text-xs font-semibold transition hover:bg-tangerine-100 dark:border-tangerine-500/40 dark:hover:bg-tangerine-500/15"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      )}
    </div>
  )
}

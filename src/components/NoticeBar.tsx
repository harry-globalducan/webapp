import { Link } from 'react-router-dom'
import { Puzzle } from 'lucide-react'

const NOTICE =
  'Shop on Amazon, Myntra, Nykaa and more — then Buy with Ducan via our Chrome extension or by pasting the product link.'

/** Light tip strip under the header. */
export default function NoticeBar() {
  return (
    <div className="relative z-10 border-b border-navy-900/5 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-black/90">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs sm:px-6 sm:text-sm">
        <Puzzle className="hidden h-3.5 w-3.5 shrink-0 text-tangerine-600 sm:block" />
        <p className="text-slate-600 dark:text-slate-300">
          {NOTICE}{' '}
          <Link
            to="/ways-to-shop"
            className="font-semibold text-navy-700 underline-offset-2 hover:underline dark:text-tangerine-300"
          >
            Get the extension
          </Link>
        </p>
      </div>
    </div>
  )
}

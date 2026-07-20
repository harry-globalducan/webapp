import { Landmark, ArrowRight, FileText, Building2, Wallet, ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const stages = [
  { icon: Landmark, label: 'Your bank', detail: 'Add funds → Bank transfer' },
  { icon: ArrowRight, label: 'Transfer', detail: 'Send to Ducan’s local account' },
  { icon: FileText, label: 'Payment order', detail: 'Submit amount + TRN' },
  { icon: Building2, label: 'Ducan bank', detail: 'Funds arrive in 1–2 days' },
  { icon: Wallet, label: 'Wallet credited', detail: 'Realized amount lands' },
]

/** Open, light process graphic for bank → wallet funding. */
export default function DepositFlowGraphic() {
  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-tangerine-500" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tangerine-600">
            Deposit journey
          </p>
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
          How bank deposits work
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Transfer to our local bank, create a payment order with your TRN — we credit what
          actually arrives.
        </p>
      </div>

      {/* Desktop flow — open timeline, no heavy boxes */}
      <div className="relative hidden lg:block">
        <div className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent dark:via-white/20" />
        <ol className="relative grid grid-cols-5 gap-4">
          {stages.map((stage, i) => (
            <li key={stage.label} className="flex flex-col items-center text-center">
              <span
                className={`relative z-[1] flex h-14 w-14 items-center justify-center rounded-full ${
                  i === stages.length - 1
                    ? 'bg-leaf-500 text-white'
                    : 'bg-cream-100 text-navy-700 ring-1 ring-navy-900/10 dark:bg-white/10 dark:text-white dark:ring-white/15'
                }`}
              >
                <stage.icon className="h-5 w-5" />
              </span>
              <span className="mt-4 text-sm font-semibold text-navy-900 dark:text-white">
                {stage.label}
              </span>
              <span className="mt-1 max-w-[9rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {stage.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile timeline */}
      <ol className="space-y-0 lg:hidden">
        {stages.map((stage, i) => (
          <li key={stage.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  i === stages.length - 1
                    ? 'bg-leaf-500 text-white'
                    : 'bg-cream-100 text-navy-700 ring-1 ring-navy-900/10 dark:bg-white/10 dark:text-white dark:ring-white/15'
                }`}
              >
                <stage.icon className="h-5 w-5" />
              </span>
              {i < stages.length - 1 && (
                <span className="my-1 flex flex-col items-center text-navy-300 dark:text-white/25">
                  <span className="h-6 w-px bg-current" />
                  <ArrowDown className="h-3 w-3 text-tangerine-500" />
                </span>
              )}
            </div>
            <div className="pt-2.5 pb-3">
              <div className="text-sm font-semibold text-navy-900 dark:text-white">
                {stage.label}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Realized amount — airy equation, not nested dark cards */}
      <div className="border-y border-navy-900/8 py-6 dark:border-white/10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Realized credit example
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              You send
            </div>
            <div className="mt-1 font-display text-3xl font-bold tabular-nums text-navy-900 dark:text-white">
              $100
            </div>
          </div>
          <span className="font-display text-2xl text-slate-300 dark:text-white/25">−</span>
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              SWIFT fees
            </div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-slate-500 dark:text-slate-400">
              $5
            </div>
          </div>
          <span className="font-display text-2xl text-slate-300 dark:text-white/25">=</span>
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-leaf-600 dark:text-leaf-400">
              Wallet credit
            </div>
            <div className="mt-1 font-display text-3xl font-bold tabular-nums text-leaf-600 dark:text-leaf-400">
              $95
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          We credit the amount received, with a note if fees were deducted. Enter the exact amount
          on your payment order.{' '}
          <Link
            to="/support"
            className="font-semibold text-navy-600 hover:underline dark:text-navy-200"
          >
            Talk to support
          </Link>
        </p>
      </div>
    </section>
  )
}

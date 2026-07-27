import { Link } from 'react-router-dom'
import {
  Plus,
  Landmark,
  ReceiptText,
  PiggyBank,
  Undo2,
  ChevronRight,
  Lock,
  Wallet as WalletIcon,
  TrendingUp,
  Clock3,
  ShieldCheck,
  Headphones,
} from 'lucide-react'

import AccountLayout from '../components/AccountLayout'
import DepositFlowGraphic from '../components/DepositFlowGraphic'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useApiData } from '../lib/useApiData'
import ApiErrorNotice from '../components/ApiErrorNotice'
import * as api from '../lib/api'

const DEPOSIT_SECTION_ID = 'how-bank-deposits'

const buildStatTiles = (fmt: (n: number) => string, spent: number, pending: number, refunds: number) => [
  { icon: TrendingUp, label: 'Spent to date', value: fmt(spent) },
  { icon: Clock3, label: 'Pending deposits', value: fmt(pending) },
  { icon: Undo2, label: 'Refunds in progress', value: fmt(refunds) },
]

const fundRows = [
  {
    icon: Landmark,
    label: 'Bank Transfer (SWIFT)',
    sub: 'Create a payment order, then transfer · 1–2 business days',
  },
]

const activityRows = [
  { icon: ReceiptText, label: 'Transaction history', sub: 'Every debit and credit, itemized' },
  { icon: PiggyBank, label: 'Deposit history', sub: 'Track incoming transfers' },
  { icon: Undo2, label: 'Refunds', sub: 'Returned items and reversals' },
]

function scrollToDeposits() {
  document.getElementById(DEPOSIT_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function RowList({
  rows,
  onRowClick,
}: {
  rows: typeof activityRows
  onRowClick?: (label: string) => void
}) {
  return (
    <div className="divide-y divide-navy-900/5 overflow-hidden rounded-2xl border border-navy-900/8 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-black">
      {rows.map((row) => (
        <button
          key={row.label}
          type="button"
          onClick={() => onRowClick?.(row.label)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-cream-50 dark:hover:bg-white/5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-navy-600 dark:bg-white/10 dark:text-navy-200">
            <row.icon className="h-4.5 w-4.5" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-navy-900 dark:text-white">{row.label}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">{row.sub}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
      ))}
    </div>
  )
}

export default function Wallet() {
  const { isAuthed } = useAuth()
  const { format } = useCurrency()

  // GET /api/v1/wallet — real balance for signed-in users.
  const { data: wallet, error: walletError, refresh: refreshWallet } = useApiData(() => api.getWallet(), {
    enabled: isAuthed,
    fallback: { balance: 0, currency: 'USD' } as api.WalletBalance,
  })
  // GET /api/v1/wallet/transactions
  const { data: transactions } = useApiData(() => api.getWalletTransactions(), {
    enabled: isAuthed,
    fallback: [] as api.WalletTransaction[],
  })

  const balanceLabel = format(Number(wallet.balance ?? 0), wallet.currency || 'USD')
  const cur = wallet.currency || 'USD'
  const sumBy = (pred: (t: api.WalletTransaction) => boolean) =>
    transactions.filter(pred).reduce((sum, t) => sum + Number(t.amount ?? 0), 0)

  const statTiles = buildStatTiles(
    (n) => format(n, cur),
    sumBy((t) => t.type === 'DEBIT' && t.category === 'ORDER'),
    sumBy((t) => t.category === 'DEPOSIT' && t.type === 'CREDIT'),
    sumBy((t) => t.category === 'REFUND'),
  )

  return (
    <AccountLayout
      title="Your wallet"
      description="Fund once, shop every store — balances in USD."
      actions={
        <button
          type="button"
          onClick={scrollToDeposits}
          className="flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
        >
          <Plus className="h-4 w-4" /> Add funds
        </button>
      }
    >
      <ApiErrorNotice
        message={walletError}
        onRetry={refreshWallet}
        hint="Your balance could not be loaded."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Balance hero — open, light */}
          <div className="relative overflow-hidden border-b border-navy-900/8 pb-8 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
              <WalletIcon className="h-4 w-4 text-navy-500" /> Available balance
            </div>
            <div className="mt-3 font-display text-5xl font-bold tabular-nums text-navy-900 dark:text-white">
              {balanceLabel}
            </div>
            <div className="mt-6 flex max-w-md gap-8">
              <div>
                <div className="text-xs text-slate-400">Total balance</div>
                <div className="mt-0.5 font-display text-lg font-bold tabular-nums text-navy-900 dark:text-white">
                  {balanceLabel}
                </div>
              </div>
              <div className="border-l border-navy-900/10 pl-8 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="h-3 w-3" /> On hold
                </div>
                <div className="mt-0.5 font-display text-lg font-bold tabular-nums text-navy-900 dark:text-white">
                  $0.00
                </div>
              </div>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid gap-6 sm:grid-cols-3">
            {statTiles.map((tile) => (
              <div key={tile.label} className="border-b border-navy-900/8 pb-4 dark:border-white/10 sm:border-0 sm:pb-0">
                <tile.icon className="h-4.5 w-4.5 text-navy-400" />
                <div className="mt-3 font-display text-2xl font-bold tabular-nums text-navy-900 dark:text-white">
                  {tile.value}
                </div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{tile.label}</div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Add funds</h2>
            <div className="mt-3">
              <RowList
                rows={fundRows}
                onRowClick={(label) => {
                  if (label === 'Bank Transfer (SWIFT)') scrollToDeposits()
                }}
              />
            </div>
          </section>

          <section id={DEPOSIT_SECTION_ID} className="scroll-mt-24">
            <DepositFlowGraphic />
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Activity</h2>
            <div className="mt-3">
              <RowList rows={activityRows} />
            </div>
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-8 self-start border-t border-navy-900/8 pt-6 dark:border-white/10 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
          <div>
            <ShieldCheck className="h-5 w-5 text-leaf-500" />
            <h3 className="mt-3 text-sm font-semibold text-navy-900 dark:text-white">
              Your money is protected
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Wallet funds are held with regulated banking partners and are only debited when we
              purchase your order from the store.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-900 dark:text-white">
              Why fund a wallet?
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <li>· One transfer covers many orders — fewer bank fees</li>
              <li>· You are credited the realized amount after any SWIFT deductions</li>
              <li>· Instant checkout once the balance is in — shop any store with ease</li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-5 w-5 shrink-0 text-navy-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Questions about a deposit?{' '}
              <Link
                to="/support"
                className="font-semibold text-navy-600 hover:underline dark:text-navy-200"
              >
                Talk to support
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </AccountLayout>
  )
}

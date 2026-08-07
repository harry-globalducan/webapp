import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Home, MapPin, Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import AccountLayout from '../components/AccountLayout'
import { useAddresses } from '../context/AddressContext'
import { formatPhone } from '../lib/phone'
import AddressForm from '../components/AddressForm'
import { useAuth } from '../context/AuthContext'

export default function Addresses() {
  const { addresses, setDefault, remove, loading, refresh, error, live } = useAddresses()
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { isAuthed } = useAuth()

  const handleRemove = async (id: string) => {
    setActionError(null)
    setRemovingId(id)
    try {
      await remove(id)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not remove this address.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <AccountLayout
      title="Your addresses"
      description="Delivery addresses for every country you ship to."
    >
      {!isAuthed && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-900/10 bg-cream-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sign in to see and manage your delivery addresses.
          </p>
          <Link
            to="/login?redirect=%2Faddresses"
            className="rounded-full bg-navy-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
          >
            Sign in
          </Link>
        </div>
      )}

      {isAuthed && (error || actionError) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          <p className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {actionError || error}
          </p>
          <button
            type="button"
            onClick={() => {
              setActionError(null)
              refresh()
            }}
            className="text-xs font-bold uppercase tracking-wider underline"
          >
            Retry
          </button>
        </div>
      )}

      {isAuthed && loading && addresses.length === 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses…
        </div>
      )}

      {isAuthed && !loading && live && addresses.length === 0 && !adding && (
        <div className="mb-6 rounded-2xl border border-dashed border-navy-900/15 bg-cream-50 px-6 py-10 text-center dark:border-white/15 dark:bg-white/5">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-100 text-navy-500 dark:bg-navy-500/20 dark:text-navy-200">
            <Home className="h-6 w-6" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-white">
            No delivery addresses yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Add the address you want your parcels delivered to — you can save one for each country
            you ship to.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
          >
            <Plus className="h-4 w-4" /> Add delivery address
          </button>
        </div>
      )}

      {adding && (
        <div className="mb-6 max-w-xl">
          <AddressForm
            onCancel={() => setAdding(false)}
            onSaved={() => {
              setAdding(false)
              setActionError(null)
              refresh()
            }}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Add new — the empty state carries its own CTA, so don't double up. */}
        {!adding && isAuthed && live && addresses.length > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-navy-900/15 text-slate-400 transition hover:border-navy-400 hover:text-navy-600 dark:border-white/15 dark:hover:border-white/30 dark:hover:text-cream-50"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-semibold">Add new address</span>
          </button>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex min-h-56 flex-col rounded-2xl border border-navy-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-black"
          >
            <div className="flex items-center justify-between border-b border-navy-900/10 px-5 py-3 dark:border-white/10">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> {addr.label}
              </span>
              {addr.isDefault && (
                <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-0.5 text-[10px] font-bold text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300">
                  <CheckCircle2 className="h-3 w-3" /> Default
                </span>
              )}
            </div>
            <div className="flex-1 px-5 py-4 text-sm">
              <div className="font-semibold text-navy-900 dark:text-white">{addr.name}</div>
              {addr.lines.map((line) => (
                <div key={line} className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {line}
                </div>
              ))}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <Phone className="h-3 w-3" /> {formatPhone(addr.phone)}
              </div>
            </div>
            <div className="flex gap-4 border-t border-navy-900/10 px-5 py-3 text-xs font-semibold dark:border-white/10">
              <button
                type="button"
                onClick={() => void handleRemove(addr.id)}
                disabled={removingId === addr.id}
                className="text-navy-600 hover:underline disabled:opacity-50 dark:text-navy-200"
              >
                {removingId === addr.id ? 'Removing…' : 'Remove'}
              </button>
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefault(addr.id)}
                  className="ml-auto text-tangerine-600 hover:underline dark:text-tangerine-300"
                >
                  Set as default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-2xl border border-dashed border-navy-900/15 bg-white/60 p-5 text-sm text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        Shipping rates and duty estimates are calculated from your <strong>default</strong> address —
        keep it set to wherever you want your next order delivered.
      </p>
    </AccountLayout>
  )
}

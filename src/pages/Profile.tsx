import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  ChevronRight,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  ShieldAlert,
  UserRound,
} from 'lucide-react'

import AccountLayout from '../components/AccountLayout'
import ApiErrorNotice from '../components/ApiErrorNotice'
import { useAuth } from '../context/AuthContext'
import { useAddresses } from '../context/AddressContext'
import { useApiData } from '../lib/useApiData'
import { DIAL_CODES, formatNational, isValidNational, parsePhone, toE164 } from '../lib/phone'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'

const card =
  'rounded-2xl border border-navy-900/10 bg-white p-6 dark:border-white/10 dark:bg-black'
const field =
  'w-full rounded-2xl border border-navy-900/10 bg-cream-50 px-4 py-3 text-sm text-navy-900 outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-navy-900 dark:text-white">{value}</dd>
    </div>
  )
}

export default function Profile() {
  const { isAuthed } = useAuth()
  const { addresses } = useAddresses()

  // GET /api/v1/users/me
  const {
    data: me,
    error: meError,
    refresh,
  } = useApiData(() => api.getMe(), {
    enabled: isAuthed,
    fallback: null as api.UserProfile | null,
  })

  // Currency pickers come from the same lists the rest of the site uses.
  const { data: currencies } = useApiData(() => api.getSupportedCurrencies(), {
    enabled: isAuthed,
    fallback: [] as api.SupportedCurrency[],
  })
  const { data: payCurrencies } = useApiData(() => api.getPaymentCurrencies(), {
    enabled: isAuthed,
    fallback: [] as api.SupportedCurrency[],
  })

  if (!isAuthed) {
    return (
      <AccountLayout title="Profile" description="Your account details and security.">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-900/10 bg-cream-50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sign in to view and edit your profile.
          </p>
          <Link
            to="/login?redirect=%2Fprofile"
            className="rounded-full bg-navy-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
          >
            Sign in
          </Link>
        </div>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title="Profile" description="Your account details and security.">
      <ApiErrorNotice message={meError} onRetry={refresh} hint="Your profile could not be loaded." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <PersonalInformation
            me={me}
            currencies={currencies}
            payCurrencies={payCurrencies}
            onSaved={refresh}
          />
          <EmailCard me={me} onChanged={refresh} />
          <ChangePassword />
        </div>

        <aside className="space-y-6 self-start">
          <Link
            to="/addresses"
            className={`${card} flex items-center gap-4 transition hover:border-navy-300 dark:hover:border-white/25`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-600 dark:bg-navy-500/20 dark:text-navy-200">
              <MapPin className="h-4.5 w-4.5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-navy-900 dark:text-white">
                Delivery addresses
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {addresses.length} saved address{addresses.length === 1 ? '' : 'es'}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </Link>

          <DeleteAccount />
        </aside>
      </div>
    </AccountLayout>
  )
}

/* ------------------------------------------------------------------ */

function PersonalInformation({
  me,
  currencies,
  payCurrencies,
  onSaved,
}: {
  me: api.UserProfile | null
  currencies: api.SupportedCurrency[]
  payCurrencies: api.SupportedCurrency[]
  onSaved: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dial, setDial] = useState('+960')
  const [phone, setPhone] = useState('')
  const [preferredCurrency, setPreferredCurrency] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState('')

  // Seed the form whenever we (re)load the profile or reopen the editor.
  useEffect(() => {
    if (!me) return
    setFirstName(me.firstName ?? '')
    setLastName(me.lastName ?? '')
    const parsed = parsePhone(me.phone)
    if (parsed.dial) setDial(parsed.dial)
    setPhone(parsed.national)
    setPreferredCurrency(me.preferredCurrency ?? '')
    setPaymentCurrency(me.paymentCurrency ?? '')
  }, [me, editing])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('First and last name must each be at least 2 characters.')
      return
    }
    if (phone.trim() && !isValidNational(phone)) {
      setError('Please enter a valid phone number.')
      return
    }
    setSaving(true)
    try {
      await api.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() ? toE164(dial, phone) : undefined,
        preferredCurrency: preferredCurrency || undefined,
        paymentCurrency: paymentCurrency || undefined,
      })
      setEditing(false)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const fullName = [me?.firstName, me?.lastName].filter(Boolean).join(' ').trim()

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
          <UserRound className="h-4.5 w-4.5 text-navy-400" /> Personal information
        </h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-1.5 text-xs font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        )}
      </div>

      {!editing ? (
        <dl className="mt-3 divide-y divide-navy-900/5 dark:divide-white/10">
          <Row label="Name" value={fullName || 'Not provided'} />
          <Row label="Phone" value={me?.phone ? formatPhoneDisplay(me.phone) : 'Not provided'} />
          <Row label="Local currency" value={me?.preferredCurrency || 'Not set'} />
          <Row label="Payment currency" value={me?.paymentCurrency || 'Not set'} />
        </dl>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              aria-label="First name"
              className={field}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              aria-label="Last name"
              className={field}
            />
          </div>

          <div className="flex items-stretch gap-2">
            <select
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              aria-label="Country dialling code"
              className="shrink-0 rounded-2xl border border-navy-900/10 bg-cream-50 py-3 pl-3 pr-2 text-sm font-semibold text-navy-900 outline-none focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              {DIAL_CODES.map((d) => (
                <option key={`${d.code}-${d.dial}`} value={d.dial}>
                  {d.flag} {d.dial}
                </option>
              ))}
            </select>
            <input
              value={formatNational(phone)}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              aria-label="Phone number"
              inputMode="tel"
              autoComplete="tel-national"
              className={field}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Local currency
              </span>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                aria-label="Local currency"
                className={field}
              >
                <option value="">Not set</option>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Payment currency
              </span>
              <select
                value={paymentCurrency}
                onChange={(e) => setPaymentCurrency(e.target.value)}
                aria-label="Payment currency"
                className={field}
              >
                <option value="">Not set</option>
                {payCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setError(null)
              }}
              className="rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function formatPhoneDisplay(value: string) {
  const { dial, national } = parsePhone(value)
  return dial ? `${dial} ${formatNational(national)}`.trim() : value
}

/* ------------------------------------------------------------------ */

function EmailCard({ me, onChanged }: { me: api.UserProfile | null; onChanged: () => void }) {
  const [sending, setSending] = useState(false)
  const [code, setCode] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [entering, setEntering] = useState(false)

  const sendCode = async () => {
    setError(null)
    setNote(null)
    setSending(true)
    try {
      await api.requestEmailVerification()
      setEntering(true)
      setNote('We sent a verification code to your email.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the verification email.')
    } finally {
      setSending(false)
    }
  }

  const confirm = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      await api.verifyEmail(code.trim())
      setEntering(false)
      setCode('')
      setNote('Email verified.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'That code did not work.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className={card}>
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
        <Mail className="h-4.5 w-4.5 text-navy-400" /> Email
      </h2>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-navy-900 dark:text-white">
          {me?.email ?? '—'}
        </span>
        {me?.emailVerified ? (
          <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-1 text-[10px] font-bold text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300">
            <BadgeCheck className="h-3 w-3" /> Verified
          </span>
        ) : (
          <button
            type="button"
            onClick={sendCode}
            disabled={sending}
            className="rounded-full bg-tangerine-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-tangerine-400 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Verify now'}
          </button>
        )}
      </div>

      {entering && (
        <form onSubmit={confirm} className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code"
            aria-label="Verification code"
            inputMode="numeric"
            className={field}
          />
          <button
            type="submit"
            disabled={sending || !code.trim()}
            className="shrink-0 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60 dark:bg-tangerine-500"
          >
            Confirm
          </button>
        </form>
      )}

      {note && <p className="mt-2 text-xs font-medium text-leaf-700 dark:text-leaf-300">{note}</p>}
      {error && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function ChangePassword() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setNote(null)
    if (next.length < 8) {
      setError('Your new password must be at least 8 characters.')
      return
    }
    if (next !== confirmPw) {
      setError('The new passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await api.updatePassword(current, next)
      setOpen(false)
      setCurrent('')
      setNext('')
      setConfirmPw('')
      setNote('Password updated.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update your password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
          <KeyRound className="h-4.5 w-4.5 text-navy-400" /> Password
        </h2>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-navy-900/15 px-4 py-1.5 text-xs font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
          >
            Change password
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current password"
            aria-label="Current password"
            autoComplete="current-password"
            className={field}
          />
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="New password"
            aria-label="New password"
            autoComplete="new-password"
            className={field}
          />
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            autoComplete="new-password"
            className={field}
          />
          {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60 dark:bg-tangerine-500"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Updating…' : 'Update password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
              className="rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {note && <p className="mt-2 text-xs font-medium text-leaf-700 dark:text-leaf-300">{note}</p>}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function DeleteAccount() {
  const { logout } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async () => {
    setError(null)
    setWorking(true)
    try {
      await api.deleteMyAccount()
      logout()
    } catch (err) {
      // 409 means there are still orders in flight.
      setError(err instanceof ApiError ? err.message : 'Could not delete your account.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-red-700 dark:text-red-300">
        <ShieldAlert className="h-4.5 w-4.5" /> Delete account
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Permanently closes your Global Ducan account. You cannot do this while orders are still in
        progress.
      </p>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-full border border-red-500/30 px-5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500/10 dark:text-red-300"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={remove}
            disabled={working}
            className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {working && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Yes, delete permanently
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-full border border-navy-900/15 px-5 py-2 text-xs font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
          >
            Keep my account
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </section>
  )
}

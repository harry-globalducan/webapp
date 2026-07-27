import { useEffect, useState, type FormEvent } from 'react'
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Globe,
  Home,
  Loader2,
  Phone,
  User,
} from 'lucide-react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { DIAL_CODES, dialFor, formatNational, isValidNational, toE164 } from '../lib/phone'

interface AddressFormProps {
  onSaved: () => void
  onCancel?: () => void
}

/**
 * Add a delivery address — mirrors the mobile app's form, including the
 * customs note about matching the recipient's identity document.
 */
export default function AddressForm({ onSaved, onCancel }: AddressFormProps) {
  const [countries, setCountries] = useState<api.SupportedCountry[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('')
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [dial, setDial] = useState('+960')
  const [phone, setPhone] = useState('')

  // Countries we actually ship to, straight from the API.
  useEffect(() => {
    api
      .getSupportedCountries()
      .then(setCountries)
      .catch(() => setCountries([]))
  }, [])

  // Default the dial code to whatever country the shopper picks.
  useEffect(() => {
    const match = dialFor(country)
    if (match) setDial(match.dial)
  }, [country])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!fullName.trim() || !street1.trim() || !city.trim() || !country || !phone.trim()) {
      setError('Please fill in the recipient, country, street, city and phone number.')
      return
    }
    if (!isValidNational(phone)) {
      setError('Please enter a valid phone number.')
      return
    }
    setSaving(true)
    try {
      // The backend resolves the country with CountryCode.getByDisplayName, so
      // it wants the display name ("Maldives") — an ISO code silently resolves
      // to null. We keep the code in state only to drive the dial-code default.
      const countryName = countries.find((c) => c.code === country)?.name
      if (!countryName) {
        setError('Please select a country from the list.')
        setSaving(false)
        return
      }
      await api.createAddress({
        fullName: fullName.trim(),
        street1: street1.trim(),
        street2: street2.trim() || undefined,
        city: city.trim(),
        state: state.trim() || undefined,
        country: countryName,
        zipCode: zipCode.trim() || undefined,
        phone: toE164(dial, phone),
      })
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this address.')
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full rounded-2xl border border-navy-900/10 bg-cream-50 py-3 pl-11 pr-4 text-sm text-navy-900 outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white'
  const icon = 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400'

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-navy-900/10 bg-white p-5 dark:border-white/10 dark:bg-black"
    >
      <h3 className="font-display text-lg font-bold">Add a new address</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Where should we deliver your orders?
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-tangerine-50 px-4 py-3 text-xs leading-relaxed text-tangerine-900 dark:bg-tangerine-500/10 dark:text-tangerine-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        The name should match your national identity card to facilitate customs verification and
        quick delivery.
      </div>

      <div className="mt-4 space-y-3">
        <div className="relative">
          <User className={icon} />
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name of recipient"
            aria-label="Full name of recipient"
            className={field}
          />
        </div>

        <div className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Shipping address
        </div>

        <div className="relative">
          <Globe className={icon} />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Country or region"
            className={`${field} appearance-none`}
          >
            <option value="">Country / region</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Home className={icon} />
          <input
            value={street1}
            onChange={(e) => setStreet1(e.target.value)}
            placeholder="Street address"
            aria-label="Street address"
            className={field}
          />
        </div>

        <div className="relative">
          <Building2 className={icon} />
          <input
            value={street2}
            onChange={(e) => setStreet2(e.target.value)}
            placeholder="Apartment, suite, etc. (optional)"
            aria-label="Apartment, suite, etc."
            className={field}
          />
        </div>

        <div className="relative">
          <Building2 className={icon} />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            aria-label="City"
            className={field}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            aria-label="State"
            className="w-full rounded-2xl border border-navy-900/10 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Postal code"
            aria-label="Postal code"
            className="w-full rounded-2xl border border-navy-900/10 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Contact
        </div>

        <div className="flex items-stretch gap-2">
          <div className="relative shrink-0">
            <select
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              aria-label="Country dialling code"
              className="h-full appearance-none rounded-2xl border border-navy-900/10 bg-cream-50 py-3 pl-3 pr-8 text-sm font-semibold text-navy-900 outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              {DIAL_CODES.map((d) => (
                <option key={`${d.code}-${d.dial}`} value={d.dial}>
                  {d.flag} {d.dial}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy-400" />
          </div>
          <div className="relative min-w-0 flex-1">
            <Phone className={icon} />
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
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-800 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save address'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-navy-900/15 px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-400 dark:border-white/15 dark:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

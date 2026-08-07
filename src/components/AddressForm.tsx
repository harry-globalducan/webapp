import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { State } from 'country-state-city'
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Globe,
  Home,
  Loader2,
  MapPinned,
  Phone,
  User,
} from 'lucide-react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  DIAL_CODES,
  dialFor,
  digitsOnly,
  formatNational,
  phoneHint,
  toE164,
  validatePhone,
} from '../lib/phone'
import Combobox, { type ComboboxOption } from './Combobox'

interface AddressFormProps {
  onSaved: () => void
  onCancel?: () => void
}

/**
 * Add a delivery address — searchable country/state, dial-aware phone checks.
 */
export default function AddressForm({ onSaved, onCancel }: AddressFormProps) {
  const [countries, setCountries] = useState<api.SupportedCountry[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
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
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [countryError, setCountryError] = useState<string | null>(null)
  const [stateError, setStateError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setCountriesLoading(true)
    api
      .getSupportedCountries()
      .then((list) => {
        if (cancelled) return
        setCountries(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!cancelled) setCountries([])
      })
      .finally(() => {
        if (!cancelled) setCountriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Default the dial code when the shopper picks a country.
  useEffect(() => {
    const match = dialFor(country)
    if (match) setDial(match.dial)
  }, [country])

  const countryOptions: ComboboxOption[] = useMemo(
    () =>
      [...countries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ value: c.code, label: c.name, hint: c.code })),
    [countries],
  )

  const stateOptions: ComboboxOption[] = useMemo(() => {
    if (!country) return []
    return State.getStatesOfCountry(country.toUpperCase())
      .map((s) => ({ value: s.name, label: s.name, hint: s.isoCode }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [country])

  const hasStates = stateOptions.length > 0

  // Changing country clears a state that no longer applies.
  useEffect(() => {
    setState('')
    setStateError(null)
  }, [country])

  const phoneError = phoneTouched || phone ? validatePhone(dial, phone) : null

  const onPhoneChange = (raw: string) => {
    setPhone(digitsOnly(raw).slice(0, 15))
    setPhoneTouched(true)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setCountryError(null)
    setStateError(null)
    setPhoneTouched(true)

    const issues: string[] = []
    if (!fullName.trim()) issues.push('recipient name')
    if (!street1.trim()) issues.push('street')
    if (!city.trim()) issues.push('city')
    if (!country) {
      setCountryError('Select a country from the list.')
      issues.push('country')
    }
    if (hasStates && !state) {
      setStateError('Select a state / region from the list.')
      issues.push('state')
    }
    const phoneMsg = validatePhone(dial, phone)
    if (phoneMsg) issues.push('phone')

    if (issues.length) {
      setError(
        phoneMsg && issues.length === 1
          ? phoneMsg
          : `Please complete: ${issues.join(', ')}.`,
      )
      return
    }

    const countryName = countries.find((c) => c.code === country)?.name
    if (!countryName) {
      setCountryError('Please select a country from the list.')
      setError('Please select a country from the list.')
      return
    }

    setSaving(true)
    try {
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
      noValidate
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
            autoComplete="name"
            className={field}
          />
        </div>

        <div className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Shipping address
        </div>

        <Combobox
          placeholder="Country / region"
          value={country}
          options={countryOptions}
          onChange={(code) => {
            setCountry(code)
            setCountryError(null)
          }}
          loading={countriesLoading}
          required
          error={countryError}
          icon={<Globe className="h-4 w-4" />}
          emptyMessage="No matching ship-to country"
        />

        <div className="relative">
          <Home className={icon} />
          <input
            value={street1}
            onChange={(e) => setStreet1(e.target.value)}
            placeholder="Street address"
            aria-label="Street address"
            autoComplete="address-line1"
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
            autoComplete="address-line2"
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
            autoComplete="address-level2"
            className={field}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {hasStates ? (
            <Combobox
              placeholder="State / region"
              value={state}
              options={stateOptions}
              onChange={(v) => {
                setState(v)
                setStateError(null)
              }}
              disabled={!country}
              required
              error={stateError}
              icon={<MapPinned className="h-4 w-4" />}
              emptyMessage="No matching state"
            />
          ) : (
            <div className="relative">
              <MapPinned className={icon} />
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={country ? 'State / region (optional)' : 'Select a country first'}
                aria-label="State"
                disabled={!country}
                autoComplete="address-level1"
                className={`${field} disabled:opacity-50`}
              />
            </div>
          )}
          <input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Postal code"
            aria-label="Postal code"
            autoComplete="postal-code"
            className="w-full rounded-2xl border border-navy-900/10 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Contact
        </div>

        <div>
          <div className="flex items-stretch gap-2">
            <div className="relative shrink-0">
              <select
                value={dial}
                onChange={(e) => {
                  setDial(e.target.value)
                  setPhoneTouched(true)
                }}
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
                onChange={(e) => onPhoneChange(e.target.value)}
                onBlur={() => setPhoneTouched(true)}
                placeholder="Phone number"
                aria-label="Phone number"
                aria-invalid={Boolean(phoneError)}
                inputMode="tel"
                autoComplete="tel-national"
                className={`${field} ${
                  phoneError
                    ? 'border-red-400 focus:border-red-500 dark:border-red-500/60'
                    : ''
                }`}
              />
            </div>
          </div>
          <p
            className={`mt-1.5 text-xs ${
              phoneError ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-400'
            }`}
          >
            {phoneError ?? `National number: ${phoneHint(dial)}`}
          </p>
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

/**
 * Phone helpers for the address form.
 *
 * Numbers are stored in E.164-ish form (`+<dial><national>`) so the backend and
 * couriers get an unambiguous value, while the input shows readable grouping.
 */

export interface DialCode {
  /** ISO alpha-2, matching the country codes from /api/v1/home/countries. */
  code: string
  dial: string
  flag: string
}

/** Dial codes for the markets Global Ducan ships to, plus common origins. */
export const DIAL_CODES: DialCode[] = [
  { code: 'MV', dial: '+960', flag: '🇲🇻' },
  { code: 'MU', dial: '+230', flag: '🇲🇺' },
  { code: 'SC', dial: '+248', flag: '🇸🇨' },
  { code: 'BT', dial: '+975', flag: '🇧🇹' },
  { code: 'NP', dial: '+977', flag: '🇳🇵' },
  { code: 'LK', dial: '+94', flag: '🇱🇰' },
  { code: 'AE', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', dial: '+966', flag: '🇸🇦' },
  { code: 'QA', dial: '+974', flag: '🇶🇦' },
  { code: 'OM', dial: '+968', flag: '🇴🇲' },
  { code: 'BH', dial: '+973', flag: '🇧🇭' },
  { code: 'KW', dial: '+965', flag: '🇰🇼' },
  { code: 'IN', dial: '+91', flag: '🇮🇳' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', dial: '+61', flag: '🇦🇺' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { code: 'SG', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', dial: '+60', flag: '🇲🇾' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { code: 'FJ', dial: '+679', flag: '🇫🇯' },
]

export function dialFor(countryCode?: string): DialCode | undefined {
  if (!countryCode) return undefined
  return DIAL_CODES.find((d) => d.code === countryCode.toUpperCase())
}

/** Digits only, so grouping never fights with what the user typed. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Group the national part for readability. We deliberately keep this simple
 * and locale-agnostic rather than shipping a full libphonenumber dataset:
 * 10-digit numbers group 5-5 (India, and most Gulf mobiles read well this way),
 * others fall back to groups of three.
 */
export function formatNational(digits: string): string {
  const d = digitsOnly(digits)
  if (!d) return ''
  if (d.length <= 4) return d
  if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3)}`
  if (d.length === 10) return `${d.slice(0, 5)} ${d.slice(5)}`
  return d.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

/** Full value to submit, e.g. "+9607778888". */
export function toE164(dial: string, national: string): string {
  const d = digitsOnly(national)
  return d ? `${dial}${d}` : ''
}

/** Split a stored value back into a dial code and national part. */
export function parsePhone(value?: string): { dial: string; national: string } {
  if (!value) return { dial: '', national: '' }
  const trimmed = value.trim()
  if (!trimmed.startsWith('+')) return { dial: '', national: digitsOnly(trimmed) }
  // Longest dial code wins so +1 doesn't shadow +971.
  const match = [...DIAL_CODES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((d) => trimmed.startsWith(d.dial))
  if (!match) return { dial: '', national: digitsOnly(trimmed) }
  return { dial: match.dial, national: digitsOnly(trimmed.slice(match.dial.length)) }
}

/** Display helper for saved addresses, e.g. "+960 777 8888". */
export function formatPhone(value?: string): string {
  const { dial, national } = parsePhone(value)
  if (!dial) return value ?? ''
  return `${dial} ${formatNational(national)}`.trim()
}

/** Enough digits to be plausible without rejecting valid short numbers. */
export function isValidNational(national: string): boolean {
  const d = digitsOnly(national)
  return d.length >= 6 && d.length <= 15
}

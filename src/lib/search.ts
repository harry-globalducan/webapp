/** True when text looks like an http(s) URL (product paste). */
export function looksLikeUrl(text: string): boolean {
  const t = text.trim()
  if (/^https?:\/\//i.test(t)) return true
  try {
    const u = new URL(t.startsWith('http') ? t : `https://${t}`)
    return Boolean(u.hostname.includes('.'))
  } catch {
    return false
  }
}

/** Normalize pasted URL for capture query. */
export function normalizeProductUrl(text: string): string {
  const t = text.trim()
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

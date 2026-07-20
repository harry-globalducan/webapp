import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type LocaleCode,
  locales,
  translate,
} from '../i18n/locales'

const STORAGE_KEY = 'ducan-locale'

interface LocaleContextValue {
  locale: LocaleCode
  dir: 'ltr' | 'rtl'
  setLocale: (code: LocaleCode) => void
  t: (key: string) => string
  options: typeof locales
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readLocale(): LocaleCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as LocaleCode | null
    if (raw && locales.some((l) => l.code === raw)) return raw
  } catch {
    // ignore
  }
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(readLocale)

  const meta = locales.find((l) => l.code === locale) ?? locales[0]

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = meta.dir
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignore
    }
  }, [locale, meta.dir])

  const setLocale = useCallback((code: LocaleCode) => setLocaleState(code), [])
  const t = useCallback((key: string) => translate(locale, key), [locale])

  const value = useMemo(
    () => ({ locale, dir: meta.dir, setLocale, t, options: locales }),
    [locale, meta.dir, setLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}

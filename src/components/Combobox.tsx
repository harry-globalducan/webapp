import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'

export interface ComboboxOption {
  value: string
  label: string
  /** Optional secondary text (e.g. ISO code). */
  hint?: string
}

interface ComboboxProps {
  id?: string
  label?: string
  placeholder?: string
  value: string
  options: ComboboxOption[]
  onChange: (value: string) => void
  /** Soft-filter options as the user types. */
  disabled?: boolean
  loading?: boolean
  required?: boolean
  error?: string | null
  /** Leading icon inside the field. */
  icon?: ReactNode
  emptyMessage?: string
  /** When true, clearing the query also clears the selection. */
  clearable?: boolean
  className?: string
}

/**
 * Searchable single-select — type to filter, pick from the list.
 * Value is always one of the option values (or "").
 */
export default function Combobox({
  id,
  label,
  placeholder = 'Search…',
  value,
  options,
  onChange,
  disabled,
  loading,
  required,
  error,
  icon,
  emptyMessage = 'No matches',
  clearable = true,
  className = '',
}: ComboboxProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const listId = `${fieldId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find((o) => o.value === value)

  // Keep the input showing the selected label when closed; query when open.
  useEffect(() => {
    if (!open) setQuery(selected?.label ?? '')
  }, [selected?.label, open, value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || (selected && q === selected.label.toLowerCase())) return options
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.hint?.toLowerCase().includes(q) ?? false),
    )
  }, [options, query, selected])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const pick = (opt: ComboboxOption) => {
    onChange(opt.value)
    setQuery(opt.label)
    setOpen(false)
  }

  const clear = () => {
    onChange('')
    setQuery('')
    setOpen(true)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && filtered[activeIndex]) {
        e.preventDefault()
        pick(filtered[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(selected?.label ?? '')
    }
  }

  const field =
    'w-full rounded-2xl border bg-cream-50 py-3 text-sm text-navy-900 outline-none transition dark:bg-white/5 dark:text-white ' +
    (error
      ? 'border-red-400 focus:border-red-500 dark:border-red-500/60'
      : 'border-navy-900/10 focus:border-navy-400 dark:border-white/10') +
    (icon ? ' pl-11' : ' pl-4') +
    ' pr-16'

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {label}
          {required ? ' *' : ''}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
            {icon}
          </span>
        )}
        <input
          id={fieldId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-required={required}
          aria-invalid={Boolean(error)}
          disabled={disabled || loading}
          value={open ? query : (selected?.label ?? query)}
          placeholder={loading ? 'Loading…' : placeholder}
          autoComplete="off"
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            // Typing something different from the selection clears it.
            if (selected && e.target.value !== selected.label) onChange('')
          }}
          onKeyDown={onKeyDown}
          className={field}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-navy-400" />}
          {clearable && value && !disabled && !loading && (
            <button
              type="button"
              aria-label="Clear"
              onClick={clear}
              className="rounded-full p-1.5 text-navy-400 transition hover:bg-navy-900/5 hover:text-navy-700 dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Toggle options"
            disabled={disabled || loading}
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-1.5 text-navy-400 transition hover:bg-navy-900/5 dark:hover:bg-white/10"
          >
            <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {open && !disabled && !loading && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-2xl border border-navy-900/10 bg-white py-1 shadow-xl shadow-navy-900/10 dark:border-white/10 dark:bg-[#131921]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-400">{emptyMessage}</li>
          ) : (
            filtered.map((opt, i) => {
              const active = i === activeIndex
              const isSelected = opt.value === value
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => pick(opt)}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition ${
                      active
                        ? 'bg-navy-50 text-navy-900 dark:bg-white/10 dark:text-white'
                        : 'text-navy-800 dark:text-white/85'
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{opt.label}</span>
                    {opt.hint && (
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        {opt.hint}
                      </span>
                    )}
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-tangerine-500" />}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

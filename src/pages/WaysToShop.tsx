import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Puzzle,
  Link2,
  Share2,
  BookMarked,
  ClipboardPaste,
  Smartphone,
  MonitorSmartphone,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react'
import { chromeExtension } from '../data/apps'

/**
 * Bookmarklet target host.
 * Prefer the public web origin so a bookmark saved from localhost/preview still
 * opens production capture when used on amazon.in (etc.).
 */
function captureBase(): string {
  const configured = (import.meta.env.VITE_WEB_URL as string | undefined)?.replace(/\/+$/, '')
  if (configured) return configured
  return window.location.origin
}

/** Bookmarklet: open Ducan capture with the current page URL. */
function bookmarkletHref(): string {
  const capture = `${captureBase()}/capture?url=`
  // void(...) keeps the browser on the store tab until we navigate.
  return `javascript:void(function(){location.href=${JSON.stringify(capture)}+encodeURIComponent(location.href)}())`
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export default function WaysToShop() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [copied, setCopied] = useState(false)
  const [bookmarkHint, setBookmarkHint] = useState<string | null>(null)
  const bookmarkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  // React strips javascript: from JSX href — set it on the DOM node instead so
  // drag-to-bookmarks keeps a working bookmarklet.
  useEffect(() => {
    const el = bookmarkRef.current
    if (!el) return
    el.setAttribute('href', bookmarkletHref())
  }, [])

  const copyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletHref())
      setCopied(true)
      setBookmarkHint(
        'Copied. In your browser: Bookmarks → Add bookmark → paste into the URL field → save. Then open a product page and click the bookmark.',
      )
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setBookmarkHint(
        'Could not copy automatically. Drag the green button to your bookmarks bar instead.',
      )
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-10 bg-tangerine-500" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-tangerine-600">
            Ways to shop
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Capture products from <span className="text-tangerine-500">anywhere</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Browse the real Amazon, Myntra, Nykaa and more — then send products to Ducan with our
          Chrome extension, share sheet, or by pasting the link. We buy in India and ship worldwide.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {/* Paste a link */}
        <div className="rounded-3xl border border-navy-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-white">
              <Link2 className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-[11px] font-bold text-leaf-700">
              WORKS EVERYWHERE
            </span>
          </div>
          <h2 className="mt-5 text-xl font-semibold">Paste a product link</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Prefer not to install anything? Copy any product URL from a supported store and paste it
            here. We read the product and show your item payment before checkout.
          </p>
          <Link
            to="/capture"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Open the capture page <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Share sheet / PWA */}
        <div className="rounded-3xl border border-navy-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tangerine-500 text-white">
              <Share2 className="h-5 w-5" />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-navy-100 px-3 py-1 text-[11px] font-bold text-navy-700">
              <Smartphone className="h-3 w-3" /> BEST ON MOBILE
            </span>
          </div>
          <h2 className="mt-5 text-xl font-semibold">Share to Ducan</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Install Global Ducan as an app, then on any product page tap your phone's native{' '}
            <strong>Share</strong> button and pick <strong>Global Ducan</strong>. The product
            lands straight in your capture flow — no copying links.
          </p>
          {installEvent ? (
            <button
              type="button"
              onClick={() => void installEvent.prompt()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
            >
              <MonitorSmartphone className="h-4 w-4" /> Install the app
            </button>
          ) : (
            <p className="mt-5 rounded-2xl bg-cream-100 px-4 py-3 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
              To install: open your browser menu and choose{' '}
              <strong>Add to Home Screen</strong> (mobile) or <strong>Install app</strong>{' '}
              (desktop Chrome/Edge).
            </p>
          )}
        </div>

        {/* Bookmarklet */}
        <div className="rounded-3xl border border-navy-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-500 text-white">
              <BookMarked className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-bold text-navy-700">
              ANY DESKTOP BROWSER
            </span>
          </div>
          <h2 className="mt-5 text-xl font-semibold">The Ducan button (bookmarklet)</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            A tiny bookmark that runs on the store page: it sends that product URL into Ducan
            capture on{' '}
            <strong className="font-semibold text-navy-900 dark:text-white">
              {(import.meta.env.VITE_WEB_URL as string | undefined)?.replace(/^https?:\/\//, '') ||
                'this site'}
            </strong>
            . <strong>Drag</strong> the green button to your bookmarks bar (don&apos;t just click it
            here). Or copy the code and paste it as a new bookmark&apos;s URL.
          </p>
          <ol className="mt-3 list-decimal space-y-1 ps-5 text-xs text-slate-500 dark:text-slate-400">
            <li>Show your bookmarks bar (Chrome: ⌘/Ctrl+Shift+B).</li>
            <li>
              Drag <em>+ Add to Ducan</em> onto the bar — or use Copy code and create a bookmark
              manually.
            </li>
            <li>Open any Amazon / Myntra product page, then click that bookmark.</li>
          </ol>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              ref={bookmarkRef}
              href="/capture"
              draggable
              onClick={(e) => {
                e.preventDefault()
                setBookmarkHint(
                  'Drag this button onto your bookmarks bar — clicking it on this page won’t open a store product.',
                )
              }}
              onDragStart={(e) => {
                const href = bookmarkletHref()
                e.currentTarget.setAttribute('href', href)
                e.dataTransfer.setData('text/uri-list', href)
                e.dataTransfer.setData('text/plain', href)
                e.dataTransfer.effectAllowed = 'copyLink'
              }}
              title="Drag me to your bookmarks bar"
              className="inline-flex cursor-grab items-center gap-2 rounded-full border-2 border-dashed border-leaf-500 bg-leaf-50 px-6 py-3 text-sm font-bold text-leaf-700 transition hover:bg-leaf-100 active:cursor-grabbing"
            >
              + Add to Ducan
            </a>
            <button
              type="button"
              onClick={() => void copyBookmarklet()}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2.5 text-xs font-semibold text-navy-800/70 transition hover:border-navy-400 dark:border-white/15 dark:text-white/80"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-leaf-600" /> : null}
              {copied ? 'Copied!' : 'Copy code instead'}
            </button>
          </div>
          {bookmarkHint && (
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-navy-50 px-3 py-2.5 text-xs leading-relaxed text-navy-800 dark:bg-white/5 dark:text-navy-100">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tangerine-500" />
              {bookmarkHint}
            </p>
          )}
        </div>

        {/* Chrome extension */}
        <div className="rounded-3xl border border-navy-900/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-200">
              <Puzzle className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-tangerine-100 px-3 py-1 text-[11px] font-bold text-tangerine-700">
              BEST ON DESKTOP
            </span>
          </div>
          <h2 className="mt-5 text-xl font-semibold">Chrome extension</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            The best way to shop: open the real Amazon.in / Myntra / Nykaa page, then tap{' '}
            <strong>Buy with Ducan</strong>. Landed-cost estimate sits next to the store price — no
            copying links.
          </p>
          <a
            href={chromeExtension.href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tangerine-500/30 transition hover:bg-tangerine-400"
          >
            <Puzzle className="h-4 w-4" /> {chromeExtension.label}
          </a>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4 rounded-3xl border border-dashed border-navy-900/15 bg-white/60 p-6 dark:border-white/15 dark:bg-white/5">
        <ClipboardPaste className="mt-0.5 h-6 w-6 shrink-0 text-navy-400" />
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <strong className="text-navy-900 dark:text-white">Tip — we watch your clipboard for you.</strong>{' '}
          Copy a product link in another tab and come back here: if it's from a supported store,
          we'll offer to add it in one tap. Your clipboard is only read with your browser's
          permission, on this site, and never leaves your device.
        </p>
      </div>
    </main>
  )
}

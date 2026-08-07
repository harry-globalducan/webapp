import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowRight, Scale } from 'lucide-react'

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

interface LegalDocumentProps {
  eyebrow: string
  title: string
  accent?: string
  summary: string
  updated: string
  sections: LegalSection[]
  otherDoc: { label: string; to: string }
}

/**
 * Shared layout for Terms / Privacy — readable legal prose with a
 * sticky section nav, brand hero, and cross-links.
 */
export default function LegalDocument({
  eyebrow,
  title,
  accent,
  summary,
  updated,
  sections,
  otherDoc,
}: LegalDocumentProps) {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-navy-900/5 bg-gradient-to-br from-white via-navy-50/40 to-tangerine-50/30 dark:border-white/5 dark:from-[#0f1111] dark:via-[#131921] dark:to-[#1a2332]">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-tangerine-400/15 blur-3xl dark:bg-tangerine-500/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-navy-400/10 blur-3xl dark:bg-navy-500/20"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-tangerine-300">
            <Scale className="h-3.5 w-3.5 text-tangerine-500" />
            {eyebrow}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
            {title}
            {accent ? (
              <>
                {' '}
                <span className="text-tangerine-500">{accent}</span>
              </>
            ) : null}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {summary}
          </p>
          <p className="mt-5 text-xs font-medium text-slate-400">Last updated {updated}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-14 lg:py-16">
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">On this page</p>
          <nav className="mt-3 space-y-1" aria-label="Document sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-navy-800/70 transition hover:bg-navy-900/5 hover:text-navy-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </nav>
          <Link
            to={otherDoc.to}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-tangerine-600 transition hover:text-tangerine-500 dark:text-tangerine-300"
          >
            {otherDoc.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>

        <article className="min-w-0 space-y-10">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-36 rounded-3xl border border-navy-900/8 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-black"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm font-bold text-tangerine-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  {s.title}
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 [&_a]:font-semibold [&_a]:text-navy-800 [&_a]:underline [&_a]:decoration-navy-800/20 [&_a]:underline-offset-2 hover:[&_a]:text-tangerine-600 dark:[&_a]:text-tangerine-300 [&_li]:ms-4 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-navy-900 dark:[&_strong]:text-white [&_ul]:mt-2 [&_ul]:space-y-1.5">
                {s.body}
              </div>
            </section>
          ))}

          <div className="rounded-3xl border border-dashed border-navy-900/15 bg-cream-50/80 p-6 sm:p-8 dark:border-white/15 dark:bg-white/[0.03]">
            <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
              Questions about these terms?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Our support team can clarify how Global Ducan works for your destination market.
            </p>
            <Link
              to="/support"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
            >
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}

import { Link } from 'react-router-dom'
import {
  UserPlus,
  Store,
  CreditCard,
  Warehouse,
  PackageCheck,
  Home,
  Layers,
  Camera,
  Wallet,
  Scale,
  ArrowRight,
  BookOpen,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import {
  guideSteps,
  guideTips,
  commonMistakes,
  guideFaqLink,
} from '../data/userGuide'

const icons = {
  UserPlus,
  Store,
  CreditCard,
  Warehouse,
  PackageCheck,
  Home,
  Layers,
  Camera,
  Wallet,
  Scale,
} as const

type IconName = keyof typeof icons

function Icon({ name, className }: { name: string; className?: string }) {
  const Comp = icons[name as IconName] ?? BookOpen
  return <Comp className={className} />
}

export default function UserGuide() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-navy-900/5 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white">
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-tangerine-500/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-tangerine-300">
              New users&apos; guide
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              From Indian store to your door — in six clear steps
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
              Global Ducan is an India proxy shop — inspired by services like{' '}
              <a
                href="https://www.doorzo.com/en/userGuide/novice-strategy?code=novice-strategy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-tangerine-300 underline-offset-2 hover:underline"
              >
                Doorzo&apos;s novice guide
              </a>
              , rebuilt for Amazon.in, Myntra, Nykaa and your Gulf &amp; Indian Ocean destinations.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/ways-to-shop"
                className="rounded-full bg-tangerine-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tangerine-400"
              >
                Start shopping
              </Link>
              <Link
                to="/shipping"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white/40"
              >
                Shipping fees
              </Link>
              <Link
                to="/app"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white/40"
              >
                Get the app
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ol className="space-y-6">
          {guideSteps.map((step, i) => (
            <Reveal key={step.id} delay={i * 60}>
              <li className="grid gap-5 rounded-3xl border border-navy-900/8 bg-white p-6 shadow-sm sm:grid-cols-[auto_1fr] dark:border-white/10 dark:bg-black sm:p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-800 text-white dark:bg-tangerine-500">
                  <Icon name={step.icon} className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-tangerine-500">
                    Step {String(step.id).padStart(2, '0')}
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-navy-900 dark:text-white">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.summary}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {step.details.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {step.link && (
                    <Link
                      to={step.link.to}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-tangerine-600 dark:text-tangerine-300"
                    >
                      {step.link.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-navy-900/5 bg-zinc-50 dark:border-white/5 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
            Pro tips
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guideTips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-2xl border border-navy-900/8 bg-white p-5 dark:border-white/10 dark:bg-black"
              >
                <Icon name={tip.icon} className="h-5 w-5 text-tangerine-500" />
                <h3 className="mt-3 text-sm font-semibold text-navy-900 dark:text-white">
                  {tip.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
          Common mistakes
        </h2>
        <div className="mt-6 space-y-3">
          {commonMistakes.map((m) => (
            <div
              key={m.wrong}
              className="grid gap-3 rounded-2xl border border-navy-900/8 bg-white p-5 sm:grid-cols-2 dark:border-white/10 dark:bg-black"
            >
              <div className="flex gap-2 text-sm text-slate-500">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>
                  <span className="font-semibold text-slate-400">Avoid: </span>
                  {m.wrong}
                </span>
              </div>
              <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
                <span>
                  <span className="font-semibold text-leaf-600 dark:text-leaf-400">Do: </span>
                  {m.right}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link
          to={guideFaqLink.to}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 dark:bg-tangerine-500 dark:hover:bg-tangerine-400"
        >
          {guideFaqLink.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}

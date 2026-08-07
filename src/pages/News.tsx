import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ExternalLink,
  Newspaper,
  Play,
  Radio,
  Sparkles,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import {
  pressItems,
  socialLinks,
  socialPosts,
  type PressItem,
  type PressKind,
  type SocialPost,
} from '../data/press'

/** Full-bleed hero still — swap this path anytime under /public/news/. */
const HERO_IMAGE = '/news/8-share.jpg'

type Filter = 'All' | PressKind

const FILTERS: Filter[] = ['All', 'Article', 'Video', 'Reel', 'Post']

function PressThumb({ item, className = '' }: { item: PressItem; className?: string }) {
  if (item.branded || !item.img) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 text-center ${className}`}
      >
        <span className="text-base font-bold text-white">{item.source}</span>
        <span className="mt-1 text-[11px] font-medium text-tangerine-300">× Global Ducan</span>
      </div>
    )
  }
  return (
    <img
      src={item.img}
      alt=""
      loading="lazy"
      className={`h-full w-full object-cover transition duration-500 group-hover/card:scale-105 ${className}`}
    />
  )
}

function MediaBadge({ kind }: { kind: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
      {kind}
    </span>
  )
}

function PlayOverlay() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg transition group-hover/card:scale-110">
        <Play className="h-4 w-4 translate-x-0.5 fill-current" />
      </span>
    </span>
  )
}

function PressCard({ item, featured = false }: { item: PressItem; featured?: boolean }) {
  const playable = item.kind === 'Video' || item.kind === 'Reel'
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className={`group/card flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-tangerine-400/40 hover:shadow-xl hover:shadow-navy-900/10 dark:border-white/10 dark:bg-black dark:hover:border-tangerine-400/30`}
    >
      <div
        className={`relative overflow-hidden bg-navy-100 dark:bg-white/5 ${
          featured ? 'aspect-[16/10] sm:aspect-[16/11]' : 'aspect-video'
        }`}
      >
        <PressThumb item={item} />
        <MediaBadge kind={item.kind} />
        {playable && <PlayOverlay />}
      </div>
      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8' : 'p-5'}`}>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-tangerine-600 dark:text-tangerine-300">
          {item.source}
        </div>
        <h3
          className={`mt-2 font-display font-semibold leading-snug text-navy-900 dark:text-white ${
            featured ? 'text-2xl sm:text-3xl' : 'text-base'
          }`}
        >
          {item.title}
        </h3>
        {item.blurb && (
          <p
            className={`mt-2 text-slate-500 dark:text-slate-400 ${
              featured ? 'text-sm leading-relaxed sm:text-base' : 'line-clamp-2 text-sm'
            }`}
          >
            {item.blurb}
          </p>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 transition group-hover/card:text-tangerine-600 dark:text-navy-200 dark:group-hover/card:text-tangerine-300">
          Read coverage <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  )
}

function SocialCard({ post }: { post: SocialPost }) {
  const playable = post.kind === 'Video' || post.kind === 'Reel'
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group/card flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-navy-400/30 hover:shadow-lg dark:border-white/10 dark:bg-black"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 sm:aspect-square">
        {post.img ? (
          <img
            src={post.img}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Radio className="h-8 w-8 text-tangerine-300" />
            <span className="font-display text-lg font-bold text-white">{post.platform}</span>
            <span className="text-xs text-white/60">{post.title}</span>
          </div>
        )}
        <MediaBadge kind={`${post.platform} · ${post.kind}`} />
        {playable && post.img && <PlayOverlay />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {post.caption}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 dark:text-navy-200">
          View on {post.platform} <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  )
}

export default function News() {
  const [filter, setFilter] = useState<Filter>('All')
  const filtered =
    filter === 'All' ? pressItems : pressItems.filter((p) => p.kind === filter)
  const [featured, ...rest] = filtered.length ? filtered : pressItems

  return (
    <main>
      {/* Hero — single full-bleed press photo */}
      <section className="relative isolate min-h-[min(88vh,42rem)] overflow-hidden text-white">
        <div className="absolute inset-0" aria-hidden>
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover object-center animate-news-ken"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/92 via-navy-950/70 to-navy-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,136,27,0.22),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[min(88vh,42rem)] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 sm:pb-16 lg:pb-20 lg:pt-28">
          <Reveal>
            <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-tangerine-300">
              Global Ducan
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              In the <span className="text-tangerine-400">news</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Press coverage, partner spotlights, and moments from our socials — where Global Ducan
              shows up beyond the cart.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#press"
                className="inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-950/30 transition hover:bg-tangerine-400"
              >
                <Newspaper className="h-4 w-4" /> Press coverage
              </a>
              <a
                href="#social"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/45 hover:bg-white/15"
              >
                <Sparkles className="h-4 w-4" /> Social highlights
              </a>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/15 pt-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Follow
              </span>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/75 backdrop-blur transition hover:border-tangerine-400/60 hover:text-tangerine-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Press */}
      <section id="press" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Media" title="As seen" accent="in the press" />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    filter === f
                      ? 'bg-navy-800 text-white dark:bg-tangerine-500'
                      : 'border border-navy-900/10 text-navy-700 hover:border-navy-400 dark:border-white/15 dark:text-white/70'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal className="sm:col-span-2 sm:row-span-2">
            <PressCard item={featured} featured />
          </Reveal>
          {rest.map((item, i) => (
            <Reveal key={`${item.href}-${i}`} delay={80 + i * 60}>
              <PressCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Social */}
      <section
        id="social"
        className="scroll-mt-24 border-y border-navy-900/5 bg-gradient-to-b from-cream-50 to-white dark:border-white/5 dark:from-[#0f1111] dark:to-black"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <SectionHeading eyebrow="Social" title="From our" accent="channels" />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
              Highlights from Instagram, Facebook, LinkedIn and YouTube — curated moments from
              Global Ducan and our postal partners.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {socialPosts.map((post, i) => (
              <Reveal key={`${post.href}-${post.title}-${i}`} delay={i * 70}>
                <SocialCard post={post} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-navy-900/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="font-display text-base font-semibold text-navy-900 dark:text-white">
                  Prefer scrolling the live feeds?
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Follow @globalducan on Instagram, Facebook, LinkedIn and YouTube for offers,
                  launches and delivery updates.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 px-4 py-2 text-xs font-semibold text-navy-800 transition hover:border-tangerine-400 hover:text-tangerine-600 dark:border-white/15 dark:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                      <path d={s.path} />
                    </svg>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 px-8 py-12 text-white sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-tangerine-500/20 blur-3xl" />
            <div className="relative max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to shop India?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                Paste a product link, consolidate at our warehouse, and ship to 20+ countries —
                the same Global Ducan the press has been writing about.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/ways-to-shop"
                  className="inline-flex items-center gap-2 rounded-full bg-tangerine-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-tangerine-400"
                >
                  Ways to shop <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  About Global Ducan
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

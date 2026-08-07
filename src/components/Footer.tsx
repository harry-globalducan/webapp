import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, Newspaper, ExternalLink, Play } from 'lucide-react'
import Logo from './Logo'
import PaymentLogos from './PaymentLogos'
import { appStores } from '../data/apps'
import { pressItems, socialLinks } from '../data/press'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Browse stores', to: '/' },
      { label: 'Ways to shop', to: '/ways-to-shop' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Cart', to: '/cart' },
      { label: 'Orders', to: '/orders' },
      { label: 'Wallet', to: '/wallet' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'In the news', to: '/news' },
      { label: 'Get the app', to: '/apps' },
      { label: 'New user guide', to: '/guide' },
      { label: 'Refer & earn', to: '/refer' },
      { label: 'Support', to: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & conditions', to: '/terms' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Shipping fees & restrictions', to: '/shipping' },
      { label: 'Refunds', to: '/terms#refunds' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-900/5 bg-navy-950 text-white dark:border-white/10 dark:bg-[#0f1111]">
      {/* In the news — auto-scrolling marquee with previews */}
      <div className="border-b border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-300">
            <Newspaper className="h-3.5 w-3.5" /> In the news
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition hover:text-tangerine-300"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="flex w-max animate-ticker gap-4 px-4 group-hover:[animation-play-state:paused] sm:px-6">
            {[...pressItems, ...pressItems].map((p, i) => (
              <a
                key={i}
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.kind} · ${p.title} (${p.source})`}
                className="group/card w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-tangerine-400/40 hover:bg-white/10"
              >
                <div className="relative aspect-video overflow-hidden bg-white/10">
                  {p.branded || !p.img ? (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 text-center transition duration-500 group-hover/card:scale-105">
                      <span className="text-base font-bold text-white">{p.source}</span>
                      <span className="mt-1 text-[11px] font-medium text-tangerine-300">
                        × Global Ducan
                      </span>
                    </div>
                  ) : (
                    <img
                      src={p.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                    {p.kind}
                  </span>
                  {(p.kind === 'Video' || p.kind === 'Reel') && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg transition group-hover/card:scale-110">
                        <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                      </span>
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="line-clamp-2 text-sm font-semibold text-white">{p.title}</div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-white/50">
                    {p.source} <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
          <div>
            <h4 className="font-display text-2xl font-semibold text-white">
              Drops, deals & duty tips — monthly.
            </h4>
            <p className="mt-1 text-sm text-white/50">
              No spam. Just the best of Indian e-commerce, shipped to your inbox.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/40 outline-none backdrop-blur transition focus:border-tangerine-400/60"
            />
            <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-tangerine-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-tangerine-400">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-2xl bg-cream-50 p-3">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Your gateway to shopping from India's top stores with seamless international
            shipping, local-currency payments and one global cart.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={appStores.ios.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Download on the App Store"
              title="Download on the App Store"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-navy-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
              </svg>
            </a>
            <a
              href={appStores.android.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Get it on Google Play"
              title="Get it on Google Play"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path d="M3.6 20.6c-.3-.2-.5-.6-.5-1.1V4.5c0-.5.2-.9.5-1.1l8.2 8.6-8.2 8.6Z" fill="#34a853" />
                <path d="M3.6 3.4c.3-.2.7-.2 1.1 0l10 5.5-2.9 3-8.2-8.5Z" fill="#4285f4" />
                <path d="M14.7 8.9l3.3 1.8c.9.5.9 1.3 0 1.8l-3.3 1.8-2.9-2.7 2.9-2.7Z" fill="#fbbc04" />
                <path d="M4.7 20.6c-.4.2-.8.2-1.1 0l8.2-8.5 2.9 3-10 5.5Z" fill="#ea4335" />
              </svg>
            </a>
          </div>
          <div className="mt-5 flex gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-tangerine-400/50 hover:text-tangerine-300"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 transition hover:text-tangerine-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} Global Ducan · e-commerce globalized
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PaymentLogos />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Globe2 className="h-3.5 w-3.5" /> Shipping to 20+ countries
          </div>
        </div>
      </div>
    </footer>
  )
}

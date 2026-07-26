import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, Newspaper, ExternalLink, Play } from 'lucide-react'
import Logo from './Logo'
import PaymentLogos from './PaymentLogos'
import { appStores } from '../data/apps'

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
      { label: 'Get the app', to: '/apps' },
      { label: 'New user guide', to: '/guide' },
      { label: 'Refer & earn', to: '/refer' },
      { label: 'Support', to: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & conditions', to: '/account' },
      { label: 'Privacy policy', to: '/account' },
      { label: 'Shipping fees & restrictions', to: '/shipping' },
      { label: 'Refunds', to: '/account' },
    ],
  },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/globalducan/',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.6.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.4 1.4.5 2.6.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.5 2.6-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.4-2.6.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.6-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.4-1.4-.5-2.6-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.5-2.6.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.4 2.6-.5 1.2-.1 1.6-.1 4.8-.1Zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8Zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm5.6-3.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/globalducan/',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/global-ducan/',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@GlobalDucan',
    path: 'M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 7.6.3 7.6.3s4.6 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8ZM9.7 15.1V8.6l6.2 3.3-6.2 3.2Z',
  },
]

const press = [
  {
    source: 'Standard.mv',
    kind: 'Article',
    title: 'Global Ducan brings Indian e-commerce to Maldivian doorsteps',
    href: 'https://standard.mv/global-ducan-brings-indian-e-commerce-to-maldivian-doorsteps/',
    img: '/news/1-standard.jpg',
    branded: false,
  },
  {
    source: 'Maldives Post',
    kind: 'Video',
    title: 'Shop your favourite Indian brands without the hassle',
    href: 'https://www.facebook.com/maldivespost/videos/904808475674841/',
    img: '',
    branded: true,
  },
  {
    source: 'Bhutan Post',
    kind: 'Video',
    title: 'Shop online with Global Ducan',
    href: 'https://www.facebook.com/bhutanpost11001/videos/643781955130302/',
    img: '/news/3-bhutan.jpg',
    branded: false,
  },
  {
    source: 'Instagram',
    kind: 'Reel',
    title: 'Global Ducan featured on Instagram',
    href: 'https://www.instagram.com/reel/DWodxfPjaZ0/',
    img: '/news/4-instagram.jpg',
    branded: false,
  },
  {
    source: 'Edition.mv',
    kind: 'Article',
    title: "Global Ducan: India's e-commerce marketplace now open to Maldives",
    href: 'https://edition.mv/business/50885',
    img: '/news/5-edition.jpg',
    branded: false,
  },
  {
    source: 'Maldives Post',
    kind: 'Post',
    title: 'India is now just a click away with Global Ducan',
    href: 'https://www.facebook.com/maldivespost/posts/1339380111548370/',
    img: '/news/6-maldivespost-a.jpg',
    branded: false,
  },
  {
    source: 'Maldives Post',
    kind: 'Post',
    title: 'Shop from the biggest e-commerce platforms in India',
    href: 'https://www.facebook.com/maldivespost/posts/1359492606203787/',
    img: '/news/7-maldivespost-b.jpg',
    branded: false,
  },
  {
    source: 'Mauritius Post',
    kind: 'Video',
    title: 'Shop India with Global Ducan — delivered by Mauritius Post',
    href: 'https://www.facebook.com/share/r/14j38PsdGuZ/',
    img: '/news/8-share.jpg',
    branded: false,
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-900/5 bg-navy-950 text-white dark:border-white/10 dark:bg-[#0f1111]">
      {/* In the news — auto-scrolling marquee with previews */}
      <div className="border-b border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-300">
            <Newspaper className="h-3.5 w-3.5" /> In the news
          </div>
        </div>
        <div className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="flex w-max animate-ticker gap-4 px-4 group-hover:[animation-play-state:paused] sm:px-6">
            {[...press, ...press].map((p, i) => (
              <a
                key={i}
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.kind} · ${p.title} (${p.source})`}
                className="group/card w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-tangerine-400/40 hover:bg-white/10"
              >
                <div className="relative aspect-video overflow-hidden bg-white/10">
                  {p.branded ? (
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
            {socials.map((s) => (
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

import { Link } from 'react-router-dom'
import { ArrowRight, Globe2 } from 'lucide-react'
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
      { label: 'About', to: '/account' },
      { label: 'New user guide', to: '/guide' },
      { label: 'Refer & earn', to: '/refer' },
      { label: 'Support', to: '/support' },
      { label: 'Contact us', to: '/support' },
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
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.6.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.4 1.4.5 2.6.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.5 2.6-.3.7-.6 1.2-1.2 1.8-.6.6-1.1.9-1.8 1.2-.7.3-1.4.4-2.6.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.6-.5-.7-.3-1.2-.6-1.8-1.2-.6-.6-.9-1.1-1.2-1.8-.3-.7-.4-1.4-.5-2.6-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.5-2.6.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.4 2.6-.5 1.2-.1 1.6-.1 4.8-.1Zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8Zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm5.6-3.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z',
  },
  {
    label: 'X',
    path: 'M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.1h1.7L7.6 4.7H5.8l10.9 14.4Z',
  },
  {
    label: 'Facebook',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  },
  {
    label: 'YouTube',
    path: 'M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 7.6.3 7.6.3s4.6 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8ZM9.7 15.1V8.6l6.2 3.3-6.2 3.2Z',
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-900/5 bg-navy-950 text-white dark:border-white/10 dark:bg-[#0f1111]">
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
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={appStores.ios.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition hover:border-tangerine-400/50 hover:text-tangerine-300"
            >
              App Store
            </a>
            <a
              href={appStores.android.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition hover:border-tangerine-400/50 hover:text-tangerine-300"
            >
              Google Play
            </a>
          </div>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
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
            <Globe2 className="h-3.5 w-3.5" /> Shipping to 180+ countries
          </div>
        </div>
      </div>
    </footer>
  )
}

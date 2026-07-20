import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  Package,
  Wallet,
  MapPin,
  TicketPercent,
  Users,
  Headphones,
  Heart,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/account', label: 'Overview', icon: LayoutGrid },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/addresses', label: 'Addresses', icon: MapPin },
  { to: '/coupons', label: 'Coupons', icon: TicketPercent },
  { to: '/refer', label: 'Refer & earn', icon: Users },
  { to: '/support', label: 'Support', icon: Headphones },
]

interface AccountLayoutProps {
  /** Current page name, shown in the breadcrumb and as the page title */
  title: string
  description?: string
  /** Right-aligned header content (filters, buttons) */
  actions?: ReactNode
  children: ReactNode
}

/**
 * Enterprise account shell: breadcrumb, sticky section sidebar (desktop) /
 * horizontal pill nav (mobile), and a full-width content pane.
 */
export default function AccountLayout({ title, description, actions, children }: AccountLayoutProps) {
  const { pathname } = useLocation()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link to="/" className="transition hover:text-navy-700 dark:hover:text-cream-50">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/account" className="transition hover:text-navy-700 dark:hover:text-cream-50">
          Your account
        </Link>
        {pathname !== '/account' && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-navy-800 dark:text-white">{title}</span>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        {/* Sidebar — sticky rail on desktop, scrollable pills on mobile */}
        <aside className="lg:sticky lg:top-44 lg:self-start">
          <nav className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-navy-800 text-white shadow-md shadow-navy-800/20 dark:bg-white dark:text-navy-900'
                      : 'text-navy-800/70 hover:bg-navy-900/5 hover:text-navy-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
              {description && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              )}
            </div>
            {actions}
          </div>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  )
}

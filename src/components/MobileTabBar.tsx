import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/capture', label: 'Add', icon: PlusCircle },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/account', label: 'Account', icon: User },
]

/** App-style bottom navigation, mobile only. */
export default function MobileTabBar() {
  const { count } = useCart()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-cream-50/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-black">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                isActive
                  ? 'text-navy-800 dark:text-tangerine-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            <span className="relative">
              <tab.icon className="h-5 w-5" />
              {tab.to === '/cart' && count > 0 && (
                <span
                  key={count}
                  className="absolute -right-2 -top-1.5 flex h-4 w-4 animate-pop items-center justify-center rounded-full bg-tangerine-500 text-[9px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

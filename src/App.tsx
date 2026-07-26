import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ClipboardAssist from './components/ClipboardAssist'
import MobileTabBar from './components/MobileTabBar'
import RouteProgress from './components/RouteProgress'
import RequireAuth from './components/RequireAuth'
import NoticeBar from './components/NoticeBar'
import StoreRail from './components/StoreRail'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { WishlistProvider } from './context/WishlistContext'
import { LocaleProvider } from './context/LocaleContext'
import { AddressProvider } from './context/AddressContext'
import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { HomeDataProvider } from './context/HomeDataContext'
import { ShopGateProvider } from './components/ShopGate'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Wallet from './pages/Wallet'
import Login from './pages/Login'
import Account from './pages/Account'
import Capture from './pages/Capture'
import WaysToShop from './pages/WaysToShop'
import Addresses from './pages/Addresses'
import Coupons from './pages/Coupons'
import Refer from './pages/Refer'
import Support from './pages/Support'
import Wishlist from './pages/Wishlist'
import UserGuide from './pages/UserGuide'
import Shipping from './pages/Shipping'
import Apps from './pages/Apps'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageRoutes() {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="animate-page-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        {/* Mobile app referral links point here: /register?referralCode=XXXX */}
        <Route path="/register" element={<Login />} />
        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/ways-to-shop" element={<WaysToShop />} />
        <Route path="/addresses" element={<RequireAuth><Addresses /></RequireAuth>} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/support" element={<Support />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <CurrencyProvider>
        <HomeDataProvider>
        <AddressProvider>
          <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <BrowserRouter>
                <ShopGateProvider>
                  <ScrollToTop />
                  <RouteProgress />
                  <div className="sticky top-0 z-40">
                    <NoticeBar />
                    <Header />
                  </div>
                  <StoreRail />
                  <PageRoutes />
                  <div className="h-16 md:hidden" />
                  <MobileTabBar />
                  <ClipboardAssist />
                </ShopGateProvider>
              </BrowserRouter>
            </OrdersProvider>
          </WishlistProvider>
          </CartProvider>
        </AddressProvider>
        </HomeDataProvider>
        </CurrencyProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}

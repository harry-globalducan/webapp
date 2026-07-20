import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ClipboardAssist from './components/ClipboardAssist'
import MobileTabBar from './components/MobileTabBar'
import NoticeBar from './components/NoticeBar'
import StoreRail from './components/StoreRail'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { WishlistProvider } from './context/WishlistContext'
import { LocaleProvider } from './context/LocaleContext'
import { AddressProvider } from './context/AddressContext'
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
        <Route path="/orders" element={<Orders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/ways-to-shop" element={<WaysToShop />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/support" element={<Support />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/shipping" element={<Shipping />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <AddressProvider>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <BrowserRouter>
                <ShopGateProvider>
                  <ScrollToTop />
                  <div className="sticky top-0 z-40">
                    <NoticeBar />
                    <Header />
                    <StoreRail />
                  </div>
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
    </LocaleProvider>
  )
}

import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Rooms from './pages/Rooms.jsx'
import Listing from './pages/Listing.jsx'
import Booking from './pages/Booking.jsx'
import Payment from './pages/Payment.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

function App() {
  const location = useLocation()
  const hideChrome = location.pathname.startsWith('/dashboard')

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <main className="flex-1" key={location.pathname}>
        <div className="animate-fade-in">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/search" element={<Rooms />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      {!hideChrome && <Footer />}
    </div>
  )
}

export default App

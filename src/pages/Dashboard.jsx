import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira, stays } from '../data/stays'

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: (a) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  )},
  { id: 'bookings', label: 'My Bookings', icon: (a) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )},
  { id: 'favorites', label: 'Favorites', icon: (a) => (
    <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  )},
  { id: 'reviews', label: 'Reviews', icon: (a) => (
    <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  )},
  { id: 'profile', label: 'Profile', icon: (a) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  )},
  { id: 'notifications', label: 'Notifications', icon: (a) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  )},
  { id: 'settings', label: 'Settings', icon: (a) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 2.2 : 1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
]

const MOCK_BOOKINGS = [
  { id: 'SLC-2026-001', hotel: 'Solace Grand Hotel', room: 'Executive Suite', location: 'Victoria Island, Lagos', checkIn: '2026-07-15', checkOut: '2026-07-18', guests: 2, status: 'confirmed', total: 93000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', payment: 'Paystack' },
  { id: 'SLC-2026-002', hotel: 'Luxury Suites', room: 'Deluxe Suite', location: 'GRA, Port Harcourt', checkIn: '2026-08-05', checkOut: '2026-08-08', guests: 2, status: 'pending', total: 540000, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80', payment: 'Bank Transfer' },
  { id: 'SLC-2026-003', hotel: 'Oceanview Loft', room: 'Standard Room', location: 'Lekki, Lagos', checkIn: '2026-06-20', checkOut: '2026-06-22', guests: 1, status: 'completed', total: 150000, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80', payment: 'Debit Card' },
]

const MOCK_REVIEWS = [
  { id: 1, stay: 'Oceanview Loft', date: '2026-06-25', rating: 5, text: 'Absolutely stunning views and spotless rooms. The host was incredibly responsive!', helpful: 12 },
  { id: 2, stay: 'Solace Grand Hotel', date: '2026-05-18', rating: 4, text: 'Great location and excellent breakfast. Pool area gets busy on weekends.', helpful: 8 },
]

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Booking confirmed', body: 'SLC-2026-001 for Solace Grand Hotel is confirmed for Jul 15–18.', time: '2h ago', unread: true, icon: '✅' },
  { id: 2, title: 'Payment received', body: '₦540,000 received via bank transfer. Awaiting property confirmation.', time: '1d ago', unread: true, icon: '💳' },
  { id: 3, title: 'New reward points', body: 'You earned 120 pts from your last stay. Balance: 420 pts.', time: '3d ago', unread: false, icon: '🎁' },
  { id: 4, title: 'Price drop alert', body: 'Mountain Retreat in Obudu dropped 15% for your dates.', time: '5d ago', unread: false, icon: '📉' },
]

function statusBadge(status) {
  if (status === 'confirmed') return 'bg-green-100 text-green-800'
  if (status === 'pending') return 'bg-amber-100 text-amber-800'
  return 'bg-indigo-100 text-indigo-800'
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function BookingDetailModal({ booking, onClose }) {
  useEffect(() => {
    if (!booking) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [booking, onClose])

  if (!booking) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Booking ${booking.id} details`}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={booking.image} alt="" className="w-full h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/95 rounded-full shadow hover:scale-105 transition-transform" aria-label="Close details">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">{booking.id}</p>
              <h3 className="text-white text-xl font-semibold leading-tight">{booking.hotel}</h3>
              <p className="text-white/80 text-sm">{booking.room} • {booking.location}</p>
            </div>
            <span className={`badge px-3 py-1.5 ${statusBadge(booking.status)}`}>{booking.status}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              ['Check-in', formatDate(booking.checkIn)],
              ['Check-out', formatDate(booking.checkOut)],
              ['Guests', `${booking.guests} guest${booking.guests > 1 ? 's' : ''}`],
              ['Payment', booking.payment],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-neutral-50 border border-neutral-100 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">{k}</p>
                <p className="font-bold text-neutral-900 text-[15px]">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center rounded-2xl bg-neutral-950 text-white px-5 py-4 mb-5">
            <span className="font-semibold">Total paid</span>
            <span className="font-semibold text-lg">{formatNaira(booking.total)}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-secondary flex-1 py-3">Close</button>
            <button onClick={() => { navigator.clipboard?.writeText(booking.id); }} className="btn btn-primary flex-1 py-3">Copy Booking ID</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [query, setQuery] = useState('')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [profile, setProfile] = useState({ name: 'Jephthah', email: 'jephthah@example.com', phone: '+234 800 000 0000', city: 'Lagos, Nigeria' })
  const [prefs, setPrefs] = useState({ emailAlerts: true, smsAlerts: false, priceDrops: true, newsletter: true })
  const [favorites, setFavorites] = useState(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('solace_favorites') || '[]')
      if (ids.length) return stays.filter((s) => ids.includes(s.id))
      return [
        { ...stays[0], price: stays[0].nairaPrice },
        { ...stays[1], price: stays[1].nairaPrice },
      ]
    } catch {
      return []
    }
  })

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 1024)
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const unreadCount = notifications.filter((n) => n.unread).length

  const filteredBookings = useMemo(() => {
    if (!query.trim()) return MOCK_BOOKINGS
    const q = query.toLowerCase()
    return MOCK_BOOKINGS.filter((b) => b.hotel.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.room.toLowerCase().includes(q))
  }, [query])

  const stats = [
    { label: 'Total Bookings', value: MOCK_BOOKINGS.length, sub: '+2 this month', icon: '📅', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Favorites', value: favorites.length, sub: `${favorites.length} saved stays`, icon: '❤️', bg: 'bg-primary-50 text-primary-600' },
    { label: 'Reward Points', value: '420', sub: '≈ ₦8,400 value', icon: '🎁', bg: 'bg-neutral-100 text-neutral-900' },
    { label: 'Wallet Balance', value: formatNaira(25000), sub: 'Available for trips', icon: '👛', bg: 'bg-green-50 text-green-600' },
  ]

  const removeFavorite = (id) => {
    setFavorites((f) => {
      const next = f.filter((x) => (x.id ?? x.title) !== id && x.id !== id)
      const ids = next.map((x) => x.id).filter(Boolean)
      localStorage.setItem('solace_favorites', JSON.stringify(ids))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-neutral-950 text-white flex flex-col transition-transform duration-300 ease-out ${sidebarOpen ? 'tranneutral-x-0' : '-tranneutral-x-full'} lg:tranneutral-x-0`} aria-label="Dashboard navigation">
        <div className="p-6 pb-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF385C] to-[#E00b41] flex items-center justify-center text-white font-bold">S</span>
            Solace
          </Link>
          <p className="text-xs text-neutral-400 mt-1 ml-11">Guest dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">Menu</p>
          <ul className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false) }}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-[15px] font-medium transition-all duration-200 ${
                      active ? 'bg-white text-neutral-950 shadow-lg' : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={active ? 'text-primary-600' : 'text-neutral-400'}>{item.icon(active)}</span>
                    {item.label}
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span className="ml-auto min-w-6 h-6 px-1.5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">{unreadCount}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mx-1 mt-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
            <p className="font-bold text-white mb-1">Refer & earn</p>
            <p className="text-sm text-white/80 mb-4">Get ₦5,000 credit for every friend who books.</p>
            <button className="w-full py-2.5 rounded-full bg-white text-neutral-900 text-sm font-bold hover:bg-neutral-100 transition-colors">Invite friends</button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => alert('You have been logged out (demo)')} className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors text-[15px] font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 lg:ml-[280px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-neutral-200">
          <div className="flex items-center gap-3 px-6 sm:px-10 lg:px-20 h-16">
            <button className="lg:hidden p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-neutral-950 leading-none">
                {activeTab === 'dashboard' ? 'Welcome back, Jephthah 👋' : SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">Here is what is happening with your trips today.</p>
            </div>
            <div className="flex-1" />
            <div className="hidden md:flex items-center relative">
              <svg className="absolute left-3 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings…" className="pl-9 pr-4 py-2.5 text-sm bg-neutral-100 border border-transparent rounded-full w-56 focus:bg-white focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200 outline-none transition-all" aria-label="Search bookings" />
            </div>
            <button onClick={() => setActiveTab('notifications')} className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors" aria-label={`Notifications, ${unreadCount} unread`}>
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-white" />}
            </button>
            <button onClick={() => setActiveTab('profile')} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition-colors" aria-label="Open profile">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF385C] to-[#E00b41] text-white font-bold flex items-center justify-center">J</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 sm:px-10 lg:px-20 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
                {stats.map((s, i) => (
                  <div key={s.label} className="card p-5 hover-lift animate-slide-up" style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${s.bg}`}>{s.icon}</span>
                      <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">{s.sub}</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">{s.label}</p>
                    <p className="text-2xl font-semibold text-neutral-950">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                <section className="card overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                      <h2 className="font-semibold text-neutral-950">Recent Bookings</h2>
                      <p className="text-sm text-neutral-500">Click any row to view full details</p>
                    </div>
                    <button onClick={() => setActiveTab('bookings')} className="text-sm font-bold text-primary-600 hover:text-primary-700">View all →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-50/80">
                          <th className="px-6 py-3 font-bold">Stay</th>
                          <th className="px-4 py-3 font-bold">Dates</th>
                          <th className="px-4 py-3 font-bold">Status</th>
                          <th className="px-4 py-3 font-bold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} onClick={() => setSelectedBooking(b)} className="hover:bg-primary-50/40 cursor-pointer transition-colors group" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' ? setSelectedBooking(b) : null)} aria-label={`View booking ${b.id}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={b.image} alt="" className="w-11 h-11 rounded-2xl object-cover flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-bold text-neutral-900 text-[15px] truncate group-hover:text-primary-700 transition-colors">{b.hotel}</p>
                                  <p className="text-xs text-neutral-500">{b.id} • {b.room}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-neutral-600 whitespace-nowrap">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                            <td className="px-4 py-4"><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                            <td className="px-4 py-4 text-right font-bold text-neutral-900 whitespace-nowrap">{formatNaira(b.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="space-y-6">
                  <section className="card p-6">
                    <h3 className="font-semibold text-neutral-950 mb-1">Upcoming trip</h3>
                    <p className="text-sm text-neutral-500 mb-4">Your next check-in</p>
                    <img src={MOCK_BOOKINGS[0].image} alt="" className="w-full h-36 object-cover rounded-2xl mb-4" />
                    <p className="font-bold text-neutral-900">{MOCK_BOOKINGS[0].hotel}</p>
                    <p className="text-sm text-neutral-500 mb-4">{formatDate(MOCK_BOOKINGS[0].checkIn)} • {MOCK_BOOKINGS[0].guests} guests</p>
                    <button onClick={() => setSelectedBooking(MOCK_BOOKINGS[0])} className="btn btn-primary w-full py-3 text-sm">View itinerary</button>
                  </section>

                  <section className="rounded-3xl bg-neutral-950 text-white p-6 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/20 rounded-full blur-2xl" />
                    <p className="text-sm text-white/70 mb-1">Rewards balance</p>
                    <p className="text-3xl font-semibold mb-1">420 pts</p>
                    <div className="h-2 rounded-full bg-white/15 mb-3 overflow-hidden"><div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#FF385C] to-[#E00b41] transition-all duration-1000" /></div>
                    <p className="text-xs text-white/70 mb-4">80 pts to unlock Silver tier + 10% off</p>
                    <button className="w-full py-2.5 rounded-full bg-white text-neutral-950 text-sm font-bold hover:bg-neutral-100 transition-colors">Redeem points</button>
                  </section>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight">All Bookings</h2>
                  <p className="text-neutral-500 text-sm mt-1">Click a card to see full itinerary, payment and guest details.</p>
                </div>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by hotel or ID…" className="input max-w-xs !rounded-full !py-2.5 text-sm" aria-label="Filter bookings" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                {filteredBookings.map((b, i) => (
                  <article key={b.id} onClick={() => setSelectedBooking(b)} onKeyDown={(e) => e.key === 'Enter' && setSelectedBooking(b)} tabIndex={0} role="button" aria-label={`Open details for ${b.hotel}`}
                    className="card p-5 flex gap-4 cursor-pointer hover-lift animate-slide-up" style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}>
                    <img src={b.image} alt="" className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900 leading-snug">{b.hotel}</h3>
                        <span className={`badge flex-shrink-0 ${statusBadge(b.status)}`}>{b.status}</span>
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">{b.room} • {formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                      <div className="flex items-center justify-between">
                        <strong className="text-neutral-900">{formatNaira(b.total)}</strong>
                        <span className="text-sm font-bold text-primary-600">View Details →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {filteredBookings.length === 0 && (
                <div className="card p-12 text-center">
                  <p className="font-bold text-neutral-900 mb-1">No bookings match “{query}”</p>
                  <p className="text-sm text-neutral-500">Try a different search or browse stays.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight mb-1">My Favorites</h2>
              <p className="text-neutral-500 text-sm mb-6">{favorites.length} saved • synced across devices</p>
              {favorites.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-4xl mb-3">💔</p>
                  <p className="font-bold text-neutral-900 mb-1">No favorites yet</p>
                  <p className="text-sm text-neutral-500 mb-5">Tap the heart on any stay to save it here.</p>
                  <Link to="/rooms" className="btn btn-primary px-8 py-3">Explore stays</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                  {favorites.map((fav, i) => (
                    <article key={fav.id ?? fav.title} className="card overflow-hidden hover-lift animate-slide-up" style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}>
                      <div className="relative">
                        <img src={fav.image || `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80`} alt={fav.title} className="w-full h-44 object-cover" />
                        <button onClick={() => removeFavorite(fav.id)} className="absolute top-3 right-3 p-2 bg-white/95 rounded-full shadow hover:scale-110 transition-transform" aria-label={`Remove ${fav.title}`}>
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{fav.location}</p>
                        <h3 className="font-semibold text-neutral-900 mb-1">{fav.title}</h3>
                        <p className="font-semibold text-primary-600 mb-4">{formatNaira(fav.nairaPrice || fav.price || 0)}<span className="text-sm font-medium text-neutral-500">/night</span></p>
                        <div className="flex gap-2">
                          <Link to={`/booking?stay=${fav.id}`} className="btn btn-primary flex-1 py-2.5 text-sm">Book now</Link>
                          <button onClick={() => removeFavorite(fav.id)} className="btn btn-secondary px-4 py-2.5 text-sm">Remove</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in max-w-3xl">
              <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight mb-1">My Reviews</h2>
              <p className="text-neutral-500 text-sm mb-6">Your feedback helps hosts improve.</p>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((r, i) => (
                  <article key={r.id} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{r.stay}</h3>
                        <p className="text-xs text-neutral-500">{formatDate(r.date)}</p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">★ {r.rating}.0</span>
                    </div>
                    <p className="text-neutral-600 mb-4">“{r.text}”</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="font-semibold text-neutral-600 hover:text-neutral-900">👍 Helpful ({r.helpful})</button>
                      <button className="font-semibold text-neutral-600 hover:text-neutral-900">Edit</button>
                      <button className="font-semibold text-red-500 hover:text-red-600">Delete</button>
                    </div>
                  </article>
                ))}
                <div className="card p-6 border-dashed !border-2 !border-neutral-200 !shadow-none text-center">
                  <p className="font-bold text-neutral-900 mb-1">Stayed somewhere recently?</p>
                  <p className="text-sm text-neutral-500 mb-4">Share your experience to earn 20 reward points.</p>
                  <button className="btn btn-secondary px-6 py-2.5 text-sm">Write a review</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight mb-1">Profile</h2>
              <p className="text-neutral-500 text-sm mb-6">Keep your details up to date for faster checkout.</p>
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF385C] to-[#E00b41] text-white text-2xl font-semibold flex items-center justify-center">J</span>
                  <div>
                    <p className="font-semibold text-neutral-900 text-lg">{profile.name}</p>
                    <p className="text-sm text-neutral-500">Member since 2024 • Verified ✅</p>
                  </div>
                  <button className="ml-auto btn btn-secondary px-4 py-2 text-sm">Change photo</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['Full name', 'name', profile.name],
                    ['Email', 'email', profile.email],
                    ['Phone', 'phone', profile.phone],
                    ['City', 'city', profile.city],
                  ].map(([label, key, val]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2" htmlFor={`profile-${key}`}>{label}</label>
                      <input id={`profile-${key}`} value={val} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} className="input" />
                    </div>
                  ))}
                </div>
                <button onClick={() => alert('Profile saved (demo)')} className="btn btn-primary w-full sm:w-auto px-10 py-3.5 mt-6">Save changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight">Notifications</h2>
                  <p className="text-neutral-500 text-sm">{unreadCount} unread</p>
                </div>
                <button onClick={() => setNotifications((n) => n.map((x) => ({ ...x, unread: false })))} className="text-sm font-bold text-primary-600 hover:text-primary-700">Mark all read</button>
              </div>
              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <div key={n.id} className={`card p-5 flex gap-4 animate-slide-up transition-all ${n.unread ? '!border-primary-200' : ''}`} style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                    <span className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl flex-shrink-0">{n.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-neutral-900 text-[15px]">{n.title}</p>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" aria-label="Unread" />}
                      </div>
                      <p className="text-sm text-neutral-600">{n.body}</p>
                      <p className="text-xs text-neutral-400 mt-1.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="text-2xl font-semibold text-neutral-950 tracking-tight mb-1">Settings</h2>
              <p className="text-neutral-500 text-sm mb-6">Control how Solace works for you.</p>
              <div className="card divide-y divide-neutral-100">
                {[
                  ['Email alerts', 'Booking confirmations & receipts', 'emailAlerts'],
                  ['SMS alerts', 'Check-in reminders via SMS', 'smsAlerts'],
                  ['Price-drop alerts', 'Notify me when saved stays drop', 'priceDrops'],
                  ['Newsletter', 'Travel inspiration, monthly', 'newsletter'],
                ].map(([title, desc, key]) => (
                  <div key={key} className="flex items-center gap-4 px-6 py-5">
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 text-[15px]">{title}</p>
                      <p className="text-sm text-neutral-500">{desc}</p>
                    </div>
                    <button role="switch" aria-checked={prefs[key]} aria-label={title} onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                      className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${prefs[key] ? 'bg-primary-500 justify-end' : 'bg-neutral-200 justify-start'}`} style={{ display: 'flex' }}>
                      <span className="w-5 h-5 rounded-full bg-white shadow transition-all duration-300" />
                    </button>
                  </div>
                ))}
                <div className="px-6 py-5 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-neutral-900 text-[15px]">Currency</p>
                    <p className="text-sm text-neutral-500">Prices shown in</p>
                  </div>
                  <select className="input !w-auto !rounded-full !py-2.5 text-sm font-semibold" defaultValue="NGN" aria-label="Currency">
                    <option value="NGN">₦ NGN — Naira</option>
                    <option value="USD">$ USD — Dollar</option>
                  </select>
                </div>
              </div>
              <div className="card p-6 mt-5 !border-red-200">
                <p className="font-bold text-red-700 mb-1">Danger zone</p>
                <p className="text-sm text-neutral-500 mb-4">Delete your account and all booking history. This cannot be undone.</p>
                <button onClick={() => confirm('Delete account? (demo)') && alert('Account deletion requested')} className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors">Delete account</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  )
}

export default Dashboard

import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../data/stays'
import StayCard from '../components/StayCard'

function formatShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SearchIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

/* ─── Hero search ─────────────────────────────────────────── */

function HeroSearch() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(0)
  const [panel, setPanel] = useState(null)
  const today = new Date().toISOString().split('T')[0]

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests > 0) params.set('guests', String(guests))
    navigate(`/rooms?${params.toString()}`)
  }

  const dateLabel = checkIn
    ? checkOut
      ? `${formatShort(checkIn)} – ${formatShort(checkOut)}`
      : formatShort(checkIn)
    : 'Add dates'
  const guestLabel = guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'

  return (
    <form onSubmit={submit} className="relative">
      <div className="max-w-3xl mx-auto flex items-center bg-white border border-neutral-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 py-2 px-4 divide-x divide-neutral-200">
        {/* Where */}
        <label className="min-w-0 flex-1 cursor-text rounded-full px-5 py-1 transition-colors hover:bg-neutral-100">
          <span className="block text-xs font-semibold leading-4 text-neutral-900">Where</span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search destinations"
            aria-label="Where"
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
          />
        </label>

        {/* When */}
        <button
          type="button"
          onClick={() => setPanel(panel === 'when' ? null : 'when')}
          className={`hidden min-w-0 flex-1 rounded-full px-5 py-1 text-left transition-colors hover:bg-neutral-100 sm:block ${panel === 'when' ? 'bg-neutral-100' : ''}`}
        >
          <span className="block text-xs font-semibold leading-4 text-neutral-900">When</span>
          <span className={`block truncate text-sm ${checkIn ? 'text-neutral-900' : 'text-neutral-500'}`}>{dateLabel}</span>
        </button>

        {/* Who */}
        <button
          type="button"
          onClick={() => setPanel(panel === 'who' ? null : 'who')}
          className={`hidden min-w-0 flex-1 rounded-full px-5 py-1 text-left transition-colors hover:bg-neutral-100 sm:block ${panel === 'who' ? 'bg-neutral-100' : ''}`}
        >
          <span className="block text-xs font-semibold leading-4 text-neutral-900">Who</span>
          <span className={`block truncate text-sm ${guests ? 'text-neutral-900' : 'text-neutral-500'}`}>{guestLabel}</span>
        </button>

        <div className="pl-2">
          <button
            type="submit"
            aria-label="Search stays"
            className="bg-[#FF385C] hover:bg-[#E00b41] text-white rounded-full p-3 transition-colors"
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {panel && <div className="fixed inset-0 z-30" onClick={() => setPanel(null)} />}

      {panel === 'when' && (
        <div className="absolute left-1/2 top-full z-40 mt-3 flex -translate-x-1/2 gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500" htmlFor="hero-checkin">
              Check in
            </label>
            <input
              id="hero-checkin"
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500" htmlFor="hero-checkout">
              Check out
            </label>
            <input
              id="hero-checkout"
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900"
            />
          </div>
        </div>
      )}

      {panel === 'who' && (
        <div className="absolute right-14 top-full z-40 mt-3 w-72 rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Guests</p>
              <p className="text-sm text-neutral-500">How many guests?</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(0, g - 1))}
                disabled={guests === 0}
                aria-label="Fewer guests"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg text-neutral-600 transition-colors hover:border-neutral-900 disabled:opacity-35"
              >
                −
              </button>
              <span className="w-4 text-center text-sm font-medium text-neutral-900">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(16, g + 1))}
                aria-label="More guests"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-lg text-neutral-600 transition-colors hover:border-neutral-900"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

/* ─── Location carousel ──────────────────────────────────── */

function LocationSection({ location, favorites, onToggleFavorite }) {
  const scrollerRef = useRef(null)

  const scroll = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.85), behavior: 'smooth' })
  }

  return (
    <section aria-labelledby={`section-${location.key}`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            to={`/rooms?destination=${encodeURIComponent(location.city)}`}
            className="group inline-flex items-center gap-2"
          >
            <h2
              id={`section-${location.key}`}
              className="text-xl font-semibold tracking-tight text-neutral-900 group-hover:underline lg:text-2xl"
            >
              {location.title}
            </h2>
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors group-hover:bg-neutral-100">
              <svg className="h-4 w-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <p className="mt-1 text-sm text-neutral-500">{location.subtitle}</p>
        </div>

        <div className="hidden flex-none items-center gap-2 pb-1 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${location.title} left`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition-colors hover:bg-neutral-100 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${location.title} right`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition-colors hover:bg-neutral-100 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="no-scrollbar flex snap-x gap-6 overflow-x-auto scroll-smooth pb-1">
        {location.stays.map((stay) => (
          <div
            key={stay.id}
            className="w-[calc(50%_-_12px)] flex-none snap-start sm:w-[calc(33.333%_-_16px)] lg:w-[calc(25%_-_18px)] xl:w-[calc(16.6667%_-_20px)]"
          >
            <StayCard
              stay={stay}
              isFavorite={favorites.has(stay.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

function Home() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('solace_favorites') || '[]'))
    } catch {
      return new Set()
    }
  })

  const toggleFavorite = (stay) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(stay.id)) next.delete(stay.id)
      else next.add(stay.id)
      localStorage.setItem('solace_favorites', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <h1 className="sr-only">Find your next stay</h1>
      {/* Hero search */}
      <section className="border-b border-neutral-200 bg-white pb-8 pt-6 lg:pb-10 lg:pt-8">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <HeroSearch />
        </div>
      </section>

      {/* Location carousels */}
      <div className="mx-auto w-full max-w-[1440px] space-y-12 px-6 pb-20 pt-10 sm:px-10 lg:px-20 lg:pt-12">
        {LOCATIONS.map((location) => (
          <LocationSection
            key={location.key}
            location={location}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default Home

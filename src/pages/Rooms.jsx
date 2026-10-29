import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { stays } from '../data/stays'
import StayCard from '../components/StayCard'
import StayDetailModal from '../components/StayDetailModal'

function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [guests, setGuests] = useState(searchParams.get('guests') || '1')
  const [selectedStay, setSelectedStay] = useState(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('solace_favorites') || '[]'))
    } catch {
      return new Set()
    }
  })

  const minCheckIn = new Date().toISOString().split('T')[0]
  const minCheckOut = checkIn || minCheckIn

  useEffect(() => {
    const dest = searchParams.get('destination')
    if (dest !== null) setDestination(dest)
  }, [searchParams])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests && guests !== '1') params.set('guests', guests)
    setSearchParams(params)
  }

  const toggleFavorite = (stay) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(stay.id)) next.delete(stay.id)
      else next.add(stay.id)
      localStorage.setItem('solace_favorites', JSON.stringify([...next]))
      return next
    })
  }

  const filteredStays = useMemo(() => {
    let result = stays
    if (destination.trim()) {
      const q = destination.toLowerCase()
      result = result.filter(
        (s) => s.location.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
      )
    }
    const sorted = [...result]
    if (sortBy === 'price-low') sorted.sort((a, b) => a.nairaPrice - b.nairaPrice)
    if (sortBy === 'price-high') sorted.sort((a, b) => b.nairaPrice - a.nairaPrice)
    if (sortBy === 'rating') sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    return sorted
  }, [destination, sortBy])

  const clearFilters = () => {
    setDestination('')
    setCheckIn('')
    setCheckOut('')
    setGuests('1')
    setSearchParams({})
  }

  return (
    <section className="min-h-screen bg-white py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 lg:text-4xl">
              {destination.trim() ? `Stays in ${destination.trim()}` : 'All stays'}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {filteredStays.length} {filteredStays.length === 1 ? 'stay' : 'stays'} available
              {checkIn && checkOut ? ` · ${checkIn} → ${checkOut}` : ''} · Select any card for full details
            </p>
          </div>

          {/* Search pill */}
          <form onSubmit={handleSearch} className="animate-slide-up">
            <div className="mx-auto flex max-w-5xl flex-col items-stretch rounded-3xl border border-neutral-200 bg-white p-2 shadow-md transition-all duration-200 hover:shadow-lg lg:flex-row lg:items-center lg:divide-x lg:divide-neutral-200 lg:rounded-full lg:px-4 lg:py-2">
              <div className="flex min-w-0 flex-1 flex-col rounded-full px-5 py-3 transition-colors hover:bg-neutral-100 lg:py-1">
                <label htmlFor="where" className="text-xs font-semibold text-neutral-900">Where</label>
                <input
                  id="where"
                  type="text"
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col rounded-full px-5 py-3 transition-colors hover:bg-neutral-100 lg:py-1">
                <label htmlFor="checkin" className="text-xs font-semibold text-neutral-900">Check in</label>
                <input
                  id="checkin"
                  type="date"
                  min={minCheckIn}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-sm text-neutral-900 outline-none"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col rounded-full px-5 py-3 transition-colors hover:bg-neutral-100 lg:py-1">
                <label htmlFor="checkout" className="text-xs font-semibold text-neutral-900">Check out</label>
                <input
                  id="checkout"
                  type="date"
                  min={minCheckOut}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-sm text-neutral-900 outline-none"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col rounded-full px-5 py-3 transition-colors hover:bg-neutral-100 lg:py-1">
                <label htmlFor="guests" className="text-xs font-semibold text-neutral-900">Who</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="cursor-pointer bg-transparent text-sm text-neutral-900 outline-none"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5+ guests</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 p-1 lg:pl-3">
                {(destination || checkIn || checkOut) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search stays"
                  className="rounded-full bg-[#FF385C] p-3 text-white transition-colors hover:bg-[#E00b41]"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Toolbar */}
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 font-medium text-neutral-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available now
              </span>
              <span className="hidden sm:inline">Prices include taxes where applicable</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-neutral-500">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 outline-none transition-colors hover:border-neutral-900"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredStays.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8">
              {filteredStays.map((stay, idx) => (
                <div
                  key={stay.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx, 5) * 80}ms`, animationFillMode: 'both' }}
                >
                  <StayCard
                    stay={stay}
                    onClick={setSelectedStay}
                    isFavorite={favorites.has(stay.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm animate-scale-in lg:p-16">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">🔍</div>
              <h3 className="mb-2 text-xl font-semibold text-neutral-900">No stays found for “{destination}”</h3>
              <p className="mb-6 text-neutral-500">Try a different destination like Lagos, Abuja, or Port Harcourt — or clear your filters.</p>
              <button onClick={clearFilters} className="btn btn-primary px-8 py-3">
                View all stays
              </button>
            </div>
          )}
        </div>
      </div>

      <StayDetailModal stay={selectedStay} isOpen={!!selectedStay} onClose={() => setSelectedStay(null)} />
    </section>
  )
}

export default Rooms

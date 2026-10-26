import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { stays } from '../data/stays'

function StarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function Listing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const stay = stays.find((st) => String(st.id) === String(id))
  const [activePhoto, setActivePhoto] = useState(0)
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('solace_favorites') || '[]'))
    } catch {
      return new Set()
    }
  })
  const isFavorite = stay ? favorites.has(stay.id) : false

  if (!stay) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-neutral-900">Stay not found</h2>
          <p className="text-neutral-500">{"The property you're looking for doesn't exist."}</p>
          <Link to="/" className="btn btn-primary mt-6 inline-block px-6 py-3">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(stay.id)) next.delete(stay.id)
      else next.add(stay.id)
      localStorage.setItem('solace_favorites', JSON.stringify([...next]))
      return next
    })
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: stay.title, url })
      } catch {
        /* dismissed */
      }
      return
    }
    await navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReserve = () => {
    navigate(`/booking?stay=${stay.id}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto w-full max-w-[1440px] px-6 py-6 sm:px-10 lg:px-20">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
          <li>
            <Link to="/" className="hover:text-neutral-900 hover:underline">
              Homes
            </Link>
            <svg className="mx-1 inline h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link to="/rooms" className="hover:text-neutral-900 hover:underline">
              {stay.country}
            </Link>
            <svg className="mx-1 inline h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-neutral-900">{stay.location}</li>
        </ol>
      </nav>

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 sm:px-10 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: gallery + details */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                {parseFloat(stay.rating) >= 4.9 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900">
                    Guest favourite
                  </span>
                )}
                <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 lg:text-3xl">
                  {stay.title}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  {stay.type} in {stay.location}, {stay.country}
                </p>
              </div>

              <div className="flex flex-none items-center gap-3">
                <button
                  onClick={handleShare}
                  className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-900 underline transition-colors hover:bg-neutral-100 sm:flex"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {copied ? 'Link copied' : 'Share'}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                    isFavorite
                      ? 'border-transparent bg-[#FF385C] text-white'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Photo gallery */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src={stay.images[activePhoto] || stay.image}
                alt={stay.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {stay.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`h-2 w-2 rounded-full transition-all duration-200 ${
                      i === activePhoto ? 'w-4 bg-white' : 'bg-white/70'
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>

              {stay.superhost && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur">
                  Superhost
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {stay.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {stay.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                      i === activePhoto ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'
                    }`}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Host + essentials */}
            <div className="mt-8 flex items-center justify-between gap-4 border-b border-neutral-200 pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={stay.host.avatar}
                  alt={stay.host.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-neutral-900">
                    Hosted by {stay.host.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {stay.host.isSuperhost ? 'Superhost · ' : ''}
                    {stay.guests} guests · {stay.bedrooms} bedrooms · {stay.beds} beds · {stay.baths} baths
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 text-sm font-medium text-neutral-900 sm:flex">
                <StarIcon />
                {stay.rating} · {stay.reviewCount} reviews
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-neutral-200 py-6">
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">About this place</h2>
              <p className="text-sm leading-relaxed text-neutral-600">{stay.description}</p>
            </div>

            {/* Amenities */}
            <div className="py-6">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">What this place offers</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {stay.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-neutral-700">
                    <svg className="h-5 w-5 flex-none text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg lg:sticky lg:top-44">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <p className="text-xl font-semibold text-neutral-900">
                  ${stay.price} <span className="text-sm font-normal text-neutral-600">night</span>
                </p>
                <span className="flex items-center gap-1 text-sm text-neutral-900">
                  <StarIcon />
                  {stay.rating}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-300">
                <div className="border-r border-neutral-300 p-3">
                  <label className="block text-xs font-semibold text-neutral-900" htmlFor="listing-checkin">Check-in</label>
                  <input
                    id="listing-checkin"
                    type="date"
                    className="mt-1 w-full bg-transparent text-sm text-neutral-700 outline-none"
                  />
                </div>
                <div className="p-3">
                  <label className="block text-xs font-semibold text-neutral-900" htmlFor="listing-checkout">Checkout</label>
                  <input
                    id="listing-checkout"
                    type="date"
                    className="mt-1 w-full bg-transparent text-sm text-neutral-700 outline-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-neutral-900" htmlFor="listing-guests">Who</label>
                <select
                  id="listing-guests"
                  className="mt-1 w-full cursor-pointer rounded-2xl border border-neutral-300 px-3 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5+ guests</option>
                </select>
              </div>

              <button
                onClick={handleReserve}
                className="btn btn-primary w-full py-3.5 text-base font-semibold"
              >
                Reserve
              </button>
              <p className="mt-3 text-center text-xs text-neutral-500">{"You won't be charged yet"}</p>

              <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
                <div className="flex items-center justify-between gap-4">
                  <span>${stay.price} × 2 nights</span>
                  <span className="font-medium text-neutral-900">${stay.price * 2}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Cleaning fee</span>
                  <span className="font-medium text-neutral-900">${Math.round(stay.price * 0.1)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>${Math.round(stay.price * 2.1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listing

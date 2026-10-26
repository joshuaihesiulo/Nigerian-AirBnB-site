import { useNavigate } from 'react-router-dom'

function StayCard({ stay, onClick, className = '', isFavorite = false, onToggleFavorite }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    if (onClick) onClick(stay)
    else navigate(`/listing/${stay.id}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onClick) onClick(stay)
      else navigate(`/listing/${stay.id}`)
    }
  }

  const handleFavorite = (e) => {
    e.stopPropagation()
    onToggleFavorite?.(stay)
  }

  return (
    <article
      className={`group cursor-pointer ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${stay.title}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={stay.image}
          alt={stay.title}
          className="aspect-square w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {stay.guestFavorite && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm">
            Guest favorite
          </span>
        )}

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? `Remove ${stay.title} from favorites` : `Save ${stay.title} to favorites`}
          aria-pressed={isFavorite}
          className="group/favorite absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover/favorite:scale-110"
            fill={isFavorite ? '#FF385C' : 'rgba(0,0,0,0.5)'}
            stroke="#ffffff"
            strokeWidth="2"
          >
            <path d="M16 28c-7-4.7-11-9-11-13a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 4-4 8.3-11 13z" />
          </svg>
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold text-neutral-900">
            {stay.title}
          </h3>
          <span className="flex flex-none items-center gap-1 text-sm text-neutral-900">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {stay.rating}
          </span>
        </div>
        <p className="truncate text-sm font-normal text-neutral-500">
          {stay.location}, {stay.country}
        </p>
        <p className="text-sm font-normal text-neutral-500">
          {stay.reviewCount} reviews
        </p>
        <p className="mt-1 text-base font-semibold text-neutral-900">
          ${stay.price}{' '}
          <span className="text-sm font-normal text-neutral-600">night</span>
        </p>
      </div>
    </article>
  )
}

export default StayCard

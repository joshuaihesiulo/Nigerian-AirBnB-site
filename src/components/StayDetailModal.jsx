import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatNaira } from '../data/stays'

function StayDetailModal({ stay, isOpen, onClose }) {
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Focus trap and escape key handling
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement
      document.body.style.overflow = 'hidden'
      modalRef.current?.focus()
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'Tab') trapFocus(e)
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        previousActiveElement.current?.focus()
      }
    }
  }, [isOpen, onClose])

  const trapFocus = (e) => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements?.length) return
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  if (!isOpen || !stay) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[var(--shadow-modal)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-110 text-neutral-500 hover:text-neutral-900"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative">
            <img 
              src={stay.image} 
              alt={stay.title}
              className="w-full h-full min-h-[400px] lg:min-h-[500px] object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="flex gap-2">
                <span className="badge badge-primary px-3 py-1.5 text-sm">
                  {stay.location}
                </span>
                <span className="badge badge-gold px-3 py-1.5 text-sm">
                  ★ {stay.rating}
                </span>
              </div>
              <button 
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-card hover:shadow-card-hover transition-all"
                aria-label="Share"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 lg:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">{stay.location}</p>
                <h2 id="modal-title" className="text-2xl lg:text-3xl font-semibold text-neutral-900">{stay.title}</h2>
              </div>
              <div className="flex items-center gap-1 text-neutral-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{stay.rating}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Experience the perfect blend of comfort and luxury at {stay.title}. 
              Located in the heart of {stay.location}, this stunning property offers 
              world-class amenities, breathtaking views, and exceptional service. 
              Whether you&apos;re traveling for business or leisure, you&apos;ll find everything 
              you need for an unforgettable stay.
            </p>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: '🏊', label: 'Pool' },
                  { icon: '🏋️', label: 'Gym' },
                  { icon: '🍽️', label: 'Restaurant' },
                  { icon: '🚗', label: 'Parking' },
                  { icon: '🛜', label: 'WiFi' },
                  { icon: '🌅', label: 'View' },
                ].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    <span className="text-lg">{amenity.icon}</span>
                    <span className="font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="mb-6 rounded-3xl bg-neutral-50 p-5">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-700">
                  <span>{stay.priceLabel} × 1 night</span>
                  <span className="font-medium">{formatNaira(stay.nairaPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Cleaning fee</span>
                  <span className="font-medium">{formatNaira(Math.round(stay.nairaPrice * 0.1))}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Service fee</span>
                  <span className="font-medium">{formatNaira(Math.round(stay.nairaPrice * 0.08))}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg font-bold text-neutral-900">
                  <span>Total</span>
                  <span>{formatNaira(Math.round(stay.nairaPrice * 1.18))}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose()
                  navigate(`/booking?stay=${stay.id}`)
                }}
                className="btn btn-primary flex-1 py-4 text-lg"
              >
                Reserve Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="btn btn-secondary flex-1 py-4 text-lg"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StayDetailModal
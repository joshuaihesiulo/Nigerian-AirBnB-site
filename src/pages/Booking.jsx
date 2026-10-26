import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { formatNaira, stays } from '../data/stays'

const ROOM_TYPES = [
  { id: 'standard', name: 'Standard Room', price: 50, nairaPrice: 75000, desc: 'Cozy comfort for solo or couple stays', icon: '🛏️' },
  { id: 'deluxe', name: 'Deluxe Suite', price: 120, nairaPrice: 180000, desc: 'Extra space, premium finishes', icon: '✨' },
  { id: 'executive', name: 'Executive Suite', price: 220, nairaPrice: 330000, desc: 'Work lounge + city views', icon: '💼' },
  { id: 'presidential', name: 'Presidential Suite', price: 500, nairaPrice: 750000, desc: 'Top-floor luxury, full service', icon: '👑' },
]

function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedStayId = searchParams.get('stay')
  const preselectedStay = stays.find((s) => String(s.id) === String(preselectedStayId))

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roomType: 'standard',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: 1,
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const minCheckIn = new Date().toISOString().split('T')[0]
  const minCheckOut = form.checkIn || minCheckIn
  const selectedRoom = ROOM_TYPES.find((r) => r.id === form.roomType)

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 1
    const d1 = new Date(form.checkIn)
    const d2 = new Date(form.checkOut)
    if (isNaN(d1) || isNaN(d2)) return 1
    return Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)))
  }, [form.checkIn, form.checkOut])

  const totalUSD = selectedRoom.price * nights
  const totalNaira = selectedRoom.nairaPrice * nights

  useEffect(() => {
    if (form.checkOut && form.checkIn && form.checkOut < form.checkIn) {
      setForm((f) => ({ ...f, checkOut: '' }))
    }
  }, [form.checkIn, form.checkOut])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const validateStep1 = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    else if (form.fullName.trim().length < 3) errs.fullName = 'Please enter your full name'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    else if (form.phone.replace(/\D/g, '').length < 7) errs.phone = 'Enter a valid phone number'
    setErrors(errs)
    setTouched({ fullName: true, email: true, phone: true })
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs = {}
    if (!form.checkIn) errs.checkIn = 'Check-in date is required'
    if (!form.checkOut) errs.checkOut = 'Check-out date is required'
    if (form.checkOut && form.checkIn && form.checkOut <= form.checkIn) {
      errs.checkOut = 'Check-out must be after check-in'
    }
    if (!form.guests || Number(form.guests) < 1) errs.guests = 'At least 1 guest required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 2 && validateStep2()) {
      localStorage.setItem(
        'solace_booking',
        JSON.stringify({
          ...form,
          guests: Number(form.guests),
          nights,
          totalUSD,
          totalNaira,
          roomName: preselectedStay ? `${preselectedStay.title} — ${selectedRoom.name}` : selectedRoom.name,
          stayId: preselectedStay?.id || null,
          stayImage: preselectedStay?.image || null,
          bookingId: 'SLC-' + Date.now().toString(36).toUpperCase(),
        })
      )
      navigate('/payment')
    }
  }

  const back = () => {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputClass = (name) =>
    `input ${errors[name] && touched[name] ? '!border-red-400 focus:!border-red-400 focus:!ring-red-100' : ''}`

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Main form card */}
          <div className="card p-6 sm:p-8 lg:p-10 animate-slide-up">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label="Booking progress">
              {[
                { n: 1, label: 'Details' },
                { n: 2, label: 'Dates' },
                { n: 3, label: 'Payment' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step > s.n
                          ? 'bg-green-500 text-white'
                          : step === s.n
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 scale-105'
                            : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {step > s.n ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.n
                      )}
                    </span>
                    <span className={`text-sm font-semibold hidden sm:block ${step >= s.n ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step > s.n ? 'bg-green-500' : 'bg-neutral-100'}`} />}
                </div>
              ))}
            </div>

            <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-950 tracking-tight mb-2">Book Your Stay</h1>
            <p className="text-neutral-600 mb-8">
              {preselectedStay ? (
                <>You selected <strong className="text-neutral-900">{preselectedStay.title}</strong> — {preselectedStay.location}</>
              ) : (
                'Experience comfort with Solace Hotels'
              )}
            </p>

            {preselectedStay && (
              <div className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 mb-8 animate-fade-in">
                <img src={preselectedStay.image} alt={preselectedStay.title} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-neutral-900 truncate">{preselectedStay.title}</p>
                  <p className="text-sm text-neutral-500">{preselectedStay.location} • ★ {preselectedStay.rating}</p>
                  <Link to="/rooms" className="text-sm font-semibold text-primary-600 hover:text-primary-700">Change stay →</Link>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-fade-in" key="step1">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-700 mb-2">Guest Name *</label>
                  <input id="fullName" name="fullName" type="text" placeholder="Adaeze Okafor" value={form.fullName} onChange={handleChange} onBlur={handleBlur} className={inputClass('fullName')} autoComplete="name" />
                  {errors.fullName && touched.fullName && <p className="text-sm text-red-500 mt-1.5">{errors.fullName}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">Email *</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onBlur={handleBlur} className={inputClass('email')} autoComplete="email" />
                    {errors.email && touched.email && <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">Phone *</label>
                    <input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={handleChange} onBlur={handleBlur} className={inputClass('phone')} autoComplete="tel" />
                    {errors.phone && touched.phone && <p className="text-sm text-red-500 mt-1.5">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-neutral-700 mb-3">Room Type *</span>
                  <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Room type">
                    {ROOM_TYPES.map((r) => (
                      <label
                        key={r.id}
                        className={`relative flex gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          form.roomType === r.id
                            ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <input type="radio" name="roomType" value={r.id} checked={form.roomType === r.id} onChange={handleChange} className="sr-only" />
                        <span className="text-2xl">{r.icon}</span>
                        <span className="min-w-0">
                          <span className="block font-bold text-neutral-900 text-[15px]">{r.name}</span>
                          <span className="block text-xs text-neutral-500 mb-1">{r.desc}</span>
                          <span className="block text-sm font-bold text-primary-600">${r.price}/night</span>
                        </span>
                        {form.roomType === r.id && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center animate-scale-in">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={next} className="btn btn-primary w-full py-4 text-base mt-2">
                  Continue to dates
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in" key="step2">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-semibold text-neutral-700 mb-2">Check-in *</label>
                    <input id="checkIn" name="checkIn" type="date" min={minCheckIn} value={form.checkIn} onChange={handleChange} className={inputClass('checkIn')} />
                    {errors.checkIn && <p className="text-sm text-red-500 mt-1.5">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-semibold text-neutral-700 mb-2">Check-out *</label>
                    <input id="checkOut" name="checkOut" type="date" min={minCheckOut} value={form.checkOut} onChange={handleChange} className={inputClass('checkOut')} />
                    {errors.checkOut && <p className="text-sm text-red-500 mt-1.5">{errors.checkOut}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-semibold text-neutral-700 mb-2">Guests *</label>
                  <select id="guests" name="guests" value={form.guests} onChange={handleChange} className="input bg-white">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}{n === 5 ? '+' : ''}</option>
                    ))}
                  </select>
                  {errors.guests && <p className="text-sm text-red-500 mt-1.5">{errors.guests}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={back} className="btn btn-secondary flex-1 py-4">Back</button>
                  <button type="button" onClick={next} className="btn btn-primary flex-[2] py-4">Proceed to Payment</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <aside className="card p-6 lg:sticky lg:top-24 animate-slide-up stagger-2">
            {preselectedStay ? (
              <img src={preselectedStay.image} alt="" className="w-full h-44 object-cover rounded-2xl mb-5" />
            ) : (
              <div className="w-full h-44 rounded-2xl bg-neutral-100 flex items-center justify-center text-5xl mb-5">🏨</div>
            )}
            <h3 className="font-semibold text-neutral-900 mb-4">Booking Summary</h3>
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-600">{selectedRoom.name}</span>
                <span className="font-semibold text-neutral-900 whitespace-nowrap">${selectedRoom.price}/night</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-neutral-600">{nights} night{nights > 1 ? 's' : ''}{form.guests ? ` • ${form.guests} guest${Number(form.guests) > 1 ? 's' : ''}` : ''}</span>
                <span className="font-semibold text-neutral-900">${totalUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-500">Taxes & fees (incl.)</span>
                <span className="text-neutral-500">—</span>
              </div>
              <div className="border-t border-neutral-100 pt-4 flex justify-between items-baseline gap-2">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="text-right">
                  <span className="block font-semibold text-neutral-900 text-lg">${totalUSD.toLocaleString()}</span>
                  <span className="block text-sm font-bold text-neutral-900">{formatNaira(totalNaira)}</span>
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-2 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm text-green-800">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Free cancellation for 48 hours after booking
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Booking

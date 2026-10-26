import { Link } from 'react-router-dom'
import { formatNaira } from '../data/stays'

function Confirmation() {
  let booking = {}
  try {
    booking = JSON.parse(localStorage.getItem('solace_confirmation') || '{}')
  } catch {
    booking = {}
  }

  if (!booking.bookingId) {
    return (
      <section className="py-16">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-md">
            <div className="card p-10 text-center animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">No booking found</h1>
              <p className="text-neutral-600 mb-6">Please complete a booking first to see your confirmation.</p>
              <Link to="/booking" className="btn btn-primary w-full py-3.5">Start Booking</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { bookingId, fullName, roomName, checkIn, checkOut, guests, totalNaira, totalUSD, paymentMethod, paidAt, stayImage } = booking

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return d
    }
  }

  const methodLabels = { card: 'Debit / Credit Card', paystack: 'Paystack', flutterwave: 'Flutterwave', transfer: 'Bank Transfer' }

  const rows = [
    ['Booking ID', bookingId, true],
    ['Guest', fullName, false],
    ['Room', roomName, false],
    ['Check-in', checkIn ? formatDate(checkIn) : '—', false],
    ['Check-out', checkOut ? formatDate(checkOut) : '—', false],
    ['Guests', `${guests} guest${Number(guests) > 1 ? 's' : ''}`, false],
    ['Payment', methodLabels[paymentMethod] || paymentMethod, false],
    ['Paid On', paidAt ? formatDate(paidAt) : '—', false],
  ]

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <div className="card overflow-hidden animate-scale-in">
            <div className="border-b border-neutral-100 px-6 py-10 text-center sm:px-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/60">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">You&apos;re all set!</h1>
              <p className="mt-2 text-sm text-neutral-600">
                Thank you, <span className="font-medium text-neutral-900">{fullName?.split(' ')[0]}</span>. Your reservation is confirmed.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {stayImage && <img src={stayImage} alt="" className="mb-6 h-48 w-full rounded-2xl object-cover" />}

              <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 divide-y divide-neutral-200">
                {rows.map(([label, value, mono], i) => (
                  <div key={label} className="flex justify-between items-center gap-4 px-5 py-3.5 animate-fade-in" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                    <span className="text-sm text-neutral-500">{label}</span>
                    <strong className={`text-neutral-900 text-right text-[15px] ${mono ? 'font-mono text-sm' : ''}`}>{value}</strong>
                  </div>
                ))}
                <div className="flex justify-between items-center gap-4 bg-white px-5 py-4">
                  <span className="font-semibold text-neutral-900">Total paid</span>
                  <span className="text-right">
                    <span className="block text-lg font-semibold text-neutral-900">{formatNaira(totalNaira || 0)}</span>
                    {totalUSD ? <span className="block text-xs text-neutral-500">${Number(totalUSD).toLocaleString()}</span> : null}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => window.print()} className="btn btn-secondary py-3.5 text-sm">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Print receipt
                </button>
                <Link to="/dashboard" className="btn btn-primary py-3.5 text-sm">View dashboard</Link>
                <Link to="/" className="py-2 text-center text-sm font-medium text-neutral-600 underline underline-offset-4 transition-colors hover:text-neutral-900 sm:col-span-2">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Confirmation

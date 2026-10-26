import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { formatNaira } from '../data/stays'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, Verve', icon: '💳' },
  { id: 'paystack', label: 'Paystack', desc: 'Pay with bank, USSD, transfer', icon: '🟢' },
  { id: 'flutterwave', label: 'Flutterwave', desc: 'Cards, bank & mobile money', icon: '🟠' },
  { id: 'transfer', label: 'Bank Transfer', desc: 'Direct transfer, 24h confirm', icon: '🏦' },
]

function Payment() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('card')
  const [cardForm, setCardForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  const booking = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('solace_booking') || '{}')
    } catch {
      return {}
    }
  }, [])

  const { totalNaira = 0, totalUSD = 0, bookingId, roomName, checkIn, checkOut, guests, stayImage } = booking

  const validateCard = () => {
    const errs = {}
    if (!cardForm.cardName.trim()) errs.cardName = 'Cardholder name required'
    if (!cardForm.cardNumber.trim()) errs.cardNumber = 'Card number required'
    else if (!/^\d{13,19}$/.test(cardForm.cardNumber.replace(/\s/g, ''))) errs.cardNumber = 'Enter a valid 13–19 digit card number'
    if (!cardForm.expiry.trim()) errs.expiry = 'Expiry required'
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry)) errs.expiry = 'Use MM/YY'
    else {
      const [mm, yy] = cardForm.expiry.split('/').map(Number)
      const now = new Date()
      const exp = new Date(2000 + yy, mm)
      if (exp <= now) errs.expiry = 'Card expired'
    }
    if (!cardForm.cvv.trim()) errs.cvv = 'CVV required'
    else if (!/^\d{3,4}$/.test(cardForm.cvv)) errs.cvv = 'Invalid CVV'
    setCardErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    let formatted = value
    if (name === 'cardNumber') formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
    if (name === 'expiry') {
      const d = value.replace(/\D/g, '').slice(0, 4)
      formatted = d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d.length === 2 && !value.includes('/') ? `${d}/` : d
    }
    if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4)
    setCardForm((f) => ({ ...f, [name]: formatted }))
    if (cardErrors[name]) setCardErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePay = async (e) => {
    e.preventDefault()
    if (!bookingId) {
      navigate('/booking')
      return
    }
    if (method === 'card' && !validateCard()) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1600))
    const confirmation = { ...booking, paymentMethod: method, paidAt: new Date().toISOString(), status: 'confirmed' }
    localStorage.setItem('solace_confirmation', JSON.stringify(confirmation))
    localStorage.removeItem('solace_booking')
    setProcessing(false)
    navigate('/confirmation')
  }

  if (!bookingId) {
    return (
      <section className="py-16">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-md">
            <div className="card p-10 text-center animate-scale-in">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-neutral-100 flex items-center justify-center text-3xl">🧾</div>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">No active booking</h1>
              <p className="text-neutral-600 mb-6">Start a booking first, then return here to pay securely.</p>
              <Link to="/booking" className="btn btn-primary w-full py-3.5">Start Booking</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-20">
        <div className="mb-8 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600 mb-2">Step 3 of 3</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 lg:text-4xl">Secure payment</h1>
          <p className="mt-2 text-neutral-600">256-bit encrypted • PCI-DSS compliant • Money-back guarantee</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="card p-6 sm:p-8 animate-slide-up">
            <h2 className="text-lg font-semibold text-neutral-900 mb-5">Choose payment method</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    method === m.id ? 'border-primary-500 bg-primary-50/50 shadow-sm' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <input type="radio" name="payment" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                  <span className="text-2xl leading-none mt-0.5">{m.icon}</span>
                  <span>
                    <span className="block font-bold text-neutral-900 text-[15px]">{m.label}</span>
                    <span className="block text-xs text-neutral-500 mt-0.5">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {method === 'card' && (
              <div className="space-y-5 animate-fade-in border-t border-neutral-100 pt-6">
                <h3 className="font-semibold text-neutral-900">Card Details</h3>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-semibold text-neutral-700 mb-2">Card holder name</label>
                  <input id="cardName" name="cardName" type="text" placeholder="Adaeze Okafor" value={cardForm.cardName} onChange={handleCardChange} className="input" autoComplete="cc-name" />
                  {cardErrors.cardName && <p className="text-sm text-red-500 mt-1.5">{cardErrors.cardName}</p>}
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-semibold text-neutral-700 mb-2">Card number</label>
                  <input id="cardNumber" name="cardNumber" type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardForm.cardNumber} onChange={handleCardChange} className="input font-mono tracking-wide" autoComplete="cc-number" />
                  {cardErrors.cardNumber && <p className="text-sm text-red-500 mt-1.5">{cardErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-semibold text-neutral-700 mb-2">Expiry (MM/YY)</label>
                    <input id="expiry" name="expiry" type="text" inputMode="numeric" placeholder="08/28" value={cardForm.expiry} onChange={handleCardChange} className="input font-mono" autoComplete="cc-exp" />
                    {cardErrors.expiry && <p className="text-sm text-red-500 mt-1.5">{cardErrors.expiry}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-semibold text-neutral-700 mb-2">CVV</label>
                    <input id="cvv" name="cvv" type="password" inputMode="numeric" placeholder="123" value={cardForm.cvv} onChange={handleCardChange} className="input font-mono" autoComplete="cc-csc" />
                    {cardErrors.cvv && <p className="text-sm text-red-500 mt-1.5">{cardErrors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {method === 'paystack' && (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center animate-fade-in">
                <p className="font-semibold text-green-900">Paystack Checkout</p>
                <p className="text-sm text-green-800 mt-1">You will be redirected to Paystack to complete payment securely with card, bank, USSD or transfer.</p>
              </div>
            )}
            {method === 'flutterwave' && (
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 text-center animate-fade-in">
                <p className="font-semibold text-orange-900">Flutterwave Checkout</p>
                <p className="text-sm text-orange-800 mt-1">You will be redirected to Flutterwave to pay with card, bank account or mobile money.</p>
              </div>
            )}
            {method === 'transfer' && (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 animate-fade-in">
                <h3 className="font-semibold text-neutral-900 mb-4">Bank Transfer Details</h3>
                <dl className="space-y-3 text-[15px]">
                  {[['Bank', 'Solace Bank PLC'], ['Account Name', 'Solace Hotels Limited'], ['Account Number', '0123456789'], ['Reference', bookingId]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-neutral-600">{k}:</dt>
                      <dd className="font-bold text-neutral-900 font-mono text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-neutral-200 pt-4 text-sm text-neutral-600">Include the reference above. Confirmation may take up to 24 hours.</p>
              </div>
            )}

            <button onClick={handlePay} disabled={processing} className="btn btn-primary mt-8 w-full py-4 text-base disabled:opacity-70">
              {processing ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/30 border-t-white" aria-hidden="true" />
                  Processing securely…
                </>
              ) : (
                <>Pay {formatNaira(totalNaira)} • ${totalUSD.toLocaleString()}</>
              )}
            </button>
            <p className="text-center text-xs text-neutral-500 mt-3 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Your payment info is never stored on our servers
            </p>
          </div>

          <aside className="card p-6 lg:sticky lg:top-24 animate-slide-up stagger-2">
            {stayImage && <img src={stayImage} alt="" className="w-full h-40 object-cover rounded-2xl mb-5" />}
            <h3 className="font-semibold text-neutral-900 mb-1">{roomName || 'Selected Room'}</h3>
            {checkIn && checkOut && <p className="text-sm text-neutral-500 mb-4">{checkIn} → {checkOut} • {guests} guest(s)</p>}
            <div className="text-sm text-neutral-500 mb-1">Booking ID</div>
            <div className="font-mono text-sm font-bold text-neutral-900 mb-5">{bookingId}</div>
            <div className="border-t border-neutral-100 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-neutral-900">Total due</span>
              <span className="text-right">
                <span className="block font-semibold text-lg">{formatNaira(totalNaira)}</span>
                <span className="block text-sm text-neutral-500">${totalUSD.toLocaleString()}</span>
              </span>
            </div>
            <Link to="/booking" className="btn btn-secondary w-full py-3 text-sm mt-5">← Back to booking</Link>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Payment

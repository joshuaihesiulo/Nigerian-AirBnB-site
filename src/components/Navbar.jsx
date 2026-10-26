import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { key: 'all', label: 'All', to: '/' },
  { key: 'homes', label: 'Homes', to: '/rooms' },
  { key: 'experiences', label: 'Experiences', to: '/rooms?category=experiences' },
  { key: 'services', label: 'Services', to: '/rooms?category=services' },
]

const DESTINATIONS = [
  { label: 'Lagos', to: '/rooms?destination=Lagos' },
  { label: 'Lekki', to: '/rooms?destination=Lekki' },
  { label: 'Abuja', to: '/rooms?destination=Abuja' },
  { label: 'Nairobi', to: '/rooms?destination=Nairobi' },
  { label: 'Harare', to: '/rooms?destination=Harare' },
]

function AirbnbLogo() {
  return (
    <>
      <svg className="h-8 w-8 flex-none text-[#FF385C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
      </svg>
      <span className="hidden text-[22px] font-bold leading-none tracking-tight text-[#FF385C] sm:block">airbnb</span>
    </>
  )
}

function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  const params = new URLSearchParams(location.search)
  const currentCategory = params.get('category')
  const currentDestination = params.get('destination')
  const onSearchPages = location.pathname.startsWith('/rooms') || location.pathname.startsWith('/listing')

  let activeKey = null
  if (location.pathname === '/') activeKey = 'all'
  else if (onSearchPages && !currentDestination) {
    activeKey = currentCategory === 'experiences' ? 'experiences' : currentCategory === 'services' ? 'services' : 'homes'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/rooms?destination=${encodeURIComponent(query.trim())}`)
    else navigate('/rooms')
    setOpen(false)
  }

  const searchPill = (
    <button
      type="button"
      onClick={() => navigate('/rooms')}
      className="flex items-center divide-x divide-neutral-200 rounded-full border border-neutral-200 bg-white py-2 pl-5 pr-2 shadow-sm transition-all duration-200 hover:shadow-md"
      aria-label="Search stays"
    >
      <span className="pr-5 text-sm font-medium text-neutral-900">Anywhere</span>
      <span className="px-5 text-sm font-medium text-neutral-900">Any week</span>
      <span className="pl-5 pr-3 text-sm font-normal text-neutral-500">Add guests</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF385C] text-white">
        <SearchIcon />
      </span>
    </button>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <nav className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-none items-center gap-1.5" aria-label="Airbnb home">
            <AirbnbLogo />
          </Link>

          {/* Center search pill */}
          <div className="hidden flex-1 justify-center px-4 lg:flex">{searchPill}</div>

          {/* Mobile compact search */}
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 shadow-sm transition-shadow hover:shadow-md lg:hidden"
            aria-label="Search stays"
          >
            <SearchIcon className="h-4 w-4 flex-none text-neutral-900" />
            <span className="truncate text-sm font-semibold text-neutral-900">Where to?</span>
          </button>

          {/* Right actions */}
          <div className="flex flex-none items-center gap-1 sm:gap-2">
            <Link
              to="/dashboard"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 md:block"
            >
              Become a host
            </Link>

            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 lg:flex"
              aria-label="Choose language and currency"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-9c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.6-4 9s1.5 6.6 4 9M3.6 9h16.8M3.6 15h16.8" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white pl-3 pr-1 transition-shadow hover:shadow-md"
            >
              <svg className="h-4 w-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-600 text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Category / destination filter bar */}
        <div className="border-t border-neutral-200">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeKey === cat.key
              return (
                <Link
                  key={cat.key}
                  to={cat.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`-mb-px flex-none whitespace-nowrap border-b-2 pb-3 pt-4 text-sm ${
                    isActive
                      ? 'border-neutral-900 font-medium text-neutral-900'
                      : 'border-transparent text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-800 hover:border-b-2'
                  }`}
                >
                  {cat.label}
                </Link>
              )
            })}

            <span className="h-5 w-px flex-none bg-neutral-200" aria-hidden="true" />

            {DESTINATIONS.map((dest) => {
              const isActive = currentDestination === dest.label
              return (
                <Link
                  key={dest.label}
                  to={dest.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`-mb-px flex-none whitespace-nowrap border-b-2 pb-3 pt-4 text-sm ${
                    isActive
                      ? 'border-neutral-900 font-medium text-neutral-900'
                      : 'border-transparent text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-800 hover:border-b-2'
                  }`}
                >
                  {dest.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Menu panel */}
      {open && (
        <div className="absolute right-6 top-full z-50 mt-2 w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl sm:right-10 lg:right-20">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center rounded-full border border-neutral-200 bg-white py-1.5 pl-5 pr-1.5 shadow-sm transition-shadow focus-within:shadow-md">
              <input
                type="search"
                placeholder="Search destinations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search destinations"
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#FF385C] text-white transition-colors hover:bg-[#E00b41]"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          <ul className="divide-y divide-neutral-100">
            <li>
              <Link to="/dashboard" className="block py-3 text-sm font-medium text-neutral-900">
                Become a host
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="block py-3 text-sm font-medium text-neutral-900">
                Explore all stays
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block py-3 text-sm font-medium text-neutral-900">
                Guest dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block py-3 text-sm font-medium text-neutral-900">
                Help Centre
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar

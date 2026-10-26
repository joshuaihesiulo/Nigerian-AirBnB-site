import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center sm:px-10 lg:px-20">
        <div className="animate-scale-in">
          <p className="mb-4 text-7xl font-bold leading-none text-[#FF385C] lg:text-8xl">404</p>
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Lost your way?</h1>
          <p className="mb-8 text-neutral-600">The page you are looking for does not exist or was moved. Let us get you back to comfort.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn btn-primary px-8 py-3.5">Back to home</Link>
            <Link to="/rooms" className="btn btn-secondary px-8 py-3.5">Browse stays</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound

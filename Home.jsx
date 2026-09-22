import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const featuredStays = [
    {
      id: 1,
      title: 'Oceanview Loft',
      location: 'Lisbon, Portugal',
      price: '$180/night',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 2,
      title: 'Mountain Retreat',
      location: 'Swiss Alps',
      price: '$240/night',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 3,
      title: 'City Garden Villa',
      location: 'Nairobi, Kenya',
      price: '$160/night',
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    },
  ]

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Stay somewhere unforgettable</p>
          <h1>Find your perfect escape</h1>
          <p className="hero-text">
            Discover stylish stays, peaceful retreats, and unforgettable experiences around the world.
          </p>
          <div className="hero-actions">
            <Link to="/rooms" className="primary-btn">Explore stays</Link>
            <Link to="/booking" className="secondary-btn">Book now</Link>
          </div>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
            alt="Luxury vacation home"
          />
        </div>
      </section>

      <section className="discover-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured homes</p>
            <h2>Popular stays this week</h2>
          </div>
          <Link to="/rooms">View all</Link>
        </div>

        <div className="stay-grid">
          {featuredStays.map((stay) => (
            <article key={stay.id} className="stay-card">
              <img src={stay.image} alt={stay.title} />
              <div className="stay-info">
                <div className="stay-top">
                  <h3>{stay.title}</h3>
                  <span>★ {stay.rating}</span>
                </div>
                <p>{stay.location}</p>
                <p className="stay-price">{stay.price}</p>
                <Link to="/booking" className="card-link">Reserve</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-card">
          <h3>Flexible booking</h3>
          <p>Easy plans, fast confirmations, and stays that fit your schedule.</p>
        </div>
        <div className="experience-card">
          <h3>Local experiences</h3>
          <p>Enjoy curated recommendations from hosts who know the best spots.</p>
        </div>
        <div className="experience-card">
          <h3>Trusted stays</h3>
          <p>Comfort, cleanliness, and hospitality that make every visit special.</p>
        </div>
      </section>
    </div>
  )
}

export default Home

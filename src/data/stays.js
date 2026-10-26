const u = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const GALLERY_POOL = [
  '1600585154340-be6161a56a0c',
  '1600607687939-ce8a6c25118c',
  '1600566753086-00f18fb6b3ea',
  '1600210492486-724fe5c67fb0',
  '1600585154526-990dced4db0d',
  '1600047509807-ba8f99d2cdde',
  '1613490493576-7fde63acd811',
  '1566073771259-6a8506099945',
  '1522708323590-d24dbb6b0267',
  '1554995207-c18c203602cb',
]

const HOSTS = [
  { name: 'Julie', isSuperhost: true, avatar: 'https://i.pravatar.cc/150?u=julie' },
  { name: 'Samuel', isSuperhost: true, avatar: 'https://i.pravatar.cc/150?u=samuel' },
  { name: 'Amina', isSuperhost: false, avatar: 'https://i.pravatar.cc/150?u=amina' },
  { name: 'David', isSuperhost: true, avatar: 'https://i.pravatar.cc/150?u=david' },
  { name: 'Grace', isSuperhost: false, avatar: 'https://i.pravatar.cc/150?u=grace' },
  { name: 'Kofi', isSuperhost: false, avatar: 'https://i.pravatar.cc/150?u=kofi' },
  { name: 'Nadia', isSuperhost: true, avatar: 'https://i.pravatar.cc/150?u=nadia' },
  { name: 'Tunde', isSuperhost: true, avatar: 'https://i.pravatar.cc/150?u=tunde' },
]

const DEFAULT_AMENITIES = [
  'Wifi',
  'Kitchen',
  'Free parking',
  'Air conditioning',
  'Washer',
  'Pool',
]

function createStay(cfg) {
  const {
    id,
    kind,
    area,
    country,
    type,
    price,
    rating,
    reviews,
    img,
    guests = 4,
    bedrooms = 1,
    beds = 1,
    baths = 1,
    superhost = false,
    guestFavorite = true,
    amenities,
    description,
    lat = -1.2921,
    lng = 36.8219,
  } = cfg

  const start = id % GALLERY_POOL.length
  const images = [
    u(img, 1200),
    ...Array.from({ length: 3 }, (_, i) => u(GALLERY_POOL[(start + i) % GALLERY_POOL.length], 1200)),
  ]

  return {
    id,
    title: `${kind} in ${area}`,
    kind,
    area,
    location: area,
    country,
    type,
    price,
    priceLabel: `$${price} for 2 nights`,
    nairaPrice: price * 1550,
    rating,
    reviewCount: reviews,
    guestFavorite,
    superhost,
    guests,
    bedrooms,
    beds,
    baths,
    image: u(img),
    images,
    description:
      description ||
      `A calm, stylish escape in the heart of ${area}. This thoughtfully designed ${type.toLowerCase()} blends warm earthy tones, soft lighting, and natural textures to create a cozy, modern retreat.`,
    amenities: amenities || DEFAULT_AMENITIES,
    host: HOSTS[id % HOSTS.length],
    lat,
    lng,
  }
}

export const stays = [
  // ── Nairobi ──────────────────────────────────────────────
  createStay({ id: 1, kind: 'Apartment', area: 'Nairobi', country: 'Kenya', type: 'Entire apartment', price: 112, rating: '4.95', reviews: 128, img: '1502672260266-1c1ef2d93688', guests: 4, superhost: true }),
  createStay({ id: 2, kind: 'Apartment', area: 'Lawington Estate', country: 'Kenya', type: 'Entire apartment', price: 350, rating: '4.94', reviews: 86, img: '1566073771259-6a8506099945', guests: 5, bedrooms: 2, beds: 2, baths: 2, superhost: true }),
  createStay({ id: 3, kind: 'Apartment', area: 'Ngara', country: 'Kenya', type: 'Entire apartment', price: 83, rating: '4.92', reviews: 54, img: '1522708323590-d24dbb6b0267', guests: 3 }),
  createStay({ id: 4, kind: 'Apartment', area: 'Nairobi', country: 'Kenya', type: 'Entire apartment', price: 112, rating: '4.92', reviews: 73, img: '1512918728675-ed5a9ecdebfd', guests: 4 }),
  createStay({ id: 5, kind: 'Guesthouse', area: 'Nairobi', country: 'Kenya', type: 'Entire guesthouse', price: 199, rating: '4.96', reviews: 41, img: '1499793983690-e29da59ef1c2', guests: 6, bedrooms: 3, beds: 4, baths: 2, superhost: true }),
  createStay({ id: 6, kind: 'Apartment', area: 'Nairobi', country: 'Kenya', type: 'Entire apartment', price: 43, rating: '4.86', reviews: 210, img: '1505693416388-ac5ce068fe85', guests: 2 }),

  // ── Cotonou ──────────────────────────────────────────────
  createStay({ id: 7, kind: 'Apartment', area: 'Cotonou', country: 'Benin', type: 'Entire apartment', price: 84, rating: '4.79', reviews: 52, img: '1616486338812-3dadae4b4ace', guests: 3, lat: 6.3674, lng: 2.4321 }),
  createStay({ id: 8, kind: 'Room', area: 'Cotonou', country: 'Benin', type: 'Private room', price: 70, rating: '4.75', reviews: 29, img: '1556912173-3bb406ef7e77', guests: 2, lat: 6.3674, lng: 2.4321 }),
  createStay({ id: 9, kind: 'Villa', area: 'Abomey-Calavi', country: 'Benin', type: 'Entire villa', price: 341, rating: '4.88', reviews: 31, img: '1613490493576-7fde63acd811', guests: 8, bedrooms: 4, beds: 5, baths: 3, lat: 6.4531, lng: 2.3544 }),
  createStay({ id: 10, kind: 'Room', area: 'Cotonou', country: 'Benin', type: 'Private room', price: 62, rating: '4.95', reviews: 14, img: '1554995207-c18c203602cb', guests: 2, lat: 6.3674, lng: 2.4321 }),
  createStay({ id: 11, kind: 'Apartment', area: 'Cotonou', country: 'Benin', type: 'Entire apartment', price: 224, rating: '4.93', reviews: 38, img: '1600585154340-be6161a56a0c', guests: 5, bedrooms: 2, beds: 2, baths: 2, lat: 6.3674, lng: 2.4321 }),
  createStay({ id: 12, kind: 'Apartment', area: 'Cotonou', country: 'Benin', type: 'Entire apartment', price: 78, rating: '4.81', reviews: 19, img: '1600607687939-ce8a6c25118c', guests: 3, lat: 6.3674, lng: 2.4321 }),

  // ── Lekki / Lagos ────────────────────────────────────────
  createStay({ id: 13, kind: 'Apartment', area: 'Lekki', country: 'Nigeria', type: 'Entire apartment', price: 244, rating: '5.0', reviews: 12, img: '1600607687920-4e2a09cf159d', guests: 4, bedrooms: 2, beds: 2, baths: 2, superhost: true, lat: 6.4698, lng: 3.5852 }),
  createStay({ id: 14, kind: 'Apartment', area: 'Lekki', country: 'Nigeria', type: 'Entire apartment', price: 76, rating: '4.9', reviews: 67, img: '1600566753086-00f18fb6b3ea', guests: 3, guestFavorite: false, lat: 6.4698, lng: 3.5852 }),
  createStay({ id: 15, kind: 'Apartment', area: 'Lekki', country: 'Nigeria', type: 'Entire apartment', price: 51, rating: '4.83', reviews: 88, img: '1600210492486-724fe5c67fb0', guests: 2, guestFavorite: false, lat: 6.4698, lng: 3.5852 }),
  createStay({ id: 16, kind: 'Condo', area: 'Lekki', country: 'Nigeria', type: 'Entire condo', price: 91, rating: '4.93', reviews: 45, img: '1600585154526-990dced4db0d', guests: 4, bedrooms: 2, beds: 2, baths: 1, guestFavorite: false, lat: 6.4698, lng: 3.5852 }),
  createStay({ id: 17, kind: 'Apartment', area: 'Lagos', country: 'Nigeria', type: 'Entire apartment', price: 190, rating: '5.0', reviews: 24, img: '1600607687644-c7171b42498f', guests: 5, bedrooms: 2, beds: 3, baths: 2, superhost: true, guestFavorite: false, lat: 6.5244, lng: 3.3792 }),
  createStay({ id: 18, kind: 'Apartment', area: 'Lekki', country: 'Nigeria', type: 'Entire apartment', price: 195, rating: '5.0', reviews: 31, img: '1600573472592-401b489a3cdc', guests: 4, bedrooms: 2, beds: 2, baths: 2, guestFavorite: false, lat: 6.4698, lng: 3.5852 }),

  // ── Harare ───────────────────────────────────────────────
  createStay({ id: 19, kind: 'Home', area: 'Harare', country: 'Zimbabwe', type: 'Entire home', price: 248, rating: '5.0', reviews: 18, img: '1564013799919-ab600027ffc6', guests: 6, bedrooms: 3, beds: 4, baths: 2, superhost: true, lat: -17.8252, lng: 31.0335 }),
  createStay({ id: 20, kind: 'Apartment', area: 'Avenues', country: 'Zimbabwe', type: 'Entire apartment', price: 103, rating: '5.0', reviews: 9, img: '1600607687644-c7171b42498f', guests: 3, lat: -17.8252, lng: 31.0335 }),
  createStay({ id: 21, kind: 'Apartment', area: 'Highlands', country: 'Zimbabwe', type: 'Entire apartment', price: 305, rating: '4.94', reviews: 36, img: '1600566752355-35792bedcfea', guests: 5, bedrooms: 2, beds: 2, baths: 2, lat: -17.8252, lng: 31.0335 }),
  createStay({ id: 22, kind: 'Home', area: 'Harare', country: 'Zimbabwe', type: 'Entire home', price: 495, rating: '4.98', reviews: 22, img: '1613977257363-707ba9348227', guests: 8, bedrooms: 4, beds: 5, baths: 4, guestFavorite: false, lat: -17.8252, lng: 31.0335 }),
  createStay({ id: 23, kind: 'Condo', area: 'Harare', country: 'Zimbabwe', type: 'Entire condo', price: 182, rating: '4.92', reviews: 27, img: '1600585152220-90363fe7e115', guests: 4, bedrooms: 2, beds: 2, baths: 1, lat: -17.8252, lng: 31.0335 }),
  createStay({ id: 24, kind: 'Condo', area: 'Avenues', country: 'Zimbabwe', type: 'Entire condo', price: 176, rating: '4.94', reviews: 33, img: '1600573472592-401b489a3cdc', guests: 4, bedrooms: 2, beds: 2, baths: 2, lat: -17.8252, lng: 31.0335 }),

  // ── Abuja ────────────────────────────────────────────────
  createStay({ id: 25, kind: 'Apartment', area: 'Abuja', country: 'Nigeria', type: 'Entire apartment', price: 70, rating: '4.92', reviews: 51, img: '1505693416388-ac5ce068fe85', guests: 3, lat: 9.0765, lng: 7.3986 }),
  createStay({ id: 26, kind: 'Apartment', area: 'Abuja', country: 'Nigeria', type: 'Entire apartment', price: 306, rating: '4.94', reviews: 29, img: '1600210492486-724fe5c67fb0', guests: 5, bedrooms: 2, beds: 2, baths: 2, superhost: true, lat: 9.0765, lng: 7.3986 }),
  createStay({ id: 27, kind: 'Apartment', area: 'Wuye', country: 'Nigeria', type: 'Entire apartment', price: 90, rating: '4.84', reviews: 64, img: '1600566753190-17f0baa2a6c3', guests: 3, lat: 9.0765, lng: 7.3986 }),
  createStay({ id: 28, kind: 'Apartment', area: 'Abuja', country: 'Nigeria', type: 'Entire apartment', price: 126, rating: '4.96', reviews: 48, img: '1600585154084-4e5fe7c39198', guests: 4, bedrooms: 2, beds: 2, baths: 1, lat: 9.0765, lng: 7.3986 }),
  createStay({ id: 29, kind: 'Apartment', area: 'Abuja', country: 'Nigeria', type: 'Entire apartment', price: 92, rating: '4.91', reviews: 57, img: '1616594039964-ae9021a400a0', guests: 3, lat: 9.0765, lng: 7.3986 }),
  createStay({ id: 30, kind: 'Apartment', area: 'Abuja', country: 'Nigeria', type: 'Entire apartment', price: 72, rating: '4.79', reviews: 83, img: '1617806118233-18e1de247200', guests: 2, lat: 9.0765, lng: 7.3986 }),
]

export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

const group = (ids) => ids.map((id) => stays.find((s) => s.id === id))

export const LOCATIONS = [
  {
    key: 'nairobi',
    title: 'Check out homes in Nairobi',
    city: 'Nairobi',
    subtitle: "Kenya's capital and safari gateway",
    stays: group([1, 2, 3, 4, 5, 6]),
  },
  {
    key: 'cotonou',
    title: 'Popular homes in Cotonou',
    city: 'Cotonou',
    subtitle: "Benin's largest city with a big market",
    stays: group([7, 8, 9, 10, 11, 12]),
  },
  {
    key: 'lekki',
    title: 'Available in Lekki this weekend',
    city: 'Lekki',
    subtitle: 'Coastal district of Lagos with beaches',
    stays: group([13, 14, 15, 16, 17, 18]),
  },
  {
    key: 'harare',
    title: 'Stay in Harare',
    city: 'Harare',
    subtitle: "Zimbabwe's capital city with leafy suburbs",
    stays: group([19, 20, 21, 22, 23, 24]),
  },
  {
    key: 'abuja',
    title: 'Stay in Abuja',
    city: 'Abuja',
    subtitle: "Nigeria's capital with broad avenues",
    stays: group([25, 26, 27, 28, 29, 30]),
  },
]

export const destinations = [
  { id: 1, name: 'Djerba', country: 'Tunisie', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=85', offers: 42 },
  { id: 2, name: 'Istanbul', country: 'Turquie', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85', offers: 28 },
  { id: 3, name: 'Maldives', country: 'Océan Indien', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85', offers: 16 },
  { id: 4, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85', offers: 31 }
]

export const offers = [
  { id: 1, type: 'Hôtel', title: 'Hasdrubal Prestige Thalassa & Spa', location: 'Djerba, Tunisie', stars: 5, rating: 9.2, reviews: 186, price: 289, oldPrice: 340, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85', tag: '-15%', description: 'Un refuge d’exception en bord de mer avec plage privée, spa et gastronomie raffinée.' },
  { id: 2, type: 'Hôtel', title: 'La Badira — Adult Only', location: 'Hammamet, Tunisie', stars: 5, rating: 9.0, reviews: 243, price: 255, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85', tag: 'Coup de cœur', description: 'Élégance contemporaine face à la Méditerranée et service attentionné.' },
  { id: 3, type: 'Circuit', title: 'Istanbul, entre deux continents', location: 'Istanbul, Turquie', stars: 4, rating: 8.8, reviews: 94, price: 1890, oldPrice: 2150, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=85', tag: '7 jours', description: 'Mosquées impériales, Bosphore et saveurs orientales dans un circuit guidé.' },
  { id: 4, type: 'Voyage', title: 'Évasion aux Maldives', location: 'Atoll de Malé, Maldives', stars: 5, rating: 9.6, reviews: 78, price: 4650, image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1000&q=85', tag: '8 jours', description: 'Villa sur pilotis, lagon turquoise et pension complète pour une parenthèse inoubliable.' },
  { id: 5, type: 'Hôtel', title: 'Anantara Sahara Tozeur Resort', location: 'Tozeur, Tunisie', stars: 5, rating: 9.4, reviews: 121, price: 620, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85', tag: 'Luxe', description: 'Le luxe au cœur du désert, entre palmeraie, cinéma et horizons infinis.' },
  { id: 6, type: 'Circuit', title: 'Merveilles du Sud Tunisien', location: 'Tozeur & Douz, Tunisie', stars: 4, rating: 8.9, reviews: 156, price: 890, oldPrice: 990, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85', tag: '4 jours', description: 'Oasis, dunes et villages berbères en petit groupe avec guide local.' }
]

export const bookings = [
  { id: 'HT-24018', title: 'Istanbul, entre deux continents', date: '12–19 Août 2026', people: 2, amount: 3780, status: 'Confirmée', image: offers[2].image },
  { id: 'HT-23951', title: 'La Badira — Adult Only', date: '18–21 Juin 2026', people: 2, amount: 765, status: 'Terminée', image: offers[1].image }
]

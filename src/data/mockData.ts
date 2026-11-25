import { WhatsAppNumber, Customer, TourPackage, Conversation, Booking, FollowUp, Campaign, KnowledgeItem, TeamMember } from '../types';

export const INITIAL_NUMBERS: WhatsAppNumber[] = [
  {
    id: 'num-1',
    phoneNumber: '+91 98201 23456',
    name: 'Jainam Main Booking Desk (Mumbai Head Office)',
    countryCode: 'IN (+91)',
    status: 'connected',
    isDefault: true,
    conversationsCount: 1840
  },
  {
    id: 'num-2',
    phoneNumber: '+91 98980 65432',
    name: 'Custom Holidays & VIP Desk (Gujarat)',
    countryCode: 'IN (+91)',
    status: 'connected',
    isDefault: false,
    conversationsCount: 1120
  },
  {
    id: 'num-3',
    phoneNumber: '+971 50 123 4567',
    name: 'Dubai & Middle East Operations',
    countryCode: 'UAE (+971)',
    status: 'connected',
    isDefault: false,
    conversationsCount: 640
  },
  {
    id: 'num-4',
    phoneNumber: '+44 7911 123456',
    name: 'UK & Europe Concierge Desk',
    countryCode: 'UK (+44)',
    status: 'connected',
    isDefault: false,
    conversationsCount: 310
  }
];

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-1',
    name: 'Kashmir Paradise & Dal Lake Luxury Houseboat',
    destination: 'Srinagar, Gulmarg, Pahalgam',
    country: 'India',
    duration: '6 Days / 5 Nights',
    nights: 5,
    pricePerPerson: 42500,
    childPrice: 22000,
    groupPrice: 38000,
    currency: '₹',
    hotelCategory: 5,
    hotelDetails: 'The Lalit Grand Palace Srinagar & Kolahoi Green Heights Gulmarg',
    transportation: 'Dedicated Toyota Innova Crysta with English/Hindi chauffeur',
    meals: 'Daily Breakfast & Traditional Kashmiri Wazwan & Pure Veg / Jain Dining Available',
    inclusions: [
      '5 nights luxury hotel & heritage super-deluxe houseboat on Dal Lake',
      'Private Shikara boat ride with floating flower & saffron market visit',
      'Gulmarg Gondola cable car ride (Phase 1 & Phase 2 included)',
      'Betaab Valley, Aru Valley & Chandanwari private excursion in Pahalgam',
      'All toll taxes, parking, driver allowances, and airport transfers'
    ],
    exclusions: [
      'Domestic flights to Srinagar (SXR)',
      'Pony rides / sledge rentals in Gulmarg / Pahalgam',
      'Personal expenses and shopping'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Sunset Dal Lake Shikara Cruise',
        description: 'Warm reception at Srinagar airport. Transfer to heritage luxury houseboat. Evening relaxing Shikara ride across the serene waters of Dal Lake.',
        activities: ['Airport pickup', 'Houseboat welcome', 'Sunset Shikara cruise'],
        hotel: 'Mascot Luxury Heritage Houseboat'
      },
      {
        day: 2,
        title: 'Mughal Gardens, Shankarcharya Temple & Old City',
        description: 'Explore Nishat Bagh, Shalimar Bagh, and Chashme Shahi terraced gardens. Visit historic Shankaracharya Hilltop Temple.',
        activities: ['Mughal garden walk', 'Temple visit', 'Local walnut craft shopping'],
        hotel: 'The Lalit Grand Palace Srinagar'
      },
      {
        day: 3,
        title: 'Gulmarg Meadow of Flowers & Gondola Cable Car Peak',
        description: 'Scenic drive to Gulmarg. Board the famous Gondola cable car ascending towards snow-capped Kongdoori and Apharwat peaks.',
        activities: ['Gondola Phase 1 & 2', 'Snow view photography', 'Pine forest stroll'],
        hotel: 'Kolahoi Green Heights Gulmarg'
      },
      {
        day: 4,
        title: 'Pahalgam Valley of Shepherds & Lidder River',
        description: 'Drive along saffron fields of Pampore to scenic Pahalgam. Riverside walk along the Lidder River and evening bazaar exploration.',
        activities: ['Saffron fields', 'Lidder river walk', 'Pahalgam club dinner'],
        hotel: 'Pahalgam Pine N Peak Hotel'
      },
      {
        day: 5,
        title: 'Betaab Valley & Aru Wildlife Sanctuary Excursion',
        description: 'Explore the picture-perfect Betaab Valley named after the classic Bollywood movie, followed by lush green alpine meadows of Aru Valley.',
        activities: ['Betaab valley tour', 'Aru valley hike', 'Campfire dinner'],
        hotel: 'The Lalit Grand Palace Srinagar'
      },
      {
        day: 6,
        title: 'Farewell Kahwa Breakfast & Airport Transfer',
        description: 'Enjoy traditional Kashmiri Kahwa tea with almonds, final dry fruits and saffron shopping, chauffeured transfer to Srinagar airport.',
        activities: ['Traditional breakfast', 'Dry fruit shopping', 'Airport departure'],
        hotel: 'Departure'
      }
    ],
    highlights: ['Dal Lake Houseboat', 'Gulmarg Gondola Phase 1 & 2', 'Betaab Valley', 'Pure Veg / Jain Food Options'],
    bestSeason: 'March to October (Summer & Autumn) & Dec-Feb (Snow)',
    availableDates: ['2026-06-10', '2026-06-25', '2026-07-15', '2026-08-01', '2026-09-12'],
    images: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
    ],
    terms: 'Full refund up to 14 days before departure. 30% advance deposit to secure bookings.',
    isActive: true,
    featured: true
  },
  {
    id: 'pkg-2',
    name: 'Bali Romantic Tropical Escape & Private Pool Villas',
    destination: 'Bali (Ubud & Seminyak)',
    country: 'Indonesia',
    duration: '7 Days / 6 Nights',
    nights: 6,
    pricePerPerson: 78000,
    childPrice: 42000,
    groupPrice: 69000,
    currency: '₹',
    hotelCategory: 5,
    hotelDetails: 'The Kayon Jungle Resort (Ubud) & W Bali Seminyak (Pool Villa)',
    transportation: 'Private AC Luxury Van with English-speaking chauffeur',
    meals: 'Daily Floating Breakfast, 4 Dinners at beachside resorts, Candlelight Dinner',
    inclusions: [
      '6 nights in 5-star private pool villas',
      'VIP Airport Meet & Fast-track Immigration',
      'Mount Batur Sunrise Jeep Tour & Breakfast',
      'Tirta Empul Water Purification Blessing',
      'Seminyak Sunset Catamaran Cruise',
      'Complimentary 120-min Balinese Couples Spa'
    ],
    exclusions: [
      'International round-trip flights',
      'Personal travel insurance',
      'Indonesia Visa on Arrival ($35 USD)',
      'Personal expenses'
    ],
    dailyItinerary: [
      {
        day: 1,
        title: 'Arrival in Denpasar & Ubud Rainforest Check-in',
        description: 'Chauffeured pickup from Ngurah Rai Airport. Cold towels and check-in to Kayon Jungle Resort pool villa.',
        activities: ['Airport VIP reception', 'Villa check-in', 'Evening welcome drink'],
        hotel: 'The Kayon Jungle Resort'
      },
      {
        day: 2,
        title: 'Tegallalang Rice Terraces & Sacred Water Temple',
        description: 'Explore the iconic terraced valleys of Ubud, jungle swings, and traditional Balinese blessing ceremony.',
        activities: ['Rice terrace walk', 'Tirta Empul blessing', 'Organic lunch'],
        hotel: 'The Kayon Jungle Resort'
      },
      {
        day: 3,
        title: 'Mount Batur 4WD Jeep Sunrise & Black Lava Trail',
        description: 'Early morning 4WD open-top jeep journey up Mount Batur caldera for sunrise views over Lake Batur.',
        activities: ['Caldera sunrise', 'Hot springs dip', 'Coffee tasting'],
        hotel: 'The Kayon Jungle Resort'
      },
      {
        day: 4,
        title: 'Transfer to Seminyak & Sunset Beach Club Experience',
        description: 'Scenic drive to vibrant Seminyak, check into W Bali Ocean Villa. Reserved VIP cabana for sunset.',
        activities: ['Scenic transfer', 'Seminyak villa check-in', 'Sunset at beach club'],
        hotel: 'W Bali Seminyak'
      },
      {
        day: 5,
        title: 'Nusa Penida Island Private Speedboat Day Trip',
        description: 'Private boat to Nusa Penida to witness Kelingking cliff, Angel Billabong, and swim with manta rays.',
        activities: ['Speedboat cruise', 'Kelingking cliff photos', 'Manta bay snorkeling'],
        hotel: 'W Bali Seminyak'
      },
      {
        day: 6,
        title: 'Balinese Spa Day & Romantic Beachside Candlelight Dinner',
        description: '2-hour therapeutic couples massage followed by an exclusive table set upon the sand under the stars.',
        activities: ['120-min Spa ritual', 'Shopping in Seminyak boutiques', 'Candlelight dinner'],
        hotel: 'W Bali Seminyak'
      },
      {
        day: 7,
        title: 'Souvenir Markets & Chauffeur to Airport',
        description: 'Leisurely floating breakfast in your private pool, final packing, and private chauffeur to DPS airport.',
        activities: ['Floating breakfast', 'Art market visit', 'Airport departure'],
        hotel: 'Departure'
      }
    ],
    highlights: ['Private Pool Villas', 'Mount Batur 4x4 Jeep', 'Nusa Penida Manta Snorkel', 'Floating Breakfast'],
    bestSeason: 'April to October',
    availableDates: ['2026-06-10', '2026-06-25', '2026-07-15', '2026-08-01', '2026-09-12'],
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?auto=format&fit=crop&w=800&q=80'
    ],
    terms: 'Full refund up to 14 days before departure. 50% deposit required upon booking confirmation.',
    isActive: true,
    featured: true
  },
  {
    id: 'pkg-3',
    name: 'Swiss Alps Grand Express & Glacier Scenic Journey',
    destination: 'Zurich, Lucerne, Interlaken, Zermatt',
    country: 'Switzerland',
    duration: '8 Days / 7 Nights',
    nights: 7,
    pricePerPerson: 195000,
    childPrice: 110000,
    groupPrice: 175000,
    currency: '₹',
    hotelCategory: 4,
    hotelDetails: 'Hotel Schweizerhof Lucerne, Victoria-Jungfrau Interlaken, Mont Cervin Zermatt',
    transportation: '1st Class Swiss Travel Pass (Panoramic Glacier Express Trains & Lake Steamers)',
    meals: 'Daily Buffet Breakfast, Traditional Swiss Fondue Dinner with Indian Pure Veg Meals arranged',
    inclusions: [
      '7 nights accommodation in boutique alpine 4-star hotels',
      '8-Day 1st Class Swiss Travel Pass with seat reservations',
      'Glacier Express panoramic rail journey (Zermatt to St. Moritz)',
      'Excursion to Jungfraujoch — Top of Europe',
      'Gornergrat cogwheel train with Matterhorn reflection views',
      'Lake Lucerne vintage steamboat cruise'
    ],
    exclusions: ['International flights', 'Schengen Visa fees', 'Personal expenses'],
    dailyItinerary: [
      {
        day: 1,
        title: 'Arrival in Zurich & Scenic Train to Lucerne',
        description: 'Arrive at Zurich Airport. Board the Swiss Rail to Lucerne. Walk the historic Chapel Bridge.',
        activities: ['Airport rail transfer', 'Chapel Bridge walk', 'Lucerne Old Town dining'],
        hotel: 'Hotel Schweizerhof Lucerne'
      },
      {
        day: 2,
        title: 'Mount Pilatus Golden Round Trip',
        description: 'Boat ride across Lake Lucerne, ascend world steepest cogwheel railway to Mt. Pilatus peak.',
        activities: ['Lake cruise', 'Cogwheel ascent', 'Panoramic alpine viewing'],
        hotel: 'Hotel Schweizerhof Lucerne'
      },
      {
        day: 3,
        title: 'Interlaken & Lauterbrunnen Valley of 72 Waterfalls',
        description: 'Scenic rail to Interlaken. Afternoon exploration of Lauterbrunnen and Trummelbach Falls.',
        activities: ['Train through mountain passes', 'Waterfall hike', 'Swiss alpine village stroll'],
        hotel: 'Victoria-Jungfrau Grand Hotel'
      },
      {
        day: 4,
        title: 'Jungfraujoch — Top of Europe (3,454m)',
        description: 'Ascend the Eiger Express tri-cable gondola and cogwheel train to Europe highest railway station.',
        activities: ['Ice Palace tour', 'Aletsch Glacier lookout', 'Bollywood shooting points'],
        hotel: 'Victoria-Jungfrau Grand Hotel'
      },
      {
        day: 5,
        title: 'Journey to Car-Free Zermatt & Matterhorn First Glimpse',
        description: 'Travel through the Valais wine region into the iconic car-free resort village of Zermatt.',
        activities: ['Scenic valley train', 'Zermatt electric taxi transfer', 'Dinner with Matterhorn view'],
        hotel: 'Mont Cervin Palace Zermatt'
      },
      {
        day: 6,
        title: 'Gornergrat Cogwheel Summit & Riffelsee Lake Reflection',
        description: 'Climb by open-air cogwheel railway to 3,089m with jaw-dropping views of 29 four-thousander peaks.',
        activities: ['Gornergrat train', 'Matterhorn photo shoot', 'Alpine museum'],
        hotel: 'Mont Cervin Palace Zermatt'
      },
      {
        day: 7,
        title: 'Glacier Express Scenic Panorama Journey',
        description: 'Board the world slowest express train with oversized panoramic windows through the Rhine Gorge.',
        activities: ['Panoramic glass car travel', '3-course lunch aboard train', 'Scenic bridge crossing'],
        hotel: 'Hotel Schweizerhof Zurich'
      },
      {
        day: 8,
        title: 'Zurich Old Town & Departure',
        description: 'Morning walk along Bahnhofstrasse luxury boulevard before heading to Zurich International Airport.',
        activities: ['Bahnhofstrasse shopping', 'Limmat river stroll', 'Airport departure'],
        hotel: 'Departure'
      }
    ],
    highlights: ['Glacier Express 1st Class', 'Jungfraujoch Top of Europe', 'Matterhorn Sunrise', 'Jain/Veg Food Catering'],
    bestSeason: 'May to October & Dec to March',
    availableDates: ['2026-06-15', '2026-07-02', '2026-07-20', '2026-08-10', '2026-09-05'],
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    terms: 'Non-refundable rail pass portion once issued. Free date change up to 21 days prior.',
    isActive: true,
    featured: true
  },
  {
    id: 'pkg-4',
    name: 'Dubai Luxury Desert Safari & Atlantis Palm Experience',
    destination: 'Dubai & Abu Dhabi',
    country: 'United Arab Emirates',
    duration: '5 Days / 4 Nights',
    nights: 4,
    pricePerPerson: 64000,
    childPrice: 32000,
    groupPrice: 58000,
    currency: '₹',
    hotelCategory: 5,
    hotelDetails: 'Atlantis The Royal Palm & Address Downtown Dubai',
    transportation: 'Private AC Van / Cadillac Escalade Chauffeur throughout stay',
    meals: 'Daily Breakfast, Ultra-Luxury Desert Dune Dinner with Fire Show, Burj Khalifa Hi-Tea',
    inclusions: [
      '4 nights in 5-star premier skyline rooms',
      'Private VIP Desert Safari with Platinum Land Cruisers',
      'Burj Khalifa Level 148 At the Top VIP entry',
      'Day Tour to Abu Dhabi Sheikh Zayed Grand Mosque & BAPS Hindu Mandir',
      'Private 2-hour Dubai Marina Luxury Yacht Cruise'
    ],
    exclusions: ['International flights', 'UAE Tourist Visa', 'Personal expenses'],
    dailyItinerary: [
      {
        day: 1,
        title: 'VIP Airport Welcome & Atlantis The Royal Check-in',
        description: 'Private transfer from DXB Airport directly to Atlantis The Royal Palm with private check-in.',
        activities: ['Chauffeur transfer', 'Check-in', 'Aquaventure Waterpark access'],
        hotel: 'Atlantis The Royal'
      },
      {
        day: 2,
        title: 'Skyline Architecture & Burj Khalifa Sky Lounge',
        description: 'Explore Museum of the Future, Dubai Mall, and ascend Burj Khalifa Level 148 for sunset views.',
        activities: ['Museum of the Future', 'VIP Burj Khalifa', 'Dubai Fountain show'],
        hotel: 'Address Downtown'
      },
      {
        day: 3,
        title: 'Platinum Desert Conservation Safari with Camp BBQ',
        description: 'Dune bashing through Dubai Desert Conservation Reserve followed by gourmet feast and cultural show.',
        activities: ['Dune drive', 'Falconry display', 'Stargazing dinner'],
        hotel: 'Address Downtown'
      },
      {
        day: 4,
        title: 'Abu Dhabi Cultural Tour & BAPS Hindu Mandir',
        description: 'Day tour visiting the stunning Sheikh Zayed Grand Mosque, the historic BAPS Hindu Mandir, and Louvre.',
        activities: ['Grand Mosque tour', 'BAPS Hindu Mandir visit', 'Corniche drive'],
        hotel: 'Address Downtown'
      },
      {
        day: 5,
        title: 'Private Yacht Cruise & Airport Departure',
        description: 'Morning 2-hour private yacht cruise departing Dubai Marina before heading to airport.',
        activities: ['Marina yacht cruise', 'Gold Souk visit', 'Airport drop-off'],
        hotel: 'Departure'
      }
    ],
    highlights: ['Atlantis The Royal', 'BAPS Hindu Mandir Abu Dhabi', 'Burj Khalifa VIP 148', 'Private Yacht Cruise'],
    bestSeason: 'October to April',
    availableDates: ['2026-10-01', '2026-10-18', '2026-11-05', '2026-12-01'],
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    terms: '7 days prior cancellation policy. Instant booking confirmation.',
    isActive: true,
    featured: false
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_FOLLOWUPS: FollowUp[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    category: 'General',
    question: 'Do you arrange pure vegetarian and Jain food during international & domestic tours?',
    answer: 'Yes, absolutely. Being a trusted Indian travel firm, Jainam Tours and Travels ensures that pure vegetarian and Jain meals (prepared without onion, garlic, or root vegetables) are specially catered across all our customized packages, including Switzerland, Bali, Dubai, and Kashmir.',
    keywords: ['jain food', 'pure veg', 'meals', 'switzerland veg', 'dining', 'dietary'],
    confidenceScore: 0.99
  },
  {
    id: 'kb-2',
    category: 'Visa',
    question: 'Do you provide full visa assistance for Switzerland (Schengen) and UK tours?',
    answer: 'Yes, our documentation team assists with appointment booking at VFS Global (Mumbai, Ahmedabad, Delhi, etc.), document verification, official itinerary vouchers, travel insurance, and biometric guidance.',
    keywords: ['visa', 'schengen', 'vfs', 'switzerland visa', 'documents', 'passport'],
    confidenceScore: 0.98
  },
  {
    id: 'kb-3',
    category: 'Payment',
    question: 'What are the accepted payment methods and booking deposit requirements?',
    answer: 'We accept RTGS / NEFT direct bank transfer, UPI, and major credit cards via secure payment links. Typically, a 30% advance deposit confirms your tour package, with balance payable 21 days before departure.',
    keywords: ['payment', 'deposit', 'bank transfer', 'neft', 'rtgs', 'upi', 'credit card'],
    confidenceScore: 0.99
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Jainam Shah',
    email: 'dhruviktra.rajput.1379@gmail.com',
    role: 'Founder & Managing Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    activeLeads: 12,
    conversionRate: 64.5,
    status: 'Active'
  },
  {
    id: 'team-2',
    name: 'Pooja Parekh',
    email: 'pooja.parekh@jainamtours.com',
    role: 'Senior Operations & Finance Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    activeLeads: 24,
    conversionRate: 58.4,
    status: 'Active'
  },
  {
    id: 'team-3',
    name: 'Chirag Mehta',
    email: 'chirag.mehta@jainamtours.com',
    role: 'Senior Holiday Consultant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    activeLeads: 18,
    conversionRate: 49.2,
    status: 'Active'
  },
  {
    id: 'team-4',
    name: 'Ritu Sharma',
    email: 'ritu.sharma@jainamtours.com',
    role: 'Luxury Destination Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    activeLeads: 14,
    conversionRate: 44.0,
    status: 'Active'
  },
  {
    id: 'team-5',
    name: 'Bhavin Shah',
    email: 'bhavin.shah@jainamtours.com',
    role: 'Group & Custom Tour Head',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    activeLeads: 16,
    conversionRate: 52.0,
    status: 'Active'
  },
  {
    id: 'team-6',
    name: 'Sneha Desai',
    email: 'sneha.desai@jainamtours.com',
    role: 'Customer Desk & Visa Consultant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    activeLeads: 11,
    conversionRate: 46.5,
    status: 'Active'
  },
  {
    id: 'team-7',
    name: 'Karan Rajput',
    email: 'karan.rajput@jainamtours.com',
    role: 'VIP Concierge Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    activeLeads: 9,
    conversionRate: 48.0,
    status: 'Active'
  }
];

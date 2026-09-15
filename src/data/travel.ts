export interface CountryVisit {
  id: number; // numeric ISO 3166-1
  name: string;
  badge: string;
  photos: string[];
  note?: string;
}


export const visitedCountries: CountryVisit[] = [

  // ── East & Southeast Asia ────────────────────────────────────────────────
  { id: 158, name: 'Taiwan',        badge: '🇹🇼', photos: [], note: 'Home since 2000 — the place I always return to.' },
  { id: 392, name: 'Japan',         badge: '🇯🇵', photos: [], note: 'Okinawa beach days and wandering around Nagoya.' },
  { id: 410, name: 'South Korea',   badge: '🇰🇷', photos: [], note: 'Jeju Island escape, 2024.' },
  { id: 156, name: 'China',         badge: '🇨🇳', photos: [], note: 'World Expo Shanghai, 2010 — still remember the pavilions.' },
  { id: 344, name: 'Hong Kong',     badge: '🇭🇰', photos: [], note: 'A vibrant city that\'s hard to forget.' },
  { id: 446, name: 'Macao',         badge: '🇲🇴', photos: [],       note: 'Quick border hop from Hong Kong.' },
  { id: 702, name: 'Singapore',     badge: '🇸🇬', photos: [], note: 'Multiple visits — surprisingly never gets old.' },
  { id: 764, name: 'Thailand',      badge: '🇹🇭', photos: [], note: 'Classic Southeast Asia adventure.' },
  { id: 360, name: 'Indonesia',     badge: '🇮🇩', photos: [], note: 'Several Bali holidays — the rice terraces never disappoint.' },
  { id: 458, name: 'Malaysia',      badge: '🇲🇾', photos: [], note: 'Sabah diving and rainforest vibes.' },

  // ── South Asia ───────────────────────────────────────────────────────────
  { id: 144, name: 'Sri Lanka',     badge: '🇱🇰', photos: ['/assets/images/travel/srilanka-1.webp'], note: 'International volunteer programme, 2016.' },

  // ── Middle East ──────────────────────────────────────────────────────────
  { id: 376, name: 'Israel',        badge: '🇮🇱', photos: ['/assets/images/travel/israel-1.webp', '/assets/images/travel/israel-2.webp', '/assets/images/travel/israel-3.webp'], note: 'Tel Aviv University exchange semester, 2022.' },
  { id: 400, name: 'Jordan',        badge: '🇯🇴', photos: ['/assets/images/travel/jordan-1.webp'], note: 'Hiked Petra and camped in Wadi Rum, 2022.' },
  { id: 275, name: 'Palestine',     badge: '🇵🇸', photos: ['/assets/images/travel/palestine-1.webp', '/assets/images/travel/palestine-2.webp'], note: 'West Bank visit, 2022.' },
  { id: 792, name: 'Turkey',        badge: '🇹🇷', photos: [], note: 'Istanbul and beyond, 2018.' },

  // ── Africa ───────────────────────────────────────────────────────────────
  { id: 818, name: 'Egypt',         badge: '🇪🇬', photos: [], note: 'Pyramids and controlled chaos, 2017.' },

  // ── Northern & Western Europe ────────────────────────────────────────────
  { id: 826, name: 'United Kingdom',badge: '🇬🇧', photos: ['/assets/images/travel/uk-1.webp', '/assets/images/travel/uk-2.webp', '/assets/images/travel/uk-3.webp'], note: 'Living and working here post-Imperial MSc (2023–present).' },
  { id: 372, name: 'Ireland',       badge: '🇮🇪', photos: [], note: 'Wild Atlantic Way road trip, 2025.' },
  { id: 352, name: 'Iceland',       badge: '🇮🇸', photos: ['/assets/images/travel/iceland-1.webp', '/assets/images/travel/iceland-2.webp'], note: 'Self-drive ring road in winter, 2025.' },
  { id: 208, name: 'Denmark',       badge: '🇩🇰', photos: [], note: 'Copenhagen, 2024 — hygge is absolutely real.' },
  { id: 752, name: 'Sweden',        badge: '🇸🇪', photos: [], note: 'Stockholm and north, 2024.' },
  { id: 578, name: 'Norway',        badge: '🇳🇴', photos: ['/assets/images/travel/norway-1.webp', '/assets/images/travel/norway-2.webp'], note: 'Lofoten Islands self-drive — most dramatic landscape I\'ve ever seen (2022).' },
  { id: 250, name: 'France',        badge: '🇫🇷', photos: ['/assets/images/travel/france-1.webp', '/assets/images/travel/france-2.webp'], note: 'Self-drive through Paris and the south, 2019.' },
  { id: 492, name: 'Monaco',        badge: '🇲🇨', photos: [],       note: 'Tiny but impossibly glitzy — a quick stop on the 2019 drive.' },
  { id: 20,  name: 'Andorra',       badge: '🇦🇩', photos: [],       note: 'High-altitude detour on the Pyrenees self-drive, 2019.' },
  { id: 724, name: 'Spain',         badge: '🇪🇸', photos: ['/assets/images/travel/spain-1.webp', '/assets/images/travel/spain-2.webp'], note: 'Barcelona and beyond, 2020.' },

  // ── Central Europe ───────────────────────────────────────────────────────
  { id: 276, name: 'Germany',       badge: '🇩🇪', photos: [], note: 'Multiple cities — efficient trains, great bread.' },
  { id: 756, name: 'Switzerland',   badge: '🇨🇭', photos: [], note: 'Alpine roads and impossibly clean lakes.' },
  { id: 40,  name: 'Austria',       badge: '🇦🇹', photos: [], note: 'Vienna and the Alps.' },
  { id: 203, name: 'Czech Republic',badge: '🇨🇿', photos: ['/assets/images/travel/czech-1.webp'], note: 'Prague\'s old town is every bit as magical as advertised.' },
  { id: 616, name: 'Poland',        badge: '🇵🇱', photos: ['/assets/images/travel/poland-1.webp'], note: 'Auschwitz visit — necessary and humbling, 2022.' },

  // ── Southern Europe ──────────────────────────────────────────────────────
  { id: 380, name: 'Italy',         badge: '🇮🇹', photos: ['/assets/images/travel/italy-1.webp', '/assets/images/travel/italy-2.webp'], note: 'Venice & Rome 2022; back for Cervinia skiing in 2026.' },
  { id: 336, name: 'Vatican City',  badge: '🇻🇦', photos: ['/assets/images/travel/vatican-2.webp'], note: 'The Sistine Chapel ceiling really does live up to the hype.' },
  { id: 470, name: 'Malta',         badge: '🇲🇹', photos: ['/assets/images/travel/malta-1.webp', '/assets/images/travel/malta-2.webp'], note: 'Sun, sea, and Valletta\'s baroque streets, 2024.' },
  { id: 300, name: 'Greece',        badge: '🇬🇷', photos: ['/assets/images/travel/greece-1.webp'], note: 'Self-drive around Santorini, 2022.' },
  { id: 191, name: 'Croatia',       badge: '🇭🇷', photos: ['/assets/images/travel/croatia-1.webp', '/assets/images/travel/croatia-2.webp', '/assets/images/travel/croatia-3.webp'], note: 'Dubrovnik coast self-drive, 2022.' },
  { id: 8,   name: 'Albania',       badge: '🇦🇱', photos: ['/assets/images/travel/albania-1.webp'], note: 'Beautifully underrated Riviera, 2024.' },
  { id: 807, name: 'North Macedonia',badge: '🇲🇰', photos: ['/assets/images/travel/northmacedonia-1.webp'], note: 'Self-drive through Skopje and Lake Ohrid, 2024.' },

  // ── North America ────────────────────────────────────────────────────────
  { id: 124, name: 'Canada',        badge: '🇨🇦', photos: [], note: 'Vancouver & UBC summer programme, 2014.' },
  // Guam is a US territory — shows under the same polygon as USA
  { id: 840, name: 'United States', badge: '🇺🇸', photos: ['/assets/images/travel/us-1.webp', '/assets/images/travel/us-2.webp'], note: 'East Coast campus tours & study 2016, plus Guam beach holiday.' },

  // ── Oceania ──────────────────────────────────────────────────────────────
  { id: 36,  name: 'Australia',     badge: '🇦🇺', photos: [], note: 'Wide open spaces and surprisingly good coffee.' },
  { id: 585, name: 'Palau',         badge: '🇵🇼', photos: [], note: 'Crystal-clear waters and the famous jellyfish lake.' },
];

export const visitedIds = new Set(visitedCountries.map(c => c.id));

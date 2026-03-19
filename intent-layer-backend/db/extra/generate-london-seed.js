#!/usr/bin/env node
/**
 * Generates London hotels seed JSON: Profile, Facility, Media, Service.
 * Uses: London_hotel_reviews.csv, Category.json, Facility.json, Media.json, Service.json (for structure).
 * Output: db/new/Profile.json, Facility.json, Media.json, Service.json
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname);
const NEW_DIR = path.join(__dirname, 'new');

function uuid() {
  return crypto.randomUUID();
}

/**
 * Parse CSV and return unique values from first column (Property Name).
 * Handles quoted fields with embedded commas and newlines.
 */
function uniqueHotels(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const names = new Set();
  let i = 0;
  const firstNewline = content.indexOf('\n');
  i = firstNewline === -1 ? content.length : firstNewline + 1;

  while (i < content.length) {
    let name;
    if (content[i] === '"') {
      const start = i + 1;
      let end = start;
      while (end < content.length) {
        const next = content.indexOf('"', end);
        if (next === -1) break;
        if (content[next + 1] === '"') {
          end = next + 2;
          continue;
        }
        if (content[next + 1] === ',' || content[next + 1] === '\r' || content[next + 1] === '\n') {
          name = content.slice(start, next).replace(/""/g, '"').trim();
          end = next + 1;
          break;
        }
        end = next + 1;
      }
      i = content.indexOf('\n', end);
      i = i === -1 ? content.length : i + 1;
    } else {
      const comma = content.indexOf(',', i);
      const nl = content.indexOf('\n', i);
      const stop = comma !== -1 && (nl === -1 || comma < nl) ? comma : nl;
      const end = stop === -1 ? content.length : stop;
      name = content.slice(i, end).replace(/^\s*"|"\s*$/g, '').trim();
      i = nl !== -1 ? nl + 1 : content.length;
    }
    if (name && name !== 'Property Name') names.add(name);
  }

  return [...names].sort();
}

// --- Data from user ---
const USER_IDS = [
  '2175f0be-aa78-4a27-8e24-bfee55fa2dff',
  '8a458396-276e-4f2d-a0e3-74a71716dfe2',
  '8d6c245d-e5e2-4884-a903-a8f6c7e0566c',
  'ca76efed-9002-4657-ac74-08e75b1a6a57',
  '128f847d-c22d-4bba-9b80-61260b1f733e',
];

const COVER_MEDIA_URLS = [
  'https://images.pexels.com/photos/161758/governor-s-mansion-montgomery-alabama-grand-staircase-161758.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://media.istockphoto.com/id/1328718838/photo/luxury-hotel-modern-interior-bedroom-with-large-windows-winter-scene-mountain-forest.jpg?b=1&s=612x612&w=0&k=20&c=t59KYN_o4_ZjvIlHyyC2YBt8oOlkqN5qSQqrw_G0ym0=',
  'https://media.istockphoto.com/id/1159873271/photo/residential-area-in-the-city-modern-apartment-buildings.jpg?b=1&s=612x612&w=0&k=20&c=jAvFUVVp30nDNsNUeiUikC1dtW_gwqVclck9Ma2Y-SI=',
  'https://images.pexels.com/photos/5893331/pexels-photo-5893331.jpeg',
  'https://images.pexels.com/photos/6071476/pexels-photo-6071476.jpeg',
  'https://images.pexels.com/photos/5371582/pexels-photo-5371582.jpeg',
  'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
  'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
  'https://www.peninsula.com/en/-/media/12---london-property/rooms/20230918-new-images/london_deluxe-room-king_resized.jpg?mw=980&hash=2E4C54A8430CA644DBBEDFA8EAFECFE8',
  'https://www.royalgardenhotel.co.uk/_novaimg/5386192-1578203_368_0_3194_3194_1000_1000.jpg',
  'https://media.leonardo-hotels.com/static.leonardo-hotels.com/image/lsp1605250040a_601_0863c1fbe4408d5ba7096e7c55d3007b.jpg',
  'https://i.guim.co.uk/img/media/bb9e4ed57f3325c252592f9f37add283ebc862eb/0_2846_8260_4956/master/8260.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=520e2f5f4efa8e49e57d96914af9ab8a',
  'https://www.fourseasons.com/alt/img-opt/~70.1530.0,0000-313,5000-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/LON/LON_2905_original.jpg',
  'https://media.cntraveler.com/photos/674382e3c9e74c217a2aef48/16:9/w_2560,c_limit/Nobu%20Hotel%20London%20Shoreditch%20premium.jpg',
  'https://media.cntraveler.com/photos/65398bcb3f54a421fea6493c/1:1/w_1335,h_1335,c_limit/The%20Landmark-london-june22-pr-global.jpeg',
  'https://media.timeout.com/images/106210635/750/562/image.jpg',
  'https://images.trvl-media.com/lodging/2000000/1220000/1217700/1217618/18a9a6d1.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
  'https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2019/08/LONDON-BEST-LUXURY-HOTELS-2-1.jpg?fit=1300%2C731&ssl=1',
  'https://www.peninsula.com/en/-/media/12---london-property/rooms/13052024/premier_parkroom_hr.jpg?mw=980&hash=FE636C1DCFB929FC6FC5FCC417918984',
  'https://d3ktnyaxlw717i.cloudfront.net/cache/img/hotel-london-paris-9-156742-390-600-portrait.jpg?q=1658223715',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/20/d2/88/best.jpg?w=900&h=500&s=1',
  'https://hips.hearstapps.com/hmg-prod/images/london-hotels-with-a-view-646c859604f1c.jpg',
  'https://static.independent.co.uk/2025/05/15/8/31/The-Dorchester_LOBBY_-Hero_-Dorchester-Collection-_1.jpeg',
  'https://media.timeout.com/images/106238770/750/562/image.jpg',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/51/04/0f/the-strand-palace-hotel.jpg?w=1200&h=-1&s=1',
];

// Enough addresses for many hotels; cycle if needed
const LONDON_STREETS = [
  '1 Strand', '10 Downing St', '15 Berkeley St', '45 Park Lane', '88 Knightsbridge',
  '100 Shoreditch High St', '1 Whitehall Pl', '2 Kingdom St', 'Wellington St', 'Aldwych',
  'Brick Lane', 'Covent Garden', 'Mayfair', 'Marylebone', 'Kensington High St',
  'Hyde Park Corner', 'Marble Arch', 'Liverpool St', 'Thames Embankment', 'Westminster',
  'Northumberland Ave', 'Victoria Embankment', 'Trafalgar Sq', 'Pall Mall', 'St James\'s St',
  'Piccadilly', 'Regent St', 'Oxford St', 'Baker St', 'Euston Rd', 'Kingsway', 'Fleet St',
  'Ludgate Hill', 'Cannon St', 'Fenchurch St', 'Leadenhall St', 'Bishopsgate', 'Gracechurch St',
  'Threadneedle St', 'Cornhill', 'Lombard St', 'Cheapside', 'New Bond St', 'Old Bond St',
  'Mount St', 'Curzon St', 'Park Lane', 'Grosvenor St', 'Davies St', 'Brook St', 'Conduit St',
];

const ts = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
};

// --- Load references ---
const hotelNames = uniqueHotels(path.join(DB_DIR, 'London_hotel_reviews.csv'));
console.log(`Found ${hotelNames.length} unique hotels in London_hotel_reviews.csv — creating a profile for each.`);
const categories = JSON.parse(fs.readFileSync(path.join(DB_DIR, 'Category.json'), 'utf8'));
const facilitiesRef = JSON.parse(fs.readFileSync(path.join(DB_DIR, 'Facility.json'), 'utf8'));
const facilityNames = [...new Set(facilitiesRef.map((f) => f.name))];

// Subcategory IDs for services (from Category.json - children)
const subCategoryIds = categories.filter((c) => c.parentId).map((c) => ({ id: c.id, title: c.title }));

if (!fs.existsSync(NEW_DIR)) fs.mkdirSync(NEW_DIR, { recursive: true });

// --- Profiles ---
const profiles = [];
const profileIdByIndex = [];

for (let i = 0; i < hotelNames.length; i++) {
  const name = hotelNames[i];
  const id = uuid();
  profileIdByIndex.push(id);
  const lat = 51.5074 + (Math.random() * 0.05 - 0.025);
  const lng = -0.1278 + (Math.random() * 0.05 - 0.025);
  const price = Math.round(80 + Math.random() * 300);
  const totalReviews = Math.floor(50 + Math.random() * 500);
  const averageRating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  profiles.push({
    id,
    accor_id: null,
    name,
    description: `${name} is a well-loved destination in London. Guests appreciate the central location, comfortable rooms, and attentive service. Ideal for business stays, weekend breaks, and exploring the city.`,
    email: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@allspacesai.com',
    lat: Math.round(lat * 1000000) / 1000000,
    lng: Math.round(lng * 1000000) / 1000000,
    address: `${LONDON_STREETS[i % LONDON_STREETS.length]}, London, United Kingdom`,
    coverMedia: COVER_MEDIA_URLS[i % COVER_MEDIA_URLS.length],
    source: 'SPACE',
    status: 'PUBLISHED',
    price,
    totalReviews,
    averageRating,
    userId: USER_IDS[i % USER_IDS.length],
    createdAt: ts(),
    updatedAt: ts(),
  });
}

fs.writeFileSync(path.join(NEW_DIR, 'Profile.json'), JSON.stringify(profiles, null, 2));

// --- Facilities (use existing facility names, new IDs, link to new profiles) ---
const facilityNamesForHotels = ['Wifi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Parking', 'Air Conditioning', 'Non-Smoking', 'Business Center'];
const facilities = [];
let facilityIndex = 0;
for (let p = 0; p < profiles.length; p++) {
  const numFacilities = 4 + Math.floor(Math.random() * 5);
  const picked = new Set();
  for (let f = 0; f < numFacilities && f < facilityNamesForHotels.length; f++) {
    const name = facilityNamesForHotels[f % facilityNamesForHotels.length];
    if (picked.has(name)) continue;
    picked.add(name);
    facilities.push({
      id: uuid(),
      name,
      profileId: profiles[p].id,
      createdAt: ts(),
      updatedAt: ts(),
    });
  }
}
fs.writeFileSync(path.join(NEW_DIR, 'Facility.json'), JSON.stringify(facilities, null, 2));

// --- Media (cover + 1–2 extra per profile using same URL list) ---
const media = [];
for (let p = 0; p < profiles.length; p++) {
  const profileId = profiles[p].id;
  const urlCount = 2 + (p % 2);
  for (let m = 0; m < urlCount; m++) {
    const url = COVER_MEDIA_URLS[(p * 2 + m) % COVER_MEDIA_URLS.length];
    const ext = url.includes('.png') ? 'PNG' : 'JPG';
    media.push({
      id: uuid(),
      filePath: url,
      fileType: ext,
      profileId,
      serviceId: null,
      createdAt: ts(),
      updatedAt: ts(),
    });
  }
}
fs.writeFileSync(path.join(NEW_DIR, 'Media.json'), JSON.stringify(media, null, 2));

// --- Services (use existing category IDs from Category.json) ---
const serviceTemplates = [
  { name: 'Breakfast', categoryTitle: 'Breakfast', minSpend: [25, 55] },
  { name: 'Lunch', categoryTitle: 'Lunch', minSpend: [30, 60] },
  { name: 'Dinner', categoryTitle: 'Dinner', minSpend: [40, 90] },
  { name: 'Spa', categoryTitle: 'Spa', minSpend: [80, 180] },
  { name: 'Gym', categoryTitle: 'Gym', minSpend: [0, 25] },
  { name: 'Swimming', categoryTitle: 'Swimming', minSpend: [20, 50] },
  { name: 'Business Room', categoryTitle: 'Business Room', minSpend: [50, 150] },
  { name: 'Room (Full Day)', categoryTitle: 'Room (Full Day)', minSpend: [150, 400] },
  { name: 'Complimentary Champagne', categoryTitle: 'Complimentary Champagne', minSpend: [0, 50] },
  { name: 'Taxi', categoryTitle: 'Taxi', minSpend: [25, 80] },
];
const services = [];
for (let p = 0; p < profiles.length; p++) {
  const profileId = profiles[p].id;
  const numServices = 4 + Math.floor(Math.random() * 4);
  const desc = profiles[p].description;
  for (let s = 0; s < numServices; s++) {
    const t = serviceTemplates[s % serviceTemplates.length];
    const cat = subCategoryIds.find((c) => c.title === t.categoryTitle) || subCategoryIds[s % subCategoryIds.length];
    const [min, max] = t.minSpend;
    const minSpend = Math.round(min + Math.random() * (max - min));
    services.push({
      id: uuid(),
      name: t.name,
      description: desc,
      minSpend,
      categoryId: cat.id,
      profileId,
      createdAt: ts(),
      updatedAt: ts(),
    });
  }
}
fs.writeFileSync(path.join(NEW_DIR, 'Service.json'), JSON.stringify(services, null, 2));

console.log('Generated in db/new/:');
console.log('  Profile.json:', profiles.length, 'profiles');
console.log('  Facility.json:', facilities.length, 'facilities');
console.log('  Media.json:', media.length, 'media');
console.log('  Service.json:', services.length, 'services');

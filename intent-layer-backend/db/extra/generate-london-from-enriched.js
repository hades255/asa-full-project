#!/usr/bin/env node
/**
 * Builds complete London DB from london_hotels_5000_enriched.json.
 * Writes each table to db/london/: User.json, Profile.json, Facility.json, Media.json, Service.json, Category.json.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = __dirname;
const LONDON_DIR = path.join(DB_DIR, 'london');
const ENRICHED_PATH = path.join(DB_DIR, 'london_hotels_5000_enriched.json');

function uuid() {
  return crypto.randomUUID();
}

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

const FACILITY_NAMES = ['Wifi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Parking', 'Air Conditioning', 'Non-Smoking', 'Business Center'];

const SERVICE_TEMPLATES = [
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

function ts() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

// --- Load ---
const enriched = JSON.parse(fs.readFileSync(ENRICHED_PATH, 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(DB_DIR, 'Category.json'), 'utf8'));
const subCategoryIds = categories.filter((c) => c.parentId).map((c) => ({ id: c.id, title: c.title }));

if (!fs.existsSync(LONDON_DIR)) fs.mkdirSync(LONDON_DIR, { recursive: true });

console.log(`Building London DB from ${enriched.length} hotels in london_hotels_5000_enriched.json → db/london/`);

// --- User.json (5 users, one per USER_IDS) ---
const users = USER_IDS.map((id, i) => ({
  id,
  first_name: `London`,
  last_name: `User ${i + 1}`,
  email: `london-user-${i + 1}@allspacesai.com`,
  password: 'placeholder-seed-password',
  status: 'ACTIVE',
  created_at: ts(),
  updated_at: ts(),
}));
fs.writeFileSync(path.join(LONDON_DIR, 'User.json'), JSON.stringify(users, null, 2));
console.log('  User.json:', users.length);

// --- Profile.json ---
const profiles = enriched.map((h, i) => {
  const id = uuid();
  const email = (h.name || `hotel-${i}`).toLowerCase().replace(/[^a-z0-9]/g, '') + '@allspacesai.com';
  return {
    id,
    accor_id: null,
    name: h.name,
    description: h.description ?? `${h.name} is a well-loved destination in London.`,
    email,
    lat: h.lat ?? 51.5074,
    lng: h.lng ?? -0.1278,
    address: h.address ?? 'London, United Kingdom',
    coverMedia: COVER_MEDIA_URLS[i % COVER_MEDIA_URLS.length],
    source: 'SPACE',
    status: 'PUBLISHED',
    price: Number(h.price) ?? 0,
    totalReviews: Number(h.totalReviews) ?? 0,
    averageRating: Number(h.averageRating) ?? 0,
    userId: USER_IDS[i % USER_IDS.length],
    createdAt: ts(),
    updatedAt: ts(),
  };
});
fs.writeFileSync(path.join(LONDON_DIR, 'Profile.json'), JSON.stringify(profiles, null, 2));
console.log('  Profile.json:', profiles.length);

// --- Facility.json ---
const facilities = [];
for (let p = 0; p < profiles.length; p++) {
  const numFacilities = 4 + (p % 6);
  const picked = new Set();
  for (let f = 0; f < numFacilities; f++) {
    const name = FACILITY_NAMES[f % FACILITY_NAMES.length];
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
fs.writeFileSync(path.join(LONDON_DIR, 'Facility.json'), JSON.stringify(facilities, null, 2));
console.log('  Facility.json:', facilities.length);

// --- Media.json ---
const media = [];
for (let p = 0; p < profiles.length; p++) {
  const urlCount = 2 + (p % 2);
  for (let m = 0; m < urlCount; m++) {
    const url = COVER_MEDIA_URLS[(p * 2 + m) % COVER_MEDIA_URLS.length];
    media.push({
      id: uuid(),
      filePath: url,
      fileType: url.includes('.png') ? 'PNG' : 'JPG',
      profileId: profiles[p].id,
      serviceId: null,
      createdAt: ts(),
      updatedAt: ts(),
    });
  }
}
fs.writeFileSync(path.join(LONDON_DIR, 'Media.json'), JSON.stringify(media, null, 2));
console.log('  Media.json:', media.length);

// --- Service.json ---
const services = [];
for (let p = 0; p < profiles.length; p++) {
  const profileId = profiles[p].id;
  const desc = profiles[p].description;
  const numServices = 4 + (p % 4);
  for (let s = 0; s < numServices; s++) {
    const t = SERVICE_TEMPLATES[s % SERVICE_TEMPLATES.length];
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
fs.writeFileSync(path.join(LONDON_DIR, 'Service.json'), JSON.stringify(services, null, 2));
console.log('  Service.json:', services.length);

// --- Category.json (copy so london/ is self-contained) ---
fs.writeFileSync(path.join(LONDON_DIR, 'Category.json'), JSON.stringify(categories, null, 2));
console.log('  Category.json:', categories.length);

console.log('Done. All tables written to db/london/');

#!/usr/bin/env node
/**
 * Combines db/london and db/new into db/final.
 * Converts Profile to format with oneStarCount, twoStarCount, threeStarCount, fourStarCount, fiveStarCount, eco_score.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = __dirname;
const LONDON_DIR = path.join(DB_DIR, 'london');
const NEW_DIR = path.join(DB_DIR, 'new');
const FINAL_DIR = path.join(DB_DIR, 'final');

function loadJson(dir, file) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function toFinalProfile(p) {
  return {
    id: p.id,
    accor_id: p.accor_id ?? null,
    name: p.name,
    description: p.description ?? null,
    email: p.email ?? null,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    address: p.address ?? null,
    coverMedia: p.coverMedia ?? null,
    source: p.source ?? 'SPACE',
    status: p.status ?? 'PUBLISHED',
    price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,
    fourStarCount: 0,
    fiveStarCount: 0,
    totalReviews: p.totalReviews ?? 0,
    eco_score: 0,
    averageRating: p.averageRating ?? null,
    userId: p.userId,
    createdAt: p.createdAt ?? '13/03/2026 17:46:52',
    updatedAt: p.updatedAt ?? '13/03/2026 17:46:52',
  };
}

if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

console.log('Merging london + new → final...');

// User: from london only (new has no User.json)
const usersLondon = loadJson(LONDON_DIR, 'User.json');
const users = Array.isArray(usersLondon) ? usersLondon : [];
fs.writeFileSync(path.join(FINAL_DIR, 'User.json'), JSON.stringify(users, null, 2));
console.log('  User.json:', users.length);

// Category: from london only
const categoriesLondon = loadJson(LONDON_DIR, 'Category.json');
const categories = Array.isArray(categoriesLondon) ? categoriesLondon : [];
fs.writeFileSync(path.join(FINAL_DIR, 'Category.json'), JSON.stringify(categories, null, 2));
console.log('  Category.json:', categories.length);

// Profile: london + new, convert to final format
const profilesLondon = loadJson(LONDON_DIR, 'Profile.json');
const profilesNew = loadJson(NEW_DIR, 'Profile.json');
const profilesRaw = [
  ...(Array.isArray(profilesLondon) ? profilesLondon : []),
  ...(Array.isArray(profilesNew) ? profilesNew : []),
];
const profiles = profilesRaw.map(toFinalProfile);
fs.writeFileSync(path.join(FINAL_DIR, 'Profile.json'), JSON.stringify(profiles, null, 2));
console.log('  Profile.json:', profiles.length);

// Facility: london + new
const facilitiesLondon = loadJson(LONDON_DIR, 'Facility.json');
const facilitiesNew = loadJson(NEW_DIR, 'Facility.json');
const facilities = [
  ...(Array.isArray(facilitiesLondon) ? facilitiesLondon : []),
  ...(Array.isArray(facilitiesNew) ? facilitiesNew : []),
];
fs.writeFileSync(path.join(FINAL_DIR, 'Facility.json'), JSON.stringify(facilities, null, 2));
console.log('  Facility.json:', facilities.length);

// Media: london + new
const mediaLondon = loadJson(LONDON_DIR, 'Media.json');
const mediaNew = loadJson(NEW_DIR, 'Media.json');
const media = [
  ...(Array.isArray(mediaLondon) ? mediaLondon : []),
  ...(Array.isArray(mediaNew) ? mediaNew : []),
];
fs.writeFileSync(path.join(FINAL_DIR, 'Media.json'), JSON.stringify(media, null, 2));
console.log('  Media.json:', media.length);

// Service: london + new
const servicesLondon = loadJson(LONDON_DIR, 'Service.json');
const servicesNew = loadJson(NEW_DIR, 'Service.json');
const services = [
  ...(Array.isArray(servicesLondon) ? servicesLondon : []),
  ...(Array.isArray(servicesNew) ? servicesNew : []),
];
fs.writeFileSync(path.join(FINAL_DIR, 'Service.json'), JSON.stringify(services, null, 2));
console.log('  Service.json:', services.length);

console.log('Done. Output in db/final/');

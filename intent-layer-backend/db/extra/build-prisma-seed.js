#!/usr/bin/env node
/**
 * Builds prisma-seed.json from Category.json, Profile.json, Service.json, Facility.json, Media.json
 * in this folder. Output: prisma-seed.json (single file consumable by Prisma seed scripts).
 *
 * Usage: node build-prisma-seed.js
 * Then in your backend: load seed/prisma-seed.json and use Prisma to upsert Category, Profile, Facility, Service, Media.
 */

const fs = require("fs");
const path = require("path");

const DIR = __dirname;

function load(name) {
  const file = path.join(DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`Missing ${file}, using []`);
    return [];
  }
  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

const Category = load("Category");
const Profile = load("Profile");
const Service = load("Service");
const Facility = load("Facility");
const Media = load("Media");

const bundle = {
  Category,
  Profile,
  Service,
  Facility,
  Media,
};

const outPath = path.join(DIR, "prisma-seed.json");
fs.writeFileSync(outPath, JSON.stringify(bundle, null, 0), "utf8");
console.log(`Wrote ${outPath}`);
console.log(`  Category: ${Category.length}, Profile: ${Profile.length}, Service: ${Service.length}, Facility: ${Facility.length}, Media: ${Media.length}`);

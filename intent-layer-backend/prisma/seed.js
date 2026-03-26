/**
 * Seed intent-layer DB from allspaces-mockdb-bundle.json.
 * Creates tables if not exist (via prisma db push) and seeds data if empty.
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const SEED_USER_PASSWORD = "seed-password-change-in-prod";

async function loadMockBundle() {
  const path = join(__dirname, "..", "db", "allspaces-mockdb-bundle.json");
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw);
}

async function seed() {
  const bundle = await loadMockBundle();
  const profiles = bundle["Profile.mock.json"] || [];
  const facilities = bundle["Facility.mock.json"] || [];
  const services = bundle["Service.mock.json"] || [];
  const categories = bundle["Category.mock.json"] || [];

  if (profiles.length === 0) {
    console.log("No profiles in mock bundle, skipping seed.");
    return;
  }

  // 1. Check if we already have profiles
  const existingCount = await prisma.profile.count();
  if (existingCount > 0) {
    console.log(`Profiles already exist (${existingCount}), skipping seed.`);
    return;
  }

  // 2. Seed categories first
  const categoryIds = new Set();
  for (const c of categories) {
    const isActive = c.isActive === "t" || c.isActive === true;
    await prisma.category.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        title: c.title || "Unnamed",
        image: c.image,
        mobileImage: c.mobileImage,
        type: c.type || "WORKSPACE",
        orderIndex: c.orderIndex ?? 0,
        isActive,
        parentId: c.parentId || null,
      },
      update: {},
    });
    categoryIds.add(c.id);
  }
  console.log(`Seeded ${categoryIds.size} categories.`);

  // 3. Seed profiles (one User per Profile — userId is unique)
  const profileIds = new Set();
  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i];
    if (p.status !== "PUBLISHED" && p.status !== "INACTIVE") continue;
    const email = `seed-${p.id}@intent-layer.local`;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: SEED_USER_PASSWORD,
          first_name: "Seed",
          last_name: `Vendor ${i + 1}`,
        },
      });
    }
    await prisma.profile.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name || "Unnamed",
        description: p.description,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        coverMedia: p.coverMedia,
        status: p.status || "PUBLISHED",
        price: p.price ?? 0,
        totalReviews: p.totalReviews ?? 0,
        averageRating: p.averageRating ?? 0,
        userId: user.id,
      },
      update: {},
    });
    profileIds.add(p.id);
    if ((i + 1) % 50 === 0)
      console.log(`  Profiles: ${i + 1}/${profiles.length}`);
  }
  console.log(`Seeded ${profileIds.size} profiles.`);

  // 4. Seed facilities
  let facilityCount = 0;
  for (const f of facilities) {
    if (!profileIds.has(f.profileId)) continue;
    try {
      await prisma.facility.upsert({
        where: { id: f.id },
        create: {
          id: f.id,
          name: f.name || "Facility",
          profileId: f.profileId,
        },
        update: {},
      });
      facilityCount++;
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log(`Seeded ${facilityCount} facilities.`);

  // 5. Seed services
  let serviceCount = 0;
  for (const s of services) {
    if (!profileIds.has(s.profileId)) continue;
    if (s.categoryId && !categoryIds.has(s.categoryId)) continue;
    try {
      await prisma.service.upsert({
        where: { id: s.id },
        create: {
          id: s.id,
          name: s.name || "Service",
          description: s.description,
          minSpend: s.minSpend ?? 0,
          categoryId: s.categoryId || null,
          profileId: s.profileId,
        },
        update: {},
      });
      serviceCount++;
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log(`Seeded ${serviceCount} services.`);

  console.log("Seed complete.");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DIR = __dirname;
const BUNDLE_PATH = join(SEED_DIR, "seed.json");

const SEED_USER_PASSWORD = "seed-password-change-me";

function parseDate(s) {
  if (s == null) return new Date();
  if (s instanceof Date) return s;
  const str = String(s).trim();
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/);
  if (m) {
    const [, d, mo, y, h, mi, sec] = m;
    return new Date(+y, +mo - 1, +d, +h, +mi, +sec);
  }
  return new Date(str) || new Date();
}

function loadBundle() {
  const raw = readFileSync(BUNDLE_PATH, "utf8");
  const data = JSON.parse(raw);
  return {
    Category: Array.isArray(data.Category) ? data.Category : [],
    Profile: Array.isArray(data.Profile) ? data.Profile : [],
    Service: Array.isArray(data.Service) ? data.Service : [],
    Facility: Array.isArray(data.Facility) ? data.Facility : [],
    Media: Array.isArray(data.Media) ? data.Media : [],
  };
}

async function run() {
  let pkg;
  try {
    pkg = await import("@prisma/client");
  } catch (e) {
    console.error("Run this script from your backend directory (where @prisma/client is installed):");
    console.error("  cd allspaces-backend && node ../seed/seed-from-json.js");
    process.exit(1);
  }
  const PrismaClient = pkg.PrismaClient ?? pkg.default?.PrismaClient ?? pkg.default;
  const prisma = new PrismaClient();
  const bundle = loadBundle();

  console.log("Seeding from seed.json:");
  console.log(`  Category: ${bundle.Category.length}, Profile: ${bundle.Profile.length}, Facility: ${bundle.Facility.length}, Service: ${bundle.Service.length}, Media: ${bundle.Media.length}`);

  // 1. Categories
  for (const c of bundle.Category) {
    const isActive = c.isActive === "t" || c.isActive === true;
    await prisma.category.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        title: c.title || "Unnamed",
        image: c.image ?? null,
        mobileImage: c.mobileImage ?? null,
        type: c.type || "WORKSPACE",
        orderIndex: c.orderIndex ?? 0,
        isActive,
        parentId: c.parentId ?? null,
      },
      update: {},
    });
  }
  console.log(`  Seeded ${bundle.Category.length} categories.`);

  // 2. Users (ensure every Profile.userId exists)
  const userIds = [...new Set(bundle.Profile.map((p) => p.userId).filter(Boolean))];
  for (const uid of userIds) {
    const existing = await prisma.user.findUnique({ where: { id: uid } });
    if (existing) continue;
    await prisma.user.create({
      data: {
        id: uid,
        email: `seed-${uid}@seed.local`,
        password: SEED_USER_PASSWORD,
        status: "ACTIVE",
        roles: ["VENDOR"],
      },
    });
  }
  console.log(`  Ensured ${userIds.length} users exist.`);

  // 3. Profiles
  const profileIds = new Set();
  for (let i = 0; i < bundle.Profile.length; i++) {
    const p = bundle.Profile[i];
    await prisma.profile.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        accor_id: p.accor_id ?? null,
        name: p.name || "Unnamed",
        description: p.description ?? null,
        email: p.email ?? null,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
        address: p.address ?? null,
        coverMedia: p.coverMedia ?? null,
        source: p.source || "SPACE",
        status: p.status || "PUBLISHED",
        price: p.price ?? 0,
        oneStarCount: p.oneStarCount ?? 0,
        twoStarCount: p.twoStarCount ?? 0,
        threeStarCount: p.threeStarCount ?? 0,
        fourStarCount: p.fourStarCount ?? 0,
        fiveStarCount: p.fiveStarCount ?? 0,
        totalReviews: p.totalReviews ?? 0,
        eco_score: p.eco_score ?? 0,
        averageRating: p.averageRating ?? null,
        userId: p.userId,
        createdAt: parseDate(p.createdAt),
        updatedAt: parseDate(p.updatedAt),
      },
      update: {},
    });
    profileIds.add(p.id);
    if ((i + 1) % 500 === 0) console.log(`    Profiles: ${i + 1}/${bundle.Profile.length}`);
  }
  console.log(`  Seeded ${bundle.Profile.length} profiles.`);

  // 4. Facilities
  let facCount = 0;
  for (const f of bundle.Facility) {
    if (!profileIds.has(f.profileId)) continue;
    try {
      await prisma.facility.upsert({
        where: { id: f.id },
        create: {
          id: f.id,
          name: f.name || "Facility",
          profileId: f.profileId,
          createdAt: parseDate(f.createdAt),
          updatedAt: parseDate(f.updatedAt),
        },
        update: {},
      });
      facCount++;
    } catch (_) {}
  }
  console.log(`  Seeded ${facCount} facilities.`);

  // 5. Services
  let svcCount = 0;
  for (const s of bundle.Service) {
    if (s.profileId && !profileIds.has(s.profileId)) continue;
    try {
      await prisma.service.upsert({
        where: { id: s.id },
        create: {
          id: s.id,
          name: s.name || "Service",
          description: s.description ?? null,
          minSpend: s.minSpend ?? 0,
          categoryId: s.categoryId ?? null,
          profileId: s.profileId ?? null,
          createdAt: parseDate(s.createdAt),
          updatedAt: parseDate(s.updatedAt),
        },
        update: {},
      });
      svcCount++;
    } catch (_) {}
  }
  console.log(`  Seeded ${svcCount} services.`);

  // 6. Media (if model exists)
  let mediaCount = 0;
  if (typeof prisma.media !== "undefined") {
    const allowedFileTypes = ["JPG", "PNG", "SVG", "MP4"];
    for (const m of bundle.Media) {
      try {
        const fileType = allowedFileTypes.includes(String(m.fileType).toUpperCase()) ? String(m.fileType).toUpperCase() : "JPG";
        await prisma.media.upsert({
          where: { id: m.id },
          create: {
            id: m.id,
            filePath: m.filePath || "",
            fileType,
            profileId: m.profileId ?? null,
            serviceId: m.serviceId ?? null,
            createdAt: parseDate(m.createdAt),
            updatedAt: parseDate(m.updatedAt),
          },
          update: {},
        });
        mediaCount++;
      } catch (_) {}
    }
    console.log(`  Seeded ${mediaCount} media.`);
  } else {
    console.log("  Media model not in schema, skipping.");
  }

  console.log("Seed from JSON complete.");
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

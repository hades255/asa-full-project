import pkg from "@prisma/client";
const { PrismaClient, CategoryType } = pkg;
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Hash password utility function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

async function main() {
  console.log("Seeding database...");

  // Fetch all users to assign bookings to random users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("No users found! Create users before running the seed.");
    return;
  }

  const currentDate = new Date();
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  for (let i = 0; i < 10; i++) {
    // Create a Booking
    const booking = await prisma.booking.create({
      data: {
        // userId: "e7ab5b72-0947-48eb-84af-57d46b3022e7",
        userId: "6b10eb6d-49ae-4e7d-b568-4b65b1549527",
        check_in: faker.date.future(),
        time: faker.date.future(),
        total_hours: faker.number.float({ min: 1, max: 12, precision: 0.1 }),
        status: faker.helpers.arrayElement([
          "PENDING",
          "APPROVED",
          "CANCELLED",
          "COMPLETED",
        ]),
        spend: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
        created_at: faker.date.between({ from: currentDate, to: endOfWeek }),
      },
    });

    // Update booking with payment information
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        amount: faker.number.float({ min: 20, max: 500, precision: 0.01 }),
        payment_status: faker.helpers.arrayElement([
          "PENDING",
          "FAILED",
          "COMPLETED",
        ]),
      },
    });
  }

  console.log("Seeding complete!");
}

async function updatePricesForAllProfiles() {
  const profiles = await prisma.profile.findMany();

  // Update all profiles with random prices
  await Promise.all(
    profiles.map((profile) => {
      const randomPrice = Math.floor(Math.random() * 76) + 50; // Generates 50-125
      return prisma.profile.update({
        where: { id: profile.id },
        data: { price: randomPrice },
      });
    })
  );
}

/**
 * Seeds the duration options for sleep services
 */
async function seedServiceDurations() {
  console.log("Seeding service durations...");

  const durations = [
    { label: "full_day", multiplier: 1.0, unit: "day" },
    { label: "half_day", multiplier: 0.5, unit: "day" },
    { label: "quarter_day", multiplier: 0.25, unit: "day" },
    { label: "hourly", multiplier: 0.1, unit: "hour" },
  ];

  // Check for existing durations to avoid duplicates
  const existingDurations = await prisma.serviceDuration.findMany({
    select: { label: true },
  });
  const existingDurationLabels = existingDurations.map((d) => d.label);

  for (const duration of durations) {
    if (existingDurationLabels.includes(duration.label)) {
      console.log(`Skipping existing duration: ${duration.label}`);
      continue;
    }

    try {
      const createdDuration = await prisma.serviceDuration.create({
        data: duration,
      });
      console.log(
        `Created duration: ${createdDuration.label} (${createdDuration.multiplier})`
      );
    } catch (error) {
      console.error(`Error creating duration ${duration.label}:`, error);
    }
  }

  console.log("Service duration seeding complete!");
}

const preferencesDataSeed = async () => {
  const data = [
    {
      name: "Space Type",
      options: [
        { name: "Office", group: "Work" },
        { name: "Coworking", group: "Work" },
        { name: "Meeting Room", group: "Work" },
        { name: "Short-term Rental", group: "Living" },
        { name: "Apartment", group: "Living" },
        { name: "Hotel", group: "Leisure" },
        { name: "Gym", group: "Leisure" },
        { name: "Wellness Center", group: "Leisure" },
        { name: "Restaurant", group: "Leisure" },
      ],
    },
    {
      name: "Space Quality",
      options: [
        { name: "3 Stars", group: "Stars" },
        { name: "4 Stars", group: "Stars" },
        { name: "5 Stars", group: "Stars" },
        { name: "Economy", group: "Budget/Luxury" },
        { name: "Premium", group: "Budget/Luxury" },
      ],
    },
    {
      name: "Amenities",
      options: [
        { name: "Wi-Fi Speed", group: "Work" },
        { name: "Power Outlets", group: "Work" },
        { name: "Meeting Rooms", group: "Work" },
        { name: "Pool", group: "Leisure" },
        { name: "Gym", group: "Leisure" },
        { name: "Pet-Friendly", group: "Leisure" },
        { name: "Food Options", group: "Leisure" },
        { name: "Furnished", group: "Living" },
        { name: "Kitchen", group: "Living" },
        { name: "Security", group: "Living" },
        { name: "Accessibility", group: "Living" },
      ],
    },
    {
      name: "Dietary Preferences",
      options: [
        { name: "Vegetarian", group: "Food" },
        { name: "Vegan", group: "Food" },
        { name: "Gluten-Free", group: "Food" },
        { name: "Halal", group: "Food" },
        { name: "Kosher", group: "Food" },
        { name: "Nut-Free", group: "Allergies" },
        { name: "Dairy-Free", group: "Allergies" },
      ],
    },
    {
      name: "Brand Preferences",
      options: [
        { name: "Hilton", group: "Hotels/Restaurants" },
        { name: "Starbucks", group: "Hotels/Restaurants" },
        { name: "Uber", group: "Transportation" },
        { name: "Lyft", group: "Transportation" },
      ],
    },
    {
      name: "Additional Preferences",
      options: [
        { name: "Smoking", group: "Smoking" },
        { name: "Non-Smoking", group: "Smoking" },
        { name: "Pet-Friendly", group: "Pets" },
        { name: "No Pets", group: "Pets" },
        { name: "Urban", group: "Location" },
        { name: "Suburban", group: "Location" },
        { name: "Waterfront", group: "Location" },
      ],
    },
  ];

  for (const category of data) {
    // 1. Check if the category already exists
    let categoryRecord = await prisma.preferenceCategory.findUnique({
      where: { name: category.name },
    });

    // 2. If not, create it
    if (!categoryRecord) {
      categoryRecord = await prisma.preferenceCategory.create({
        data: { name: category.name },
      });
    }

    // 3. Now handle each option
    for (const option of category.options) {
      const existingOption = await prisma.preferenceOption.findFirst({
        where: {
          name: option.name,
          group: option.group,
          categoryId: categoryRecord.id,
        },
      });

      if (!existingOption) {
        await prisma.preferenceOption.create({
          data: {
            name: option.name,
            group: option.group,
            categoryId: categoryRecord.id,
          },
        });
      }
    }
  }

  console.log("✅ Preferences seeded");
};

/**
 * Seeds categories with their proper types
 * This creates categories for each CategoryType in the schema
 * and adds subcategories with proper parent-child relationships
 */
async function seedCategories() {
  console.log("Seeding categories...");

  // Main categories with images
  const mainCategories = [
    {
      title: "Workspace",
      type: CategoryType.WORKSPACE,
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/workspaceIcon.svg",
    },
    {
      title: "Dining Services",
      type: CategoryType.DINING,
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/diningServicesIcon.svg",
    },
    {
      title: "Relax & Leisure",
      type: CategoryType.RELAXATION,
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/relaxLeisureIcon.svg",
    },
    {
      title: "Beach Club",
      type: CategoryType.BEACH_CLUB,
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/beach-club/beachClubIcon.svg",
    },
    {
      title: "Sleep Facilities",
      type: CategoryType.SLEEP,
      orderIndex: 5,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/sleep-facilities/sleepFacilitiesIcon.svg",
    },
    {
      title: "Travel",
      type: CategoryType.TRAVEL,
      orderIndex: 6,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/travel/travelIcon.svg",
    },
    {
      title: "Policies",
      type: CategoryType.POLICIES,
      orderIndex: 7,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/policies/policiesIcon.svg",
    },
    {
      title: "Special Offers",
      type: CategoryType.SPECIAL_OFFERS,
      orderIndex: 8,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/specialOffersIcon.svg",
    },
  ];

  // Define subcategories with their parent titles and images
  const subcategories = [
    // Workspace subcategories
    {
      title: "Lobby Workspace",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/lobby-workspace/lobbyIcon.svg",
    },
    {
      title: "Business Room",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/business-room/businessIcon.svg",
    },
    {
      title: "Conference Room",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/conference-room/conferenceIcon.svg",
    },
    {
      title: "Board Room",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/board-room/boardIcon.svg",
    },
    {
      title: "IT Facilities",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 5,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/workspace/it-facilities/ITIcon.svg",
    },
    {
      title: "Other",
      type: CategoryType.WORKSPACE,
      parentTitle: "Workspace",
      orderIndex: 6,
      image: "",
    },

    // Dining Services subcategories
    {
      title: "Breakfast",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/breakfast/breakfastIcon.svg",
    },
    {
      title: "Lunch",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/lunch/lunchIcon.svg",
    },
    {
      title: "Dinner",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/dinner/dinnerIcon.svg",
    },
    {
      title: "Coffee / Tea",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/coffee-tea/coffeeTeaIcon.svg",
    },
    {
      title: "Champagne",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 5,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/dining-services/champagne/champagneIcon.svg",
    },
    {
      title: "Other",
      type: CategoryType.DINING,
      parentTitle: "Dining Services",
      orderIndex: 6,
      image: "",
    },

    // Relax & Leisure subcategories
    {
      title: "Spa",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/spa/spaIcon.svg",
    },
    {
      title: "Massage",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/massage/massasgeIcon.svg",
    },
    {
      title: "Gym",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/gym/gymIcon.svg",
    },
    {
      title: "Swimming",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/swimming/swimmingIcon.svg",
    },
    {
      title: "Yoga",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 5,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/yoga/yoga.svg",
    },
    {
      title: "Pilates",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 6,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/pilates/pilatesIcon.svg",
    },
    {
      title: "Classes",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 7,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/relax-leisure/classes/classes.svg",
    },
    {
      title: "Other",
      type: CategoryType.RELAXATION,
      parentTitle: "Relax & Leisure",
      orderIndex: 8,
      image: "",
    },

    // Beach Club subcategories
    {
      title: "Beach Bed",
      type: CategoryType.BEACH_CLUB,
      parentTitle: "Beach Club",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/beach-club/beach-bed/beachBedIcon.svg",
    },
    {
      title: "Dining Options",
      type: CategoryType.BEACH_CLUB,
      parentTitle: "Beach Club",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/beach-club/dining-options/diningOptionsIcon.svg",
    },
    {
      title: "Champagne",
      type: CategoryType.BEACH_CLUB,
      parentTitle: "Beach Club",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/beach-club/champagne/champagneIcon.svg",
    },
    {
      title: "Coffee / Tea",
      type: CategoryType.BEACH_CLUB,
      parentTitle: "Beach Club",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/beach-club/coffee-tea/coffeeTeaIcon.svg",
    },

    // Sleep Facilities subcategories
    {
      title: "Room (Full Day)",
      type: CategoryType.SLEEP,
      parentTitle: "Sleep Facilities",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/sleep-facilities/room/roomIcon.svg",
    },
    {
      title: "Half Day",
      type: CategoryType.SLEEP,
      parentTitle: "Sleep Facilities",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/sleep-facilities/half-day/halfDayIcon.svg",
    },
    {
      title: "Hourly (min. 4 hrs)",
      type: CategoryType.SLEEP,
      parentTitle: "Sleep Facilities",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/sleep-facilities/hourly/hourlyIcon.svg",
    },

    // Travel subcategories
    {
      title: "Uber",
      type: CategoryType.TRAVEL,
      parentTitle: "Travel",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/travel/uber/uberIcon.svg",
    },
    {
      title: "Taxi",
      type: CategoryType.TRAVEL,
      parentTitle: "Travel",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/travel/taxi/taxiIcon.svg",
    },
    {
      title: "Bike",
      type: CategoryType.TRAVEL,
      parentTitle: "Travel",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/travel/bike/bikeIcon.svg",
    },
    {
      title: "Flight",
      type: CategoryType.TRAVEL,
      parentTitle: "Travel",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/travel/flight/flightIcon.svg",
    },

    // Policies subcategories
    {
      title: "Non-Smoking",
      type: CategoryType.POLICIES,
      parentTitle: "Policies",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/policies/no-smoking/noSmokingIcon.svg",
    },
    {
      title: "Smoking",
      type: CategoryType.POLICIES,
      parentTitle: "Policies",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/policies/smoking/smokingIcon.svg",
    },
    {
      title: "Modest Dress",
      type: CategoryType.POLICIES,
      parentTitle: "Policies",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/policies/modest-dress/modestDress.svg",
    },

    // Special Offers subcategories
    {
      title: "Free Coffee",
      type: CategoryType.SPECIAL_OFFERS,
      parentTitle: "Special Offers",
      orderIndex: 1,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/free-coffee/coffeeTeaIcon.svg",
    },
    {
      title: "Complimentary Champagne",
      type: CategoryType.SPECIAL_OFFERS,
      parentTitle: "Special Offers",
      orderIndex: 2,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/complimentary-champagne/champagneIcon.svg",
    },
    {
      title: "Service Discounts",
      type: CategoryType.SPECIAL_OFFERS,
      parentTitle: "Special Offers",
      orderIndex: 3,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/service-discounts/serviceDiscountsIcon.svg",
    },
    {
      title: "Loyalty Points",
      type: CategoryType.SPECIAL_OFFERS,
      parentTitle: "Special Offers",
      orderIndex: 4,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/loyalty-points/loyaltyPointsIcon.svg",
    },
    {
      title: "Welcome Gift",
      type: CategoryType.SPECIAL_OFFERS,
      parentTitle: "Special Offers",
      orderIndex: 5,
      image:
        "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/service-preferences/special-offers/welcome-gift/welcomeGiftIcon.svg",
    },
  ];

  // Get existing categories to avoid duplicates
  const existingCategories = await prisma.category.findMany({
    select: { id: true, title: true },
  });
  const existingTitles = existingCategories.map((c) => c.title);
  const categoryMap = existingCategories.reduce((acc, cat) => {
    acc[cat.title] = cat.id;
    return acc;
  }, {});

  let createdMainCount = 0;
  let createdSubCount = 0;
  let skippedCount = 0;

  // First, create or update main categories
  for (const category of mainCategories) {
    if (existingTitles.includes(category.title)) {
      console.log(`Skipping existing main category: ${category.title}`);
      skippedCount++;
      continue;
    }

    try {
      const createdCategory = await prisma.category.create({
        data: {
          title: category.title,
          type: category.type,
          orderIndex: category.orderIndex,
          image: category.image,
          parentId: null, // Explicitly set parentId to null for main categories
        },
      });

      // Add to our map for subcategory references
      categoryMap[category.title] = createdCategory.id;

      console.log(`Created main category: ${category.title}`);
      createdMainCount++;
    } catch (error) {
      console.error(`Error creating main category ${category.title}:`, error);
    }
  }

  // Then create subcategories with references to their parents
  for (const subcategory of subcategories) {
    if (existingTitles.includes(subcategory.title)) {
      console.log(`Skipping existing subcategory: ${subcategory.title}`);
      skippedCount++;
      continue;
    }

    // Check if parent exists
    const parentId = categoryMap[subcategory.parentTitle];
    if (!parentId) {
      console.log(
        `Skipping subcategory ${subcategory.title} - parent not found: ${subcategory.parentTitle}`
      );
      continue;
    }

    try {
      await prisma.category.create({
        data: {
          title: subcategory.title,
          type: subcategory.type,
          orderIndex: subcategory.orderIndex,
          image: subcategory.image,
          parentId: parentId, // Set the parent relationship
        },
      });

      console.log(
        `Created subcategory: ${subcategory.title} (parent: ${subcategory.parentTitle})`
      );
      createdSubCount++;
    } catch (error) {
      console.error(`Error creating subcategory ${subcategory.title}:`, error);
    }
  }

  console.log(
    `Categories seeding complete! Created main: ${createdMainCount}, Created sub: ${createdSubCount}, Skipped: ${skippedCount}`
  );
  return {
    createdMain: createdMainCount,
    createdSub: createdSubCount,
    skipped: skippedCount,
  };
}

/**
 * Creates dummy profile data with all related records
 * Modified to create users based on count parameter
 */
async function seedDummyProfiles(count = 1) {
  console.log(`Seeding ${count} dummy profiles with related data...`);

  // Get only subcategories (categories that have a parentId - not null)
  const subcategories = await prisma.category.findMany({
    where: {
      parentId: {
        not: null,
      },
    },
  });

  if (subcategories.length === 0) {
    console.log("No subcategories found. Please run seedCategories first.");
    return;
  }

  console.log(
    `Found ${subcategories.length} subcategories to use for profiles.`
  );

  // Create users and profiles based on count
  for (let i = 0; i < count; i++) {
    try {
      // 1. Create a user with VENDOR role, confirmed_at as new date, and encrypted password
      const hashedPassword = await hashPassword("1234");
      const user = await prisma.user.create({
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          password: hashedPassword,
          phone: faker.phone.number(),
          roles: ["VENDOR"],
          status: "ACTIVE",
          confirmed_at: new Date(),
        },
      });

      console.log(
        `Created user ${i + 1}: ${user.first_name} ${
          user.last_name
        } with VENDOR role`
      );

      // Select a random subcategory for this user
      const subcategory =
        subcategories[Math.floor(Math.random() * subcategories.length)];

      // 3. Create a profile with status PUBLISHED and all fields
      const profile = await prisma.profile.create({
        data: {
          name: faker.company.name(),
          description: faker.lorem.paragraph(),
          email: faker.internet.email(),
          status: "PUBLISHED", // Set status to PUBLISHED as required
          price: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
          // eco_score: faker.number.int({ min: 0, max: 100 }),
          averageRating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
          oneStarCount: faker.number.int({ min: 0, max: 10 }),
          twoStarCount: faker.number.int({ min: 0, max: 10 }),
          threeStarCount: faker.number.int({ min: 0, max: 20 }),
          fourStarCount: faker.number.int({ min: 0, max: 30 }),
          fiveStarCount: faker.number.int({ min: 0, max: 50 }),
          totalReviews: faker.number.int({ min: 0, max: 100 }),
          coverMedia: faker.image.url(),
          userId: user.id,
          address:
            faker.location.streetAddress() +
            ", " +
            faker.location.city() +
            ", " +
            faker.location.country(),
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
      });

      console.log(
        `Created profile: ${profile.name} with subcategory: ${subcategory.title}`
      );

      // 4. Create facilities for this profile
      const facilityNames = [
        "Wi-Fi",
        "Projector",
        "Catering",
        "Air Conditioning",
        "Parking",
        "Wheelchair Access",
        "Coffee Machine",
        "Printer",
        "Whiteboard",
        "TV Screen",
        "Video Conferencing",
        "Kitchen",
      ];

      const facilities = [];
      const facilityCount = faker.number.int({ min: 1, max: 3 });

      for (let j = 0; j < facilityCount; j++) {
        const facility = await prisma.facility.create({
          data: {
            name: faker.helpers.arrayElement(facilityNames),
            profileId: profile.id,
          },
        });

        facilities.push(facility);
      }

      console.log(
        `Created ${facilities.length} facilities for profile ${profile.name}`
      );

      // 5. Create services for this profile using subcategories
      const serviceBaseNames = [
        "Meeting Room Rental",
        "Conference Space",
        "Office Space",
        "Coworking Desk",
        "Event Space",
        "Catering Service",
        "IT Support",
        "Printing Service",
        "Virtual Office",
      ];

      const services = [];
      const serviceCount = faker.number.int({ min: 1, max: 3 });

      // Create unique services for this profile using subcategories
      for (let s = 0; s < serviceCount; s++) {
        // Use different subcategories for the services
        const randomSubcategory =
          subcategories[Math.floor(Math.random() * subcategories.length)];

        // Create a unique service name
        const baseServiceName = serviceBaseNames[s % serviceBaseNames.length];
        const uniqueServiceName = `${baseServiceName} - ${profile.name.substring(
          0,
          15
        )} (${faker.string.alphanumeric(4)})`;

        // Create the service with profileId and minSpend
        const service = await prisma.service.create({
          data: {
            name: uniqueServiceName,
            description: faker.lorem.sentence(),
            categoryId: randomSubcategory.id, // Using subcategory (parentId not null)
            profileId: profile.id,
            minSpend: faker.number.float({
              min: 10,
              max: 200,
              precision: 0.01,
            }),
          },
        });

        services.push(service);

        // Create media for the service
        await prisma.media.create({
          data: {
            filePath: faker.image.url(),
            fileType: faker.helpers.arrayElement(["JPG", "PNG", "SVG"]),
            serviceId: service.id,
          },
        });
      }

      console.log(
        `Created ${services.length} services for profile ${profile.name}`
      );

      // Create media items for this profile
      const mediaCount = faker.number.int({ min: 1, max: 3 });
      const mediaItems = [];

      for (let m = 0; m < mediaCount; m++) {
        const media = await prisma.media.create({
          data: {
            filePath: faker.image.url(),
            fileType: faker.helpers.arrayElement(["JPG", "PNG", "SVG"]),
            profileId: profile.id,
          },
        });

        mediaItems.push(media);
      }

      console.log(
        `Created ${mediaItems.length} media items for profile ${profile.name}`
      );

      // 6. Create bookings and reviews for this profile
      const bookingCount = faker.number.int({ min: 1, max: 5 }); // 1-5 bookings per profile
      const bookings = [];

      // Review comments array
      const reviewComments = [
        "Excellent service and very professional staff!",
        "Great experience, highly recommended.",
        "The space was clean and well-maintained.",
        "Perfect for our meeting needs.",
        "Very convenient location and good amenities.",
        "Staff was friendly and helpful throughout.",
        "Good value for money, will book again.",
        "The facilities exceeded our expectations.",
        "Smooth booking process and great communication.",
        "Highly satisfied with the overall experience.",
        "The space was exactly as described.",
        "Professional setup and good customer service.",
        "Would definitely recommend to others.",
        "Clean, modern, and well-equipped space.",
        "Great atmosphere and perfect for our needs.",
      ];

      // Create a new user with USER role for bookings and reviews
      const userHashedPassword = await hashPassword("1234");
      const userWithUserRole = await prisma.user.create({
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          password: userHashedPassword,
          phone: faker.phone.number(),
          roles: ["USER"],
          status: "ACTIVE",
          confirmed_at: new Date(),
        },
      });

      const bookingUser = {
        id: userWithUserRole.id,
        first_name: userWithUserRole.first_name,
        last_name: userWithUserRole.last_name,
      };

      console.log(
        `Created USER for bookings: ${bookingUser.first_name} ${bookingUser.last_name}`
      );

      for (let b = 0; b < bookingCount; b++) {
        // Use the USER for this booking

        // Create booking
        const booking = await prisma.booking.create({
          data: {
            userId: bookingUser.id,
            profileId: profile.id,
            check_in: faker.date.past(),
            status: "COMPLETED", // Only completed bookings should have reviews
            spend: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
            no_of_guests: faker.number.int({ min: 1, max: 10 }),
            isReviewed: false, // Will be set to true when review is created
            created_at: faker.date.past(),
          },
        });

        bookings.push(booking);

        // Create one review for this booking
        const review = await prisma.review.create({
          data: {
            userId: bookingUser.id,
            profileId: profile.id,
            bookingId: booking.id,
            rating: faker.number.int({ min: 1, max: 5 }),
            comment: faker.helpers.arrayElement(reviewComments),
          },
        });

        // Update the booking to mark it as reviewed
        await prisma.booking.update({
          where: { id: booking.id },
          data: { isReviewed: true },
        });

        console.log(
          `Created booking and review: ${bookingUser.first_name} ${bookingUser.last_name} rated ${profile.name} with ${review.rating} stars`
        );
      }

      console.log(
        `Created ${bookings.length} bookings with reviews for profile ${profile.name}`
      );

      // 7. Update profile ratings after creating reviews
      const profileReviews = await prisma.review.findMany({
        where: { profileId: profile.id },
        select: { rating: true },
      });

      if (profileReviews.length > 0) {
        // Count reviews by star rating
        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;
        let validReviewCount = 0;

        profileReviews.forEach((review) => {
          if (review.rating > 0) {
            totalRating += review.rating;
            validReviewCount++;
            if (review.rating >= 1 && review.rating <= 5) {
              starCounts[review.rating]++;
            }
          }
        });

        const averageRating =
          validReviewCount > 0
            ? Number((totalRating / validReviewCount).toFixed(1))
            : 0;

        // Update the profile with new rating data
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            averageRating,
            totalReviews: profileReviews.length,
            oneStarCount: starCounts[1],
            twoStarCount: starCounts[2],
            threeStarCount: starCounts[3],
            fourStarCount: starCounts[4],
            fiveStarCount: starCounts[5],
          },
        });

        console.log(
          `Updated rating for ${profile.name}: ${averageRating} (${validReviewCount} reviews)`
        );
      }

      console.log(
        `✅ Successfully created user ${i + 1} with profile and related data`
      );
      console.log(`User: ${user.first_name} ${user.last_name} (${user.email})`);
      console.log(`Profile: ${profile.name}`);
      console.log(`Password: 1234 (encrypted)`);
      console.log(`Category: ${subcategory.title} (subcategory)`);
    } catch (error) {
      console.error(`Error creating dummy profile ${i + 1}:`, error);
    }
  }

  console.log(
    `✅ Successfully seeded ${count} dummy profiles with related data`
  );
}

/**
 * Seeds FAQ data with common questions and answers
 */
async function seedFAQs() {
  console.log("Seeding FAQs...");

  const faqData = [
    {
      question: "What is Spaces Backend?",
      answer:
        "Spaces Backend is a comprehensive platform that connects users with various spaces and services including workspaces, relaxation services, leisure activities, dining options, sleep accommodations, and travel services. It provides a seamless booking experience for both users and vendors.",
    },
    {
      question: "How do I book a space or service?",
      answer:
        "To book a space or service, simply browse through our available options, select your preferred space/service, choose your desired date and time, and complete the booking process. You can filter by category, location, price range, and other preferences to find exactly what you need.",
    },
    {
      question: "What types of spaces are available?",
      answer:
        "We offer a wide variety of spaces including meeting rooms, conference rooms, business rooms, event spaces, coworking areas, and more. Each space comes with different amenities and pricing options to suit your specific needs.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking depending on the cancellation policy of the specific space or service. Please check the terms and conditions before making a booking. Most bookings can be cancelled up to 24 hours before the scheduled time.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including credit cards, debit cards, and digital wallets. All payments are processed securely through our payment gateway to ensure your financial information is protected.",
    },
    {
      question: "How do I become a vendor on the platform?",
      answer:
        "To become a vendor, you need to create an account and complete your profile with details about your spaces or services. Our team will review your application and approve it if it meets our quality standards. Once approved, you can start listing your offerings.",
    },
    {
      question: "What is the eco-score feature?",
      answer:
        "The eco-score is a rating system that indicates how environmentally friendly a space or service is. It takes into account factors like energy efficiency, use of sustainable materials, waste management practices, and other green initiatives. Higher eco-scores indicate more environmentally conscious options.",
    },
    {
      question: "How are reviews and ratings calculated?",
      answer:
        "Reviews and ratings are based on feedback from users who have actually used the spaces or services. The average rating is calculated from all reviews, and we also track the distribution of star ratings (1-5 stars) to give you a comprehensive view of user satisfaction.",
    },
    {
      question: "What if I have a problem with my booking?",
      answer:
        "If you encounter any issues with your booking, please contact our customer support team immediately. We have a dedicated support system to handle complaints, resolve disputes, and ensure you have a positive experience with our platform.",
    },
    {
      question: "Are there any membership or subscription fees?",
      answer:
        "Currently, we don't charge any membership or subscription fees for users. You only pay for the spaces or services you book. However, vendors may have different fee structures for listing their services on our platform.",
    },
    {
      question: "How do I save my favorite spaces?",
      answer:
        "You can add spaces to your wishlist by clicking the heart icon on any space listing. This allows you to easily find and book your favorite spaces later. You can manage your wishlist from your user dashboard.",
    },
    {
      question: "What amenities are typically included?",
      answer:
        "Common amenities include Wi-Fi, power outlets, air conditioning, parking, and basic office supplies. However, amenities vary by space, so please check the specific listing for detailed information about what's included with your booking.",
    },
    {
      question: "Can I book for multiple people?",
      answer:
        "Yes, you can specify the number of guests when making a booking. Many spaces accommodate multiple people, and the pricing may vary based on the number of guests. Please check the capacity limits for each space before booking.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 24-48 hours in advance to ensure availability, especially for popular spaces or during peak times. However, some spaces may be available for same-day bookings depending on availability.",
    },
    {
      question:
        "What is the difference between workspace and leisure services?",
      answer:
        "Workspace services are designed for professional activities like meetings, conferences, and focused work. Leisure services include relaxation activities like spa treatments, fitness classes, and recreational facilities. Both categories serve different purposes and have different pricing structures.",
    },
  ];

  // Check for existing FAQs to avoid duplicates
  const existingFAQs = await prisma.fAQ.findMany({
    select: { question: true },
  });
  const existingQuestions = existingFAQs.map((faq) => faq.question);

  let createdCount = 0;
  let skippedCount = 0;

  for (const faq of faqData) {
    if (existingQuestions.includes(faq.question)) {
      console.log(`Skipping existing FAQ: ${faq.question.substring(0, 50)}...`);
      skippedCount++;
      continue;
    }

    try {
      const createdFAQ = await prisma.fAQ.create({
        data: faq,
      });
      console.log(`Created FAQ: ${createdFAQ.question.substring(0, 50)}...`);
      createdCount++;
    } catch (error) {
      console.error(
        `Error creating FAQ "${faq.question.substring(0, 50)}...":`,
        error
      );
    }
  }

  console.log(
    `FAQ seeding complete! Created: ${createdCount}, Skipped: ${skippedCount}`
  );
  return {
    created: createdCount,
    skipped: skippedCount,
  };
}

/**
 * Seeds preference data with all the required preferences
 */
async function seedPreferences() {
  console.log("Seeding preferences...");

  // Main preference categories
  const mainPreferenceCategories = [
    {
      title: "Space Quality Level",
      icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/icon.svg",
      orderIndex: 1,
      subPreferences: [
        {
          title: "Budget",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 1,
        },
        {
          title: "Basic",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 2,
        },
        {
          title: "Standard",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 3,
        },
        {
          title: "Stylish",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 4,
        },
        {
          title: "Premium",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 5,
        },
        {
          title: "Luxury",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/comfort/star/icon.svg",
          orderIndex: 6,
        },
      ],
    },
    {
      title: "Amenities",
      icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/icon.svg",
      orderIndex: 2,
      subPreferences: [
        {
          title: "WiFi",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/wifi/icon.svg",
          orderIndex: 1,
        },
        {
          title: "Projector",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/projector/icon.svg",
          orderIndex: 2,
        },
        {
          title: "Video Calls",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/video-calls/icon.svg",
          orderIndex: 3,
        },
        {
          title: "Printing",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/printing/icon.svg",
          orderIndex: 4,
        },
        {
          title: "Scanning",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/amenities/scanning/icon.svg",
          orderIndex: 5,
        },
      ],
    },
    {
      title: "Smoking Preference",
      icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/smoking-preference/icon.svg",
      orderIndex: 3,
      subPreferences: [
        {
          title: "Smoking",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/smoking-preference/smoking/icon.svg",
          orderIndex: 1,
        },
        {
          title: "Non-Smoking",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/smoking-preference/no-smoking/icon.svg",
          orderIndex: 2,
        },
        {
          title: "Don't Mind",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/smoking-preference/dont-mind/icon.svg",
          orderIndex: 3,
        },
      ],
    },
    {
      title: "Dietary Preferences",
      icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/icon.svg",
      orderIndex: 4,
      subPreferences: [
        {
          title: "Vegan",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/vegan/icon.svg",
          orderIndex: 1,
        },
        {
          title: "Vegetarian",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/vegetarian/icon.svg",
          orderIndex: 2,
        },
        {
          title: "Halal",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/halal/icon.svg",
          orderIndex: 3,
        },
        {
          title: "Gluten-Free",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/gluten-free/icon.svg",
          orderIndex: 4,
        },
        {
          title: "Nut-Free",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/no-preferences/icon.svg",
          orderIndex: 5,
        },
        {
          title: "No Preference",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/dietery-preferences/no-preferences/icon.svg",
          orderIndex: 6,
        },
      ],
    },
    {
      title: "Accessibility & Extras",
      icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/accessiblity-extras/icon.svg",
      orderIndex: 5,
      subPreferences: [
        {
          title: "Wheelchair Access",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/accessiblity-extras/wheelchair/icon.svg",
          orderIndex: 1,
        },
        {
          title: "Family-Friendly",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/accessiblity-extras/family/icon.svg",
          orderIndex: 2,
        },
        {
          title: "Pet-Friendly",
          icon: "https://allspaces-testing.s3.eu-north-1.amazonaws.com/development/development/preferences-icons/accessiblity-extras/pets/icon.svg",
          orderIndex: 3,
        },
      ],
    },
  ];

  // Check for existing preferences to avoid duplicates
  const existingPreferences = await prisma.preference.findMany({
    select: { title: true },
  });
  const existingPreferenceTitles = existingPreferences.map((p) => p.title);

  let createdMainCount = 0;
  let createdSubCount = 0;
  let skippedCount = 0;

  // Create main preference categories first
  for (const mainCategory of mainPreferenceCategories) {
    if (existingPreferenceTitles.includes(mainCategory.title)) {
      console.log(`Skipping existing main preference: ${mainCategory.title}`);
      skippedCount++;
      continue;
    }

    try {
      const createdMainPreference = await prisma.preference.create({
        data: {
          title: mainCategory.title,
          icon: mainCategory.icon,
          orderIndex: mainCategory.orderIndex,
          parentId: null, // Main categories have no parent
        },
      });

      console.log(
        `Created main preference: ${createdMainPreference.title} (${createdMainPreference.icon})`
      );
      createdMainCount++;

      // Now create sub-preferences for this main category
      for (const subPreference of mainCategory.subPreferences) {
        if (existingPreferenceTitles.includes(subPreference.title)) {
          console.log(
            `Skipping existing sub-preference: ${subPreference.title}`
          );
          skippedCount++;
          continue;
        }

        try {
          const createdSubPreference = await prisma.preference.create({
            data: {
              title: subPreference.title,
              icon: subPreference.icon,
              orderIndex: subPreference.orderIndex,
              parentId: createdMainPreference.id, // Reference to parent
            },
          });

          console.log(
            `Created sub-preference: ${createdSubPreference.title} (${createdSubPreference.icon}) under ${mainCategory.title}`
          );
          createdSubCount++;
        } catch (error) {
          console.error(
            `Error creating sub-preference ${subPreference.title}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error(
        `Error creating main preference ${mainCategory.title}:`,
        error
      );
    }
  }

  console.log(
    `Preferences seeding complete! Created main: ${createdMainCount}, Created sub: ${createdSubCount}, Skipped: ${skippedCount}`
  );
  return {
    createdMain: createdMainCount,
    createdSub: createdSubCount,
    skipped: skippedCount,
  };
}

/**
 * Seeds sample user preferences for existing users
 */
async function seedUserPreferences() {
  console.log("Seeding user preferences...");

  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true, first_name: true, last_name: true },
  });

  if (users.length === 0) {
    console.log("No users found to assign preferences to.");
    return;
  }

  // Get all preferences
  const preferences = await prisma.preference.findMany({
    select: { id: true, title: true },
  });

  if (preferences.length === 0) {
    console.log("No preferences found. Please run seedPreferences first.");
    return;
  }

  let createdCount = 0;
  let skippedCount = 0;

  // For each user, assign one random preference
  for (const user of users) {
    // Check if user already has a preference
    const existingUserPreference = await prisma.userPreference.findUnique({
      where: { userId: user.id },
    });

    if (existingUserPreference) {
      console.log(
        `User ${user.first_name} ${user.last_name} already has a preference.`
      );
      skippedCount++;
      continue;
    }

    // Select one random preference for this user
    const randomPreference =
      preferences[Math.floor(Math.random() * preferences.length)];

    try {
      await prisma.userPreference.create({
        data: {
          userId: user.id,
          preferenceId: randomPreference.id,
        },
      });
      createdCount++;
      console.log(
        `Assigned preference "${randomPreference.title}" to ${user.first_name} ${user.last_name}`
      );
    } catch (error) {
      console.error(
        `Error creating user preference for ${user.first_name}:`,
        error
      );
    }
  }

  console.log(
    `User preferences seeding complete! Created: ${createdCount}, Skipped: ${skippedCount}`
  );
  return {
    created: createdCount,
    skipped: skippedCount,
  };
}

/**
 * Main seeding function that runs all seeds in the correct sequence
 */
async function runSeeds() {
  try {
    console.log("Starting database seeding sequence...");

    // 1. Create categories with proper types
    await seedCategories();

    // 2. Create FAQs
    await seedFAQs();

    // 3. Create preferences
    await seedPreferences();

    // 4. Create user preferences
    await seedUserPreferences();

    // // 5. Create service durations (needed for sleep options)
    await seedServiceDurations();

    // 6. Create dummy profiles with related data
    await seedDummyProfiles(10);

    // 6. Create dummy reviews
    // await seedDummyReviews(50);

    console.log("🌱 All seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error in seeding process:", error);
    throw error;
  }
}

// Run the seeds in sequence
runSeeds()
  .catch((e) => {
    console.error("Error running seeds:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

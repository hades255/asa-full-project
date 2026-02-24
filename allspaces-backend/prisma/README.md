# Prisma Database Setup and Seeding

This directory contains the Prisma schema and database migrations for the Spaces Backend application.

## Schema

The `schema.prisma` file defines the data model for the application, including:

- User accounts and roles
- Profiles for spaces and venues
- Services and categories
- Booking and order management
- Reviews and ratings
- Media attachments
- User preferences

## Migrations

The `/migrations` folder contains all database migrations. When the database schema changes, new migrations are created using Prisma Migrate.

## Seeding

The `seed.js` file provides functionality to populate the database with sample data for testing and development purposes.

### Service Categories Seeding

The seed script includes specialized functions to create services in the following categories:

1. **Workspace Options**:

   - Meeting Room, Business Room, Conference Room, Event Space, Co-working Desk, Private Office

2. **Relaxation Services**:

   - Spa, Massage, Beach Club, Wellness Center, Sauna, Meditation Room

3. **Leisure Services**:

   - Gym, Swimming Pool, Fitness Class, Tennis Court, Basketball Court, Yoga Studio

4. **Dining Options**:

   - Breakfast, Lunch, Dinner, Vegan, Halal, Gluten-Free, Restaurant, Café

5. **Sleep Options**:

   - Full Day, Half Day, Quarter Day, Hourly, Suite, Standard Room

6. **Travel Options**:
   - Taxi, Flight, Bike, Walking, Car Rental, Airport Shuttle

The sleep options are also associated with service durations for dynamic pricing:

- Full Day: 1.0 multiplier
- Half Day: 0.5 multiplier
- Quarter Day: 0.25 multiplier
- Hourly: 0.1 multiplier

### Running the Seed Script

To seed your database:

```bash
npx prisma db seed
```

The seed script will execute the following steps in sequence:

1. Create categories (Hotels, Gyms, Restaurants, etc.)
2. Create user preference options
3. Create service durations for sleep options
4. Create services in all categories
5. Update existing services with proper categories
6. Associate services with existing profiles

### Customizing the Seed

If you need to run only specific seed functions, you can uncomment the specific function calls at the end of the `seed.js` file and comment out the `runSeeds()` call.

For example, to only seed services:

```javascript
// Comment out the runSeeds function
// runSeeds()...

// Uncomment the specific seed you want to run
seedServices()
  .catch((e) => {
    console.error("Error seeding services:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

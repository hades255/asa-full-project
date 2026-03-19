/*
 Navicat Premium Dump SQL

 Source Server         : ASA
 Source Server Type    : PostgreSQL
 Source Server Version : 170006 (170006)
 Source Host           : database-3.cpo4gm02k20v.eu-north-1.rds.amazonaws.com:5432
 Source Catalog        : db_staging
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170006 (170006)
 File Encoding         : 65001

 Date: 18/03/2026 08:29:51
*/


-- ----------------------------
-- Type structure for BookingStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."BookingStatus";
CREATE TYPE "public"."BookingStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'CANCELLED',
  'COMPLETED',
  'IN_PROGRESS'
);

-- ----------------------------
-- Type structure for CategoryType
-- ----------------------------
DROP TYPE IF EXISTS "public"."CategoryType";
CREATE TYPE "public"."CategoryType" AS ENUM (
  'WORKSPACE',
  'RELAXATION',
  'DINING',
  'SLEEP',
  'TRAVEL',
  'POLICIES',
  'SPECIAL_OFFERS',
  'BEACH_CLUB'
);

-- ----------------------------
-- Type structure for ContactUsStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."ContactUsStatus";
CREATE TYPE "public"."ContactUsStatus" AS ENUM (
  'PENDING',
  'RESOLVED'
);

-- ----------------------------
-- Type structure for FileType
-- ----------------------------
DROP TYPE IF EXISTS "public"."FileType";
CREATE TYPE "public"."FileType" AS ENUM (
  'JPG',
  'PNG',
  'SVG',
  'MP4'
);

-- ----------------------------
-- Type structure for PaymentStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."PaymentStatus";
CREATE TYPE "public"."PaymentStatus" AS ENUM (
  'PENDING',
  'FAILED',
  'COMPLETED'
);

-- ----------------------------
-- Type structure for ProfileSource
-- ----------------------------
DROP TYPE IF EXISTS "public"."ProfileSource";
CREATE TYPE "public"."ProfileSource" AS ENUM (
  'SPACE',
  'ACCOR'
);

-- ----------------------------
-- Type structure for ProfileStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."ProfileStatus";
CREATE TYPE "public"."ProfileStatus" AS ENUM (
  'INACTIVE',
  'PUBLISHED'
);

-- ----------------------------
-- Type structure for Role
-- ----------------------------
DROP TYPE IF EXISTS "public"."Role";
CREATE TYPE "public"."Role" AS ENUM (
  'USER',
  'VENDOR',
  'EMPLOYEE',
  'ADMIN'
);

-- ----------------------------
-- Type structure for Status
-- ----------------------------
DROP TYPE IF EXISTS "public"."Status";
CREATE TYPE "public"."Status" AS ENUM (
  'ACTIVE',
  'BLOCKED'
);

-- ----------------------------
-- Table structure for Booking
-- ----------------------------
DROP TABLE IF EXISTS "public"."Booking";
CREATE TABLE "public"."Booking" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "customerId" text COLLATE "pg_catalog"."default",
  "profileId" text COLLATE "pg_catalog"."default",
  "check_in" timestamp(3) NOT NULL,
  "no_of_guests" int4 NOT NULL DEFAULT 0,
  "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING'::"BookingStatus",
  "spend" float8 NOT NULL DEFAULT 0.0,
  "payment_status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING'::"PaymentStatus",
  "amount" float8 NOT NULL DEFAULT 0.0,
  "notes" text COLLATE "pg_catalog"."default",
  "lat" float8,
  "lng" float8,
  "address" text COLLATE "pg_catalog"."default",
  "isReviewed" bool NOT NULL DEFAULT false,
  "cancellationReason" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "duration" int4 DEFAULT 0,
  "time" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for BookingService
-- ----------------------------
DROP TABLE IF EXISTS "public"."BookingService";
CREATE TABLE "public"."BookingService" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "bookingId" text COLLATE "pg_catalog"."default" NOT NULL,
  "serviceId" text COLLATE "pg_catalog"."default" NOT NULL,
  "price" float8 NOT NULL DEFAULT 0.0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Category
-- ----------------------------
DROP TABLE IF EXISTS "public"."Category";
CREATE TABLE "public"."Category" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "image" text COLLATE "pg_catalog"."default",
  "type" "public"."CategoryType" NOT NULL DEFAULT 'WORKSPACE'::"CategoryType",
  "parentId" text COLLATE "pg_catalog"."default",
  "orderIndex" int4 NOT NULL DEFAULT 0,
  "mobileImage" text COLLATE "pg_catalog"."default",
  "isActive" bool NOT NULL DEFAULT true
)
;

-- ----------------------------
-- Table structure for ContactUs
-- ----------------------------
DROP TABLE IF EXISTS "public"."ContactUs";
CREATE TABLE "public"."ContactUs" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default",
  "subject" text COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."ContactUsStatus" NOT NULL DEFAULT 'PENDING'::"ContactUsStatus",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for FAQ
-- ----------------------------
DROP TABLE IF EXISTS "public"."FAQ";
CREATE TABLE "public"."FAQ" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "question" text COLLATE "pg_catalog"."default" NOT NULL,
  "answer" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Facility
-- ----------------------------
DROP TABLE IF EXISTS "public"."Facility";
CREATE TABLE "public"."Facility" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "profileId" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Media
-- ----------------------------
DROP TABLE IF EXISTS "public"."Media";
CREATE TABLE "public"."Media" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "filePath" text COLLATE "pg_catalog"."default" NOT NULL,
  "fileType" "public"."FileType" NOT NULL,
  "profileId" text COLLATE "pg_catalog"."default",
  "serviceId" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Notification
-- ----------------------------
DROP TABLE IF EXISTS "public"."Notification";
CREATE TABLE "public"."Notification" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "isRead" bool NOT NULL DEFAULT false,
  "resourceType" text COLLATE "pg_catalog"."default",
  "resourceId" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for Preference
-- ----------------------------
DROP TABLE IF EXISTS "public"."Preference";
CREATE TABLE "public"."Preference" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "icon" text COLLATE "pg_catalog"."default",
  "parentId" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "orderIndex" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Table structure for Profile
-- ----------------------------
DROP TABLE IF EXISTS "public"."Profile";
CREATE TABLE "public"."Profile" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "accor_id" text COLLATE "pg_catalog"."default",
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default",
  "lat" float8,
  "lng" float8,
  "address" text COLLATE "pg_catalog"."default",
  "coverMedia" text COLLATE "pg_catalog"."default",
  "source" "public"."ProfileSource" NOT NULL DEFAULT 'SPACE'::"ProfileSource",
  "status" "public"."ProfileStatus" NOT NULL DEFAULT 'INACTIVE'::"ProfileStatus",
  "price" float8 NOT NULL DEFAULT 0.0,
  "oneStarCount" int4 DEFAULT 0,
  "twoStarCount" int4 DEFAULT 0,
  "threeStarCount" int4 DEFAULT 0,
  "fourStarCount" int4 DEFAULT 0,
  "fiveStarCount" int4 DEFAULT 0,
  "totalReviews" int4 DEFAULT 0,
  "eco_score" int4 NOT NULL DEFAULT 0,
  "averageRating" float8 DEFAULT 0.0,
  "userId" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Review
-- ----------------------------
DROP TABLE IF EXISTS "public"."Review";
CREATE TABLE "public"."Review" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "profileId" text COLLATE "pg_catalog"."default",
  "bookingId" text COLLATE "pg_catalog"."default" NOT NULL,
  "rating" int4 DEFAULT 0,
  "comment" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for SavedSearch
-- ----------------------------
DROP TABLE IF EXISTS "public"."SavedSearch";
CREATE TABLE "public"."SavedSearch" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "filters" jsonb NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for Service
-- ----------------------------
DROP TABLE IF EXISTS "public"."Service";
CREATE TABLE "public"."Service" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "minSpend" float8 DEFAULT 0.0,
  "categoryId" text COLLATE "pg_catalog"."default",
  "profileId" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for ServiceDuration
-- ----------------------------
DROP TABLE IF EXISTS "public"."ServiceDuration";
CREATE TABLE "public"."ServiceDuration" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "label" text COLLATE "pg_catalog"."default" NOT NULL,
  "multiplier" float8 NOT NULL,
  "unit" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "first_name" text COLLATE "pg_catalog"."default",
  "last_name" text COLLATE "pg_catalog"."default",
  "phone" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "confirmed_at" timestamp(3),
  "stripe_customer_id" text COLLATE "pg_catalog"."default",
  "stripe_payment_id" text COLLATE "pg_catalog"."default",
  "clerk_user_id" text COLLATE "pg_catalog"."default",
  "roles" "public"."Role"[] DEFAULT ARRAY['VENDOR'::"Role"],
  "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE'::"Status",
  "refresh_token" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "eco_score" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "parent_id" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for UserCategoryPreference
-- ----------------------------
DROP TABLE IF EXISTS "public"."UserCategoryPreference";
CREATE TABLE "public"."UserCategoryPreference" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "categoryId" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for UserPreference
-- ----------------------------
DROP TABLE IF EXISTS "public"."UserPreference";
CREATE TABLE "public"."UserPreference" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "preferenceId" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for Wishlist
-- ----------------------------
DROP TABLE IF EXISTS "public"."Wishlist";
CREATE TABLE "public"."Wishlist" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "profileId" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
  "id" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
  "checksum" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "finished_at" timestamptz(6),
  "migration_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "logs" text COLLATE "pg_catalog"."default",
  "rolled_back_at" timestamptz(6),
  "started_at" timestamptz(6) NOT NULL DEFAULT now(),
  "applied_steps_count" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Table structure for privacyPolicies
-- ----------------------------
DROP TABLE IF EXISTS "public"."privacyPolicies";
CREATE TABLE "public"."privacyPolicies" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'singleton'::text,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "version" text COLLATE "pg_catalog"."default" DEFAULT '1.0'::text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Table structure for termsAndConditions
-- ----------------------------
DROP TABLE IF EXISTS "public"."termsAndConditions";
CREATE TABLE "public"."termsAndConditions" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'singleton'::text,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "version" text COLLATE "pg_catalog"."default" DEFAULT '1.0'::text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table Booking
-- ----------------------------
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table BookingService
-- ----------------------------
ALTER TABLE "public"."BookingService" ADD CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Category
-- ----------------------------
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ContactUs
-- ----------------------------
ALTER TABLE "public"."ContactUs" ADD CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table FAQ
-- ----------------------------
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Facility
-- ----------------------------
ALTER TABLE "public"."Facility" ADD CONSTRAINT "Facility_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Media
-- ----------------------------
CREATE UNIQUE INDEX "Media_serviceId_key" ON "public"."Media" USING btree (
  "serviceId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Media
-- ----------------------------
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Notification
-- ----------------------------
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Preference
-- ----------------------------
ALTER TABLE "public"."Preference" ADD CONSTRAINT "Preference_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Profile
-- ----------------------------
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Review
-- ----------------------------
CREATE UNIQUE INDEX "Review_userId_profileId_bookingId_key" ON "public"."Review" USING btree (
  "userId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "profileId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "bookingId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Review
-- ----------------------------
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table SavedSearch
-- ----------------------------
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Service
-- ----------------------------
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ServiceDuration
-- ----------------------------
ALTER TABLE "public"."ServiceDuration" ADD CONSTRAINT "ServiceDuration_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table User
-- ----------------------------
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table UserCategoryPreference
-- ----------------------------
CREATE UNIQUE INDEX "UserCategoryPreference_userId_categoryId_key" ON "public"."UserCategoryPreference" USING btree (
  "userId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "categoryId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table UserCategoryPreference
-- ----------------------------
ALTER TABLE "public"."UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table UserPreference
-- ----------------------------
CREATE UNIQUE INDEX "UserPreference_userId_preferenceId_key" ON "public"."UserPreference" USING btree (
  "userId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "preferenceId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table UserPreference
-- ----------------------------
ALTER TABLE "public"."UserPreference" ADD CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table Wishlist
-- ----------------------------
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table _prisma_migrations
-- ----------------------------
ALTER TABLE "public"."_prisma_migrations" ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table privacyPolicies
-- ----------------------------
ALTER TABLE "public"."privacyPolicies" ADD CONSTRAINT "privacyPolicies_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table termsAndConditions
-- ----------------------------
ALTER TABLE "public"."termsAndConditions" ADD CONSTRAINT "termsAndConditions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Booking
-- ----------------------------
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table BookingService
-- ----------------------------
ALTER TABLE "public"."BookingService" ADD CONSTRAINT "BookingService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."BookingService" ADD CONSTRAINT "BookingService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Category
-- ----------------------------
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Facility
-- ----------------------------
ALTER TABLE "public"."Facility" ADD CONSTRAINT "Facility_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Media
-- ----------------------------
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Notification
-- ----------------------------
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Preference
-- ----------------------------
ALTER TABLE "public"."Preference" ADD CONSTRAINT "Preference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Preference" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Review
-- ----------------------------
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table SavedSearch
-- ----------------------------
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Service
-- ----------------------------
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table UserCategoryPreference
-- ----------------------------
ALTER TABLE "public"."UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table UserPreference
-- ----------------------------
ALTER TABLE "public"."UserPreference" ADD CONSTRAINT "UserPreference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "public"."Preference" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Wishlist
-- ----------------------------
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

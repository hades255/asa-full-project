-- CreateTable
CREATE TABLE "termsAndConditions" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "content" TEXT NOT NULL,
    "version" TEXT DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "termsAndConditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacyPolicies" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "content" TEXT NOT NULL,
    "version" TEXT DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "privacyPolicies_pkey" PRIMARY KEY ("id")
);

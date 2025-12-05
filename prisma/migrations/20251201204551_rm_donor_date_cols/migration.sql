-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "email" TEXT NOT NULL DEFAULT 'mplfboard@gmail.com',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "permission" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

<<<<<<<< HEAD:prisma/migrations/20251120214913_mckinney/migration.sql
-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
========
  - You are about to drop the `contactInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `donations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `donors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userInvitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "contactInfo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "donations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "donors";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "grants";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "rolePermissions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "userInvitations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;
>>>>>>>> 5453fe5370855de2c5454e5f324266f354a7e693:prisma/migrations/20251201204551_rm_donor_date_cols/migration.sql

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "email" TEXT NOT NULL DEFAULT 'mplfboard@gmail.com',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "permission" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AccountCreationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "preferredCommunication" TEXT,
    "notes" TEXT,
    "webLink" TEXT,
    "organization" TEXT,
    CONSTRAINT "Donor_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grantor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "email" TEXT,
    "webLink" TEXT,
    "organization" TEXT
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "donorId" TEXT,
    "event" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "receivedDate" DATETIME,
    "lastEditDate" DATETIME,
    CONSTRAINT "Donation_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "grantorId" TEXT,
    "purpose" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "status" INTEGER DEFAULT 0,
    "notes" TEXT,
    "proposedDate" DATETIME NOT NULL,
    "receivedDate" DATETIME,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "lastEditDate" DATETIME NOT NULL,
    CONSTRAINT "Grant_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grant_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expenditure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "purpose" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "notes" TEXT,
    "spentDate" DATETIME,
    "lastEditDate" DATETIME NOT NULL,
    CONSTRAINT "Expenditure_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

<<<<<<<< HEAD:prisma/migrations/20251120214913_mckinney/migration.sql
-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

========
>>>>>>>> 5453fe5370855de2c5454e5f324266f354a7e693:prisma/migrations/20251201204551_rm_donor_date_cols/migration.sql
-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_name_key" ON "Donor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Request_email_key" ON "Request"("email");

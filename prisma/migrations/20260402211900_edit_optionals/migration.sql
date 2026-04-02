/*
  Warnings:

  - Made the column `boardMemberId` on table `Donation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `boardMemberId` on table `Donor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `boardMemberId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `boardMemberId` on table `Grant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `boardMemberId` on table `Grantor` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT NOT NULL,
    "donorId" TEXT,
    "isAuthor" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "reason" TEXT,
    "receivedDate" DATETIME,
    "lastEditDate" DATETIME,
    CONSTRAINT "Donation_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("boardMemberId", "donorId", "eventId", "id", "isAuthor", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "reason", "receivedDate", "status") SELECT "boardMemberId", "donorId", "eventId", "id", "isAuthor", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "reason", "receivedDate", "status" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE TABLE "new_Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "preferredCommunication" TEXT,
    "notes" TEXT,
    "webLink" TEXT,
    "isAuthor" BOOLEAN NOT NULL DEFAULT false,
    "organization" TEXT,
    CONSTRAINT "Donor_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donor" ("address", "boardMemberId", "email", "id", "isAuthor", "name", "notes", "organization", "phone", "preferredCommunication", "webLink") SELECT "address", "boardMemberId", "email", "id", "isAuthor", "name", "notes", "organization", "phone", "preferredCommunication", "webLink" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_name_key" ON "Donor"("name");
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" DATETIME,
    "description" TEXT,
    CONSTRAINT "Event_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("boardMemberId", "description", "eventDate", "eventName", "id") SELECT "boardMemberId", "description", "eventDate", "eventName", "id" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT NOT NULL,
    "grantorId" TEXT,
    "purpose" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "status" INTEGER DEFAULT 0,
    "reimburse" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "proposedDate" DATETIME,
    "receivedDate" DATETIME,
    "lastEditDate" DATETIME,
    CONSTRAINT "Grant_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grant_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grant" ("boardMemberId", "grantorId", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "proposedDate", "purpose", "receivedDate", "reimburse", "status") SELECT "boardMemberId", "grantorId", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "proposedDate", "purpose", "receivedDate", "reimburse", "status" FROM "Grant";
DROP TABLE "Grant";
ALTER TABLE "new_Grant" RENAME TO "Grant";
CREATE TABLE "new_Grantor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT,
    "preferredCommunication" TEXT,
    "notes" TEXT,
    "webLink" TEXT,
    "organization" TEXT,
    CONSTRAINT "Grantor_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grantor" ("address", "boardMemberId", "email", "id", "name", "notes", "organization", "phone", "preferredCommunication", "webLink") SELECT "address", "boardMemberId", "email", "id", "name", "notes", "organization", "phone", "preferredCommunication", "webLink" FROM "Grantor";
DROP TABLE "Grantor";
ALTER TABLE "new_Grantor" RENAME TO "Grantor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

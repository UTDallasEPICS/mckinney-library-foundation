/*
  Warnings:

  - You are about to drop the column `endDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Grant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "grantorId" TEXT,
    "purpose" TEXT,
    "method" TEXT,
    "monetaryAmount" TEXT,
    "nonMonetaryAmount" TEXT,
    "status" INTEGER DEFAULT 0,
    "notes" TEXT,
    "proposedDate" DATETIME,
    "receivedDate" DATETIME,
    "lastEditDate" DATETIME,
    CONSTRAINT "Grant_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grant_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grant" ("boardMemberId", "grantorId", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "proposedDate", "purpose", "receivedDate", "status") SELECT "boardMemberId", "grantorId", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "proposedDate", "purpose", "receivedDate", "status" FROM "Grant";
DROP TABLE "Grant";
ALTER TABLE "new_Grant" RENAME TO "Grant";
CREATE TABLE "new_Grantor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
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
INSERT INTO "new_Grantor" ("email", "id", "name", "organization", "webLink") SELECT "email", "id", "name", "organization", "webLink" FROM "Grantor";
DROP TABLE "Grantor";
ALTER TABLE "new_Grantor" RENAME TO "Grantor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `value` on the `donations` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `grants` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_donations" (
    "donationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorID" INTEGER,
    "monetaryAmount" REAL NOT NULL,
    "nonmonetaryAmount" TEXT NOT NULL,
    "amountSpent" REAL NOT NULL,
    "donationMethod" TEXT NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "boardMemberID" INTEGER,
    "lastEditorID" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "donations_donorID_fkey" FOREIGN KEY ("donorID") REFERENCES "donors" ("donorID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "donations_boardMemberID_fkey" FOREIGN KEY ("boardMemberID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "donations_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_donations" ("allocatedFor", "amountSpent", "boardMemberID", "date", "donationID", "donationMethod", "donorID", "lastEditorID", "monetaryAmount", "nonmonetaryAmount", "notes", "status") SELECT "allocatedFor", "amountSpent", "boardMemberID", "date", "donationID", "donationMethod", "donorID", "lastEditorID", "monetaryAmount", "nonmonetaryAmount", "notes", "status" FROM "donations";
DROP TABLE "donations";
ALTER TABLE "new_donations" RENAME TO "donations";
CREATE TABLE "new_grants" (
    "grantID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "monetaryAmountRequested" REAL NOT NULL,
    "nonmonetaryAmountRequested" TEXT NOT NULL,
    "monetaryAmountReceived" REAL,
    "nonmonetaryAmountReceived" TEXT,
    "monetaryAmountSpent" REAL NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "proposalDate" TEXT NOT NULL,
    "awardDate" TEXT,
    "startDate" TEXT,
    "expirationDate" TEXT,
    "status" TEXT NOT NULL,
    "boardMemberID" INTEGER,
    "lastEditorID" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "grants_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "grants_boardMemberID_fkey" FOREIGN KEY ("boardMemberID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "grants_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_grants" ("allocatedFor", "awardDate", "boardMemberID", "contactInfoID", "date", "expirationDate", "grantID", "lastEditorID", "monetaryAmountReceived", "monetaryAmountRequested", "monetaryAmountSpent", "nonmonetaryAmountReceived", "nonmonetaryAmountRequested", "notes", "proposalDate", "startDate", "status") SELECT "allocatedFor", "awardDate", "boardMemberID", "contactInfoID", "date", "expirationDate", "grantID", "lastEditorID", "monetaryAmountReceived", "monetaryAmountRequested", "monetaryAmountSpent", "nonmonetaryAmountReceived", "nonmonetaryAmountRequested", "notes", "proposalDate", "startDate", "status" FROM "grants";
DROP TABLE "grants";
ALTER TABLE "new_grants" RENAME TO "grants";
CREATE UNIQUE INDEX "grants_contactInfoID_key" ON "grants"("contactInfoID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

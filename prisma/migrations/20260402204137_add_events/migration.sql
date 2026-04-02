/*
  Warnings:

  - You are about to drop the `Expenditure` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `event` on the `Donation` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Expenditure";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
    "eventName" TEXT NOT NULL,
    "eventDate" DATETIME,
    "description" TEXT,
    CONSTRAINT "Event_boardMemberId_fkey" FOREIGN KEY ("boardMemberId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DonorToEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DonorToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Donor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DonorToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
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
INSERT INTO "new_Donation" ("boardMemberId", "donorId", "id", "isAuthor", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "reason", "receivedDate", "status") SELECT "boardMemberId", "donorId", "id", "isAuthor", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "reason", "receivedDate", "status" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_DonorToEvent_AB_unique" ON "_DonorToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_DonorToEvent_B_index" ON "_DonorToEvent"("B");

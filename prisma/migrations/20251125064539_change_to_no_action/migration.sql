-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
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
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("boardMemberId", "donorId", "event", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "receivedDate", "status") SELECT "boardMemberId", "donorId", "event", "id", "lastEditDate", "method", "monetaryAmount", "nonMonetaryAmount", "notes", "receivedDate", "status" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

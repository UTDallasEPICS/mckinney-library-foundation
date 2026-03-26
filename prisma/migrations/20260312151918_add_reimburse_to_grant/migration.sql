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
    "reimburse" BOOLEAN NOT NULL DEFAULT false,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

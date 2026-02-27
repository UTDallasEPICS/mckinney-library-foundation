-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardMemberId" TEXT,
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
INSERT INTO "new_Donor" ("address", "boardMemberId", "email", "id", "name", "notes", "organization", "phone", "preferredCommunication", "webLink") SELECT "address", "boardMemberId", "email", "id", "name", "notes", "organization", "phone", "preferredCommunication", "webLink" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_name_key" ON "Donor"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

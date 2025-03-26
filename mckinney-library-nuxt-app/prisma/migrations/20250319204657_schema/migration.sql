/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `contactInfo` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contactInfo" (
    "contactInfoID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL DEFAULT 'Anonymous',
    "lastName" TEXT NOT NULL DEFAULT 'Anonymous',
    "organizationName" TEXT NOT NULL DEFAULT 'No organization listed',
    "email" TEXT NOT NULL DEFAULT 'No email listed',
    "phoneNumber" BIGINT,
    "address" TEXT NOT NULL DEFAULT 'No address listed',
    "notes" TEXT
);
INSERT INTO "new_contactInfo" ("address", "contactInfoID", "email", "firstName", "lastName", "notes", "organizationName", "phoneNumber") SELECT "address", "contactInfoID", "email", "firstName", "lastName", "notes", "organizationName", "phoneNumber" FROM "contactInfo";
DROP TABLE "contactInfo";
ALTER TABLE "new_contactInfo" RENAME TO "contactInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

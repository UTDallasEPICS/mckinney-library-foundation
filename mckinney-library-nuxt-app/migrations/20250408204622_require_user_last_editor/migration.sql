/*
  Warnings:

  - Made the column `lastEditorID` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastEditorID" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "users_role_fkey" FOREIGN KEY ("role") REFERENCES "rolePermissions" ("role") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "users_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_users" ("contactInfoID", "creationDate", "lastEditorID", "notes", "role", "status", "userID") SELECT "contactInfoID", "creationDate", "lastEditorID", "notes", "role", "status", "userID" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_contactInfoID_key" ON "users"("contactInfoID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

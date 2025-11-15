/*
  Warnings:

  - You are about to drop the column `status` on the `Request` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "permission" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL
);
INSERT INTO "new_Request" ("email", "id", "name") SELECT "email", "id", "name" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_email_key" ON "Request"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

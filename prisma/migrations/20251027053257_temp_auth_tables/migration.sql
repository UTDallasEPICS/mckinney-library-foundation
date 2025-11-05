/*
  Warnings:

  - The primary key for the `contactInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `contactInfoID` on the `contactInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `donations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `boardMemberID` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `donationID` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `donorID` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `lastEditorID` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `donors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `contactInfoID` on the `donors` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `donorID` on the `donors` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `lastEditorID` on the `donors` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `grants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `boardMemberID` on the `grants` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `contactInfoID` on the `grants` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `grantID` on the `grants` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `lastEditorID` on the `grants` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `userInvitations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `invitedUserID` on the `userInvitations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `invitingUserID` on the `userInvitations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userInvitationID` on the `userInvitations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `contactInfoID` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `lastEditorID` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userID` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "permission" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
CREATE TABLE "new_donors" (
    "donorID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "firstDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastContacted" TEXT NOT NULL,
    "numDonations" INTEGER NOT NULL,
    "lifetimeDonations" REAL NOT NULL,
    "lastEditorID" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "donors_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "donors_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_donors" ("contactInfoID", "donorID", "firstDonationDate", "lastContacted", "lastDonationDate", "lastEditorID", "lifetimeDonations", "notes", "numDonations") SELECT "contactInfoID", "donorID", "firstDonationDate", "lastContacted", "lastDonationDate", "lastEditorID", "lifetimeDonations", "notes", "numDonations" FROM "donors";
DROP TABLE "donors";
ALTER TABLE "new_donors" RENAME TO "donors";
CREATE UNIQUE INDEX "donors_contactInfoID_key" ON "donors"("contactInfoID");
CREATE TABLE "new_grants" (
    "grantID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "monetaryAmountRequested" REAL NOT NULL,
    "nonmonetaryAmountRequested" TEXT NOT NULL,
    "monetaryAmountReceived" REAL,
    "nonmonetaryAmountReceived" TEXT,
    "monetaryAmountSpent" REAL,
    "allocatedFor" TEXT NOT NULL,
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
INSERT INTO "new_grants" ("allocatedFor", "awardDate", "boardMemberID", "contactInfoID", "expirationDate", "grantID", "lastEditorID", "monetaryAmountReceived", "monetaryAmountRequested", "monetaryAmountSpent", "nonmonetaryAmountReceived", "nonmonetaryAmountRequested", "notes", "proposalDate", "startDate", "status") SELECT "allocatedFor", "awardDate", "boardMemberID", "contactInfoID", "expirationDate", "grantID", "lastEditorID", "monetaryAmountReceived", "monetaryAmountRequested", "monetaryAmountSpent", "nonmonetaryAmountReceived", "nonmonetaryAmountRequested", "notes", "proposalDate", "startDate", "status" FROM "grants";
DROP TABLE "grants";
ALTER TABLE "new_grants" RENAME TO "grants";
CREATE UNIQUE INDEX "grants_contactInfoID_key" ON "grants"("contactInfoID");
CREATE TABLE "new_userInvitations" (
    "userInvitationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invitingUserID" INTEGER NOT NULL,
    "invitedUserID" INTEGER NOT NULL,
    "invitationCreationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "invitationExpirationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'', ''+24 hours'')',
    CONSTRAINT "userInvitations_invitingUserID_fkey" FOREIGN KEY ("invitingUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "userInvitations_invitedUserID_fkey" FOREIGN KEY ("invitedUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_userInvitations" ("invitationCreationDate", "invitationExpirationDate", "invitedUserID", "invitingUserID", "userInvitationID") SELECT "invitationCreationDate", "invitationExpirationDate", "invitedUserID", "invitingUserID", "userInvitationID" FROM "userInvitations";
DROP TABLE "userInvitations";
ALTER TABLE "new_userInvitations" RENAME TO "userInvitations";
CREATE TABLE "new_users" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastEditorID" INTEGER,
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

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

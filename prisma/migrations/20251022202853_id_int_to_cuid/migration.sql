/*
  Warnings:

  - The primary key for the `contactInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `donations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `donors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `grants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userInvitations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contactInfo" (
    "contactInfoID" TEXT NOT NULL PRIMARY KEY,
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
    "donationID" TEXT NOT NULL PRIMARY KEY,
    "donorID" TEXT,
    "monetaryAmount" REAL NOT NULL,
    "nonmonetaryAmount" TEXT NOT NULL,
    "amountSpent" REAL NOT NULL,
    "donationMethod" TEXT NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "boardMemberID" TEXT,
    "lastEditorID" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "donations_donorID_fkey" FOREIGN KEY ("donorID") REFERENCES "donors" ("donorID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "donations_boardMemberID_fkey" FOREIGN KEY ("boardMemberID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "donations_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_donations" ("allocatedFor", "amountSpent", "boardMemberID", "date", "donationID", "donationMethod", "donorID", "lastEditorID", "monetaryAmount", "nonmonetaryAmount", "notes", "status") SELECT "allocatedFor", "amountSpent", "boardMemberID", "date", "donationID", "donationMethod", "donorID", "lastEditorID", "monetaryAmount", "nonmonetaryAmount", "notes", "status" FROM "donations";
DROP TABLE "donations";
ALTER TABLE "new_donations" RENAME TO "donations";
CREATE TABLE "new_donors" (
    "donorID" TEXT NOT NULL PRIMARY KEY,
    "contactInfoID" TEXT NOT NULL,
    "firstDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastContacted" TEXT NOT NULL,
    "numDonations" INTEGER NOT NULL,
    "lifetimeDonations" REAL NOT NULL,
    "lastEditorID" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "donors_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "donors_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_donors" ("contactInfoID", "donorID", "firstDonationDate", "lastContacted", "lastDonationDate", "lastEditorID", "lifetimeDonations", "notes", "numDonations") SELECT "contactInfoID", "donorID", "firstDonationDate", "lastContacted", "lastDonationDate", "lastEditorID", "lifetimeDonations", "notes", "numDonations" FROM "donors";
DROP TABLE "donors";
ALTER TABLE "new_donors" RENAME TO "donors";
CREATE UNIQUE INDEX "donors_contactInfoID_key" ON "donors"("contactInfoID");
CREATE TABLE "new_grants" (
    "grantID" TEXT NOT NULL PRIMARY KEY,
    "contactInfoID" TEXT NOT NULL,
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
    "boardMemberID" TEXT,
    "lastEditorID" TEXT NOT NULL,
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
    "userInvitationID" TEXT NOT NULL PRIMARY KEY,
    "invitingUserID" TEXT NOT NULL,
    "invitedUserID" TEXT NOT NULL,
    "invitationCreationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "invitationExpirationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'', ''+24 hours'')',
    CONSTRAINT "userInvitations_invitingUserID_fkey" FOREIGN KEY ("invitingUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "userInvitations_invitedUserID_fkey" FOREIGN KEY ("invitedUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_userInvitations" ("invitationCreationDate", "invitationExpirationDate", "invitedUserID", "invitingUserID", "userInvitationID") SELECT "invitationCreationDate", "invitationExpirationDate", "invitedUserID", "invitingUserID", "userInvitationID" FROM "userInvitations";
DROP TABLE "userInvitations";
ALTER TABLE "new_userInvitations" RENAME TO "userInvitations";
CREATE TABLE "new_users" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "contactInfoID" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastEditorID" TEXT,
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

-- CreateTable
CREATE TABLE "donations" (
    "donationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorID" INTEGER,
    "value" REAL NOT NULL,
    "donationMethod" TEXT NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "notes" TEXT,
    CONSTRAINT "donations_donorID_fkey" FOREIGN KEY ("donorID") REFERENCES "donors" ("donorID") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "donors" (
    "donorID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "firstDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastContacted" TEXT NOT NULL,
    "lifetimeDonations" REAL NOT NULL,
    "notes" TEXT,
    CONSTRAINT "donors_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "grants" (
    "grantID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "notes" TEXT,
    CONSTRAINT "grants_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rolePermissions" (
    "role" TEXT NOT NULL PRIMARY KEY,
    "viewDonors" INTEGER NOT NULL,
    "emailDonors" INTEGER NOT NULL,
    "viewDonationsAndGrants" INTEGER NOT NULL,
    "addDonationsAndGrants" INTEGER NOT NULL,
    "viewAccounts" INTEGER NOT NULL,
    "addAccounts" INTEGER NOT NULL,
    "manageAccounts" INTEGER NOT NULL,
    "viewRoles" INTEGER NOT NULL,
    "manageRoles" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "userInvitations" (
    "userInvitationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invitingUserID" INTEGER NOT NULL,
    "invitedUserID" INTEGER NOT NULL,
    "invitationCreationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "invitationExpirationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'', ''+72 hours'')',
    CONSTRAINT "userInvitations_invitingUserID_fkey" FOREIGN KEY ("invitingUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "userInvitations_invitedUserID_fkey" FOREIGN KEY ("invitedUserID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "users" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "password" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "users_role_fkey" FOREIGN KEY ("role") REFERENCES "rolePermissions" ("role") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "users_contactInfoID_fkey" FOREIGN KEY ("contactInfoID") REFERENCES "contactInfo" ("contactInfoID") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contactInfo" (
    "contactInfoID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL DEFAULT 'Anonymous',
    "lastName" TEXT NOT NULL DEFAULT 'Anonymous',
    "organizationName" TEXT NOT NULL DEFAULT 'No organization listed',
    "email" TEXT NOT NULL DEFAULT 'No email listed',
    "phoneNumber" INTEGER,
    "address" TEXT NOT NULL DEFAULT 'No address listed',
    "notes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "donors_contactInfoID_key" ON "donors"("contactInfoID");

-- CreateIndex
CREATE UNIQUE INDEX "grants_contactInfoID_key" ON "grants"("contactInfoID");

-- CreateIndex
CREATE UNIQUE INDEX "rolePermissions_role_key" ON "rolePermissions"("role");

-- CreateIndex
CREATE UNIQUE INDEX "users_contactInfoID_key" ON "users"("contactInfoID");

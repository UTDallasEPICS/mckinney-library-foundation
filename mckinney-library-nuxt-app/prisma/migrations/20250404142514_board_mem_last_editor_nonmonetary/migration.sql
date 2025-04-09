-- CreateTable
CREATE TABLE "donations" (
    "donationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorID" INTEGER,
    "value" REAL NOT NULL,
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

-- CreateTable
CREATE TABLE "donors" (
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

-- CreateTable
CREATE TABLE "grants" (
    "grantID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactInfoID" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "monetaryAmountRequested" REAL NOT NULL,
    "nonmonetaryAmountRequested" TEXT NOT NULL,
    "monetaryAmountReceived" REAL,
    "nonmonetaryAmountReceived" TEXT,
    "monetaryAmountSpent" REAL NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL,
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
    "invitationExpirationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'', ''+24 hours'')',
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
    "lastEditorID" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "users_lastEditorID_fkey" FOREIGN KEY ("lastEditorID") REFERENCES "users" ("userID") ON DELETE NO ACTION ON UPDATE NO ACTION,
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
    "phoneNumber" BIGINT,
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

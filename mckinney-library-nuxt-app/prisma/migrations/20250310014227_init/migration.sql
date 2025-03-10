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
    "organizationName" TEXT,
    "contactFirstName" TEXT,
    "contactLastName" TEXT,
    "email" TEXT,
    "phone_number" INTEGER,
    "address" TEXT,
    "firstDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastDonationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "lastContacted" TEXT NOT NULL,
    "lifetimeDonations" REAL NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "grants" (
    "grantID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationName" TEXT NOT NULL,
    "contactFirstName" TEXT,
    "contactLastName" TEXT,
    "email" TEXT,
    "phone_number" INTEGER,
    "address" TEXT,
    "value" REAL NOT NULL,
    "allocatedFor" TEXT NOT NULL,
    "date" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "role_permissions" (
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
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL DEFAULT 'DATETIME(''now'')',
    "email" TEXT NOT NULL,
    "phone_number" INTEGER,
    "password" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "users_role_fkey" FOREIGN KEY ("role") REFERENCES "role_permissions" ("role") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_donors_1" ON "donors"("organizationName");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_donors_2" ON "donors"("email");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_donors_3" ON "donors"("phone_number");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_grants_1" ON "grants"("organizationName");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_grants_2" ON "grants"("email");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_grants_3" ON "grants"("phone_number");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_1" ON "users"("email");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_2" ON "users"("phone_number");
Pragma writable_schema=0;

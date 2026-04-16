import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, permission: true },
  });

  if (users.length === 0) {
    throw new Error("No users found. Create users before seeding.");
  }

  const boardMemberId = users.find((u) => u.permission >= 2)?.id ?? users[0].id;

  const donors = [
    { name: "Alice Johnson", email: "alice.johnson@example.com", isAuthor: true },
    { name: "North Texas Book Club", email: "contact@ntbookclub.org", isAuthor: false },
    { name: "James Rivera", email: "j.rivera@example.com", isAuthor: false },
    { name: "Bright Future Foundation", email: "grants@brightfuture.org", isAuthor: false },
  ];

  for (const donor of donors) {
    await prisma.donor.upsert({
      where: { name: donor.name },
      update: {
        email: donor.email,
        boardMemberId,
        isAuthor: donor.isAuthor,
      },
      create: {
        name: donor.name,
        email: donor.email,
        boardMemberId,
        isAuthor: donor.isAuthor,
      },
    });
  }

  const grantors = [
    { name: "City Arts Council", email: "funding@cityartscouncil.org" },
    { name: "Community Impact Trust", email: "applications@cit.org" },
    { name: "Lone Star Education Fund", email: "hello@lsef.org" },
  ];

  for (const grantor of grantors) {
    const existing = await prisma.grantor.findFirst({ where: { name: grantor.name }, select: { id: true } });
    if (existing) {
      await prisma.grantor.update({
        where: { id: existing.id },
        data: { email: grantor.email, boardMemberId },
      });
    } else {
      await prisma.grantor.create({
        data: { name: grantor.name, email: grantor.email, boardMemberId },
      });
    }
  }

  const donorRows = await prisma.donor.findMany({
    where: { name: { in: donors.map((d) => d.name) } },
    select: { id: true, name: true, isAuthor: true },
  });

  if ((await prisma.donation.count()) === 0) {
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
    const donationData = [
      { donor: "Alice Johnson", event: "Spring Reading Gala", method: "Check", monetaryAmount: "5000", status: 1, reason: "Community literacy support", receivedDate: daysAgo(60) },
      { donor: "North Texas Book Club", event: "Book Drive 2026", method: "In-Kind", nonMonetaryAmount: "350 books", status: 1, reason: "Support summer reading challenge", receivedDate: daysAgo(42) },
      { donor: "James Rivera", event: "General Donation", method: "Online", monetaryAmount: "750", status: 0, reason: "General support", receivedDate: daysAgo(15) },
      { donor: "Bright Future Foundation", event: "Technology Upgrade Campaign", method: "Wire", monetaryAmount: "12000", status: 1, reason: "Digital equity initiative", receivedDate: daysAgo(7) },
    ];

    for (const row of donationData) {
      const donor = donorRows.find((d) => d.name === row.donor);
      if (!donor) continue;
      await prisma.donation.create({
        data: {
          boardMemberId,
          donorId: donor.id,
          isAuthor: donor.isAuthor,
          event: row.event,
          method: row.method,
          monetaryAmount: row.monetaryAmount ?? "",
          nonMonetaryAmount: row.nonMonetaryAmount ?? "",
          status: row.status,
          reason: row.reason,
          notes: "Seeded data",
          receivedDate: row.receivedDate,
          lastEditDate: now,
        },
      });
    }
  }

  const grantorRows = await prisma.grantor.findMany({
    where: { name: { in: grantors.map((g) => g.name) } },
    select: { id: true, name: true },
  });

  if ((await prisma.grant.count()) === 0) {
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
    const grantData = [
      { grantor: "City Arts Council", purpose: "Children's Programming", method: "Direct Deposit", monetaryAmount: "8000", status: 1, reimburse: false, proposedDate: daysAgo(90), receivedDate: daysAgo(40) },
      { grantor: "Community Impact Trust", purpose: "Volunteer Training", method: "Check", monetaryAmount: "3000", status: 0, reimburse: false, proposedDate: daysAgo(20), receivedDate: null },
      { grantor: "Lone Star Education Fund", purpose: "Digital Resources", method: "Wire", monetaryAmount: "15000", status: 1, reimburse: true, proposedDate: daysAgo(65), receivedDate: daysAgo(10) },
    ];

    for (const row of grantData) {
      const grantor = grantorRows.find((g) => g.name === row.grantor);
      if (!grantor) continue;
      await prisma.grant.create({
        data: {
          boardMemberId,
          grantorId: grantor.id,
          purpose: row.purpose,
          method: row.method,
          monetaryAmount: row.monetaryAmount,
          nonMonetaryAmount: "",
          status: row.status,
          reimburse: row.reimburse,
          notes: "Seeded data",
          proposedDate: row.proposedDate,
          receivedDate: row.receivedDate,
          lastEditDate: now,
        },
      });
    }
  }

  const [userCount, donorCount, donationCount, grantorCount, grantCount] = await Promise.all([
    prisma.user.count(),
    prisma.donor.count(),
    prisma.donation.count(),
    prisma.grantor.count(),
    prisma.grant.count(),
  ]);

  console.log("Seed complete:", { users: userCount, donors: donorCount, donations: donationCount, grantors: grantorCount, grants: grantCount });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const validUsers = [
  { name: "Jaden Tran", email: "tranjad001@gmail.com", permission: 3 },
];

const donors = [
  {
    name: "Mike's Health Collection",
    email: "MHC@example.com",
  },
  {
    name: "Ronald Lynn",
    email: "Rolynn@example.com",
  },
  {
    name: "Blake Boyd",
    email: "blake@example.com",
  },
];

const createUsers = async () => {
  await prisma.user.createMany({ data: validUsers });
};

const populateDonors = async () => {
  await prisma.donor.createMany({
    data: donors,
  });
};

const populateDonations = async () => {
  const donationData = [
    {
      donorName: "Mike's Health Collection",
      method: "cash",
      monetaryAmount: "1000",
      status: 1,
      notes: "",
      receivedDate: new Date("09/10/2026"),
    },
    {
      donorName: "Ronald Lynn",
      method: "gift",
      monetaryAmount: "100",
      status: 1,
      notes: "",
      receivedDate: new Date("09/10/2026"),
    },
    {
      donorName: "Blake Boyd",
      method: "cash",
      monetaryAmount: "500",
      status: 1,
      notes: "",
      receivedDate: new Date("09/10/2026"),
    },
  ];

  for (const donation of donationData) {
    const donor = await prisma.donor.findUnique({
      where: {
        name: donation.donorName
      }
    })

    await prisma.donation.create({
      data: {
        donorId: donor.id,
        method: donation.method,
        monetaryAmount: donation.monetaryAmount,
        status: donation.status,
        notes: donation.notes,
        receivedDate: donation.receivedDate
      }
    })
  }
};

const main = async () => {
  await populateDonors();
  await createUsers();
  await populateDonations();

  console.info(`Database has been seeded`);
};

main().catch((err) => {
  console.warn("Error while generating seed: \n", err);
});

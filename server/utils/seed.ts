import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const validUsers = [
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
      eventName: "Literature Festival",
      method: "cash",
      monetaryAmount: "1000",
      status: 1,
      notes: "",
      receivedDate: new Date("09/10/2026"),
    },
    {
      donorName: "Ronald Lynn",
      eventName: "April Event",
      method: "gift",
      monetaryAmount: "100",
      status: 1,
      notes: "",
      receivedDate: new Date("09/10/2026"),
    },
    {
      donorName: "Blake Boyd",
      eventName: "Literature Festival",
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
        name: donation.donorName,
      },
    });

    const event = await prisma.event.findFirst({
      where: {
        eventName: donation.eventName,
      },
    });

    await prisma.donation.create({
      data: {
        donorId: donor.id,
        eventId: event.id,
        method: donation.method,
        monetaryAmount: donation.monetaryAmount,
        status: donation.status,
        notes: donation.notes,
        receivedDate: donation.receivedDate,
      },
    });
  }
};

const events = [
  {
    eventName: "April Event",
    eventDate: new Date("04/01/2026"),
    description: "",
  },
  {
    eventName: "Literature Festival",
    eventDate: new Date("09/14/2026"),
    description: "",
  },
];

const populateEvents = async () => {
  await prisma.event.createMany({
    data: events,
  });
};

const main = async () => {
  await createUsers();
  await populateDonors();
  await populateEvents();
  await populateDonations();

  console.info(`Database has been seeded`);
};

main().catch((err) => {
  console.warn("Error while generating seed: \n", err);
});

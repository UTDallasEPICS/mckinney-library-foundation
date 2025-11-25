import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  console.log('route reached')

  const body = await readBody(event);
  console.log("body:", body);

  if (body.status === 'pending') {
    body.status = 0
  } else {
    body.status = 1
  }

  try {
    let donorRecord = await prisma.donor.findFirst({
      where: {
        name: body.donor
      }
    })

    if (!donorRecord) {      
      console.log("hi")
      donorRecord = await prisma.donor.create({
        data: {
          name: body.donor,
          address: "",
          email: "",
          phone: "",
          preferredCommunication: "",
          notes: "",
        }
      })

      console.log("create", donorRecord.id)
    }

    const donation = await prisma.donation.create({
      data: {
        boardMemberId: body.boardMemberId,
        donorId: donorRecord.id,
        event: body.event,
        method: body.method,
        monetaryAmount: body.monetaryAmount,
        nonMonetaryAmount: body.nonMonetaryAmount,
        status: body.status ?? 0,
        notes: body.notes,
        receivedDate: new Date(),
        lastEditDate: new Date()
      },
      include: {
        donor: true
      }
    })

    return {
      success: true,
      statusCode: 200,
      data: donation
    }

  } catch (error) {
    console.log("error creating donation:", error)

    return {
      success: false,
      statusCode: 500,
      message: "Failed to create donation",
      error: error
    }
  }
})


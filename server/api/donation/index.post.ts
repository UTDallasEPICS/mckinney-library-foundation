import prisma from '~~/server/utils/prisma'
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  const session = await requireSession(event, 1);
  const body = await readBody(event);
  try {
    let donorRecord = await prisma.donor.findFirst({
      where: {
        name: body.donor? body.donor : "anonymous"
      }
    })

    if (!donorRecord) {      
      donorRecord = await prisma.donor.create({
        data: {
          name: body.donor? body.donor: "anonymous",
          address: "",
          email: "",
          phone: "",
          preferredCommunication: "",
          notes: "",
          boardMemberId: session.user.id
        }
      })
    }
    const donation = await prisma.donation.create({
      data: {
        boardMemberId: session.user.id,
        donorId: donorRecord.id,
        event: body.event,
        method: body.method,
        monetaryAmount: body.monetaryAmount,
        nonMonetaryAmount: body.nonMonetaryAmount,
        status: parseInt(body.status) ?? 0,
        notes: body.notes,
        receivedDate: new Date(body.receivedDate),
        lastEditDate: new Date()
      },
      include: {
        donor: true,
        boardMember:{
            select:{
                name:true
            }
        }
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
            error: error,
            data:null
        }
  }
});

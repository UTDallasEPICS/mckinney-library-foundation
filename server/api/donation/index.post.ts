import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    if(body.permissionLevel < 1){
            throw createError({
                statusCode: 401,
                statusMessage:"User not authorized to create donations"
            });
        }
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
          boardMemberId: body.boardMemberId
        }
      })
    }
    const donation = await prisma.donation.create({
      data: {
        boardMemberId: body.boardMemberId,
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
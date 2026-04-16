import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session?.user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        error: { code: 'UNAUTHORIZED' },
        data: null,
      };
    }

    const currentUser = session.user as { id: string; permission?: number };
    const permissionLevel = Number(currentUser.permission ?? 0);
    if(permissionLevel < 1){
      return {
        success: false,
        statusCode: 403,
        message: 'User not authorized to create donations',
        error: { code: 'FORBIDDEN' },
        data: null,
      };
    }
    const eventName = typeof body.event === 'string' ? body.event.trim() : '';
    const matchedEvent = eventName
      ? await prisma.event.findFirst({
          where: {
            eventName,
          },
        })
      : null;
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
          boardMemberId: currentUser.id
        }
      })
    }
    const donation = await prisma.donation.create({
      data: {
        boardMemberId: currentUser.id,
        donorId: donorRecord.id,
        isAuthor: donorRecord.isAuthor,
        eventId: matchedEvent?.id ?? null,
        method: body.method,
        monetaryAmount: body.monetaryAmount,
        nonMonetaryAmount: body.nonMonetaryAmount,
        status: parseInt(body.status) ?? 0,
        notes: body.notes,
        reason: body.reason,
        receivedDate: new Date(body.receivedDate),
        lastEditDate: new Date()
      },
      include: {
        event: {
          select: {
            eventName: true,
            eventDate: true,
          }
        },
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
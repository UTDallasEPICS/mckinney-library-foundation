import prisma from "~~/server/utils/prisma";
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireSession(event, 1);
    const body = await readBody(event);
    if (body.permissionLevel < 1) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not authorized to create donations",
      });
    }
  
    if (body.status == 1 && !body.receivedDate) {
      throw createError({
        statusCode: 400,
        statusMessage: "A received donation requires a received date",
      });
    }

    const donation = await prisma.$transaction(async (tx) => {
    const eventName = typeof body.event === "string" ? body.event.trim() : "";
    const matchedEvent = eventName
      ? await tx.event.findFirst({ where: { eventName } })
        : null;
      const donorName = body.donor?.trim() || "anonymous";
      let donorRecord = await tx.donor.findFirst({
      where: {
        name: donorName
      }});
      if (!donorRecord) {
        donorRecord = await tx.donor.create({
          data: {
            name: donorName,
            address: "",
            email: "",
            phone: "",
            preferredCommunication: "",
            notes: "",
            boardMemberId: session.user.id,
          },
        });
      }
      const receivedDate = body.receivedDate
        ? new Date(body.receivedDate)
        : null;
      const createdDonation = await tx.donation.create({
        data: {
          boardMemberId: session.user.id,
          donorId: donorRecord.id,
          isAuthor: donorRecord.isAuthor,
          eventId: matchedEvent?.id ?? null,
          method: body.method,
          monetaryAmount: body.monetaryAmount,
          nonMonetaryAmount: body.nonMonetaryAmount,
          status: Number(body.status),
          frequency: body.frequency ?? undefined,
          notes: body.notes,
          reason: body.reason,
          receivedDate,
          lastEditDate: new Date(),
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
        },
        },
      });

      await writeAuditLog(
        tx,
        session.user.id,
        "CREATE",
        "DONATION",
        createdDonation.id,
        {},
        {
          donor: donorRecord?.name ?? donorName,
          event: matchedEvent?.eventName ?? null,
          method: createdDonation.method,
          monetaryAmount: createdDonation.monetaryAmount,
          nonMonetaryAmount: createdDonation.nonMonetaryAmount,
          status: createdDonation.status == 1 ? "Received" : "Pending",
          frequency: createdDonation.frequency,
          notes: createdDonation.notes,
          reason: createdDonation.reason,
          receivedDate: createdDonation.receivedDate?.toISOString() ?? null,
        },
      );

      return createdDonation;
    });
    return {
      success: true,
      statusCode: 200,
      data: donation,
    };
  } catch (error) {
    console.log("error creating donation:", error)
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create donation",
      error: error,
      data: null
    };
  }
});

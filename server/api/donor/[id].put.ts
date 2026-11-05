import prisma from "~~/server/utils/prisma";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireSession(event, 1);
    const id = await getRouterParam(event, "id");
    const body = await readBody(event);
    const email = body.email?.trim() || null;
    const phone = body.phone?.trim() || null;

    const existingDonor = await prisma.donor.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
        NOT: {
          id,
        },
      },
    });

    if (existingDonor) {
      return {
        success: false,
        statusCode: 400,
        message:
          "This contact information is already in use by " + existingDonor.name,
        error: { code: "P2002" },
        data: null,
      };
    }

  const updatedDonor = await prisma.$transaction(async (tx) => {
    const previousDonor = await tx.donor.findUnique({
      where: { id },
    });

    if (!previousDonor) {
      return {
        success: false,
        statusCode: 404,
        message: "Donor not found",
        data: null,
      };
    }

    const donor = await tx.donor.update({
      where: { id },
      data: {
        name: body.name,
        boardMemberId: body.boardMemberId,
        email,
        phone,
        address: body.address,
        preferredCommunication: body.preferredCommunication,
        notes: body.notes,
        webLink: body.webLink,
        isAuthor: body.isAuthor,
        organization: body.organization,
      },
      include: {
        boardMember: {
          select: {
            name: true,
          },
        },
      },
    });

    await tx.donation.updateMany({
      where: { donorId: id },
      data: { isAuthor: donor.isAuthor },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        recordType: "DONOR",
        recordId: donor.id,
        snapshot: { 
          before: {
            name: previousDonor.name,
            email: previousDonor.email,
            phone: previousDonor.phone,
            address: previousDonor.address,
            preferredCommunication: previousDonor.preferredCommunication,
            notes: previousDonor.notes,
            webLink: previousDonor.webLink,
            isAuthor: previousDonor.isAuthor,
            organization: previousDonor.organization,
          },
          after: {
            name: donor.name,
            email: donor.email,
            phone: donor.phone,
            address: donor.address,
            preferredCommunication: donor.preferredCommunication,
            notes: donor.notes,
            webLink: donor.webLink,
            isAuthor: donor.isAuthor,
            organization: donor.organization,
          }
                    
         }
      },
    });

    return donor;
  });
  
  return {
    success: true,
    statusCode: 200,
    data: updatedDonor,
    error: { code: "" },
  };
  
} catch (error) {
  console.error(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        statusCode: 400,
        message: "This contact information is already in use. ",
        error: { code: error.code },
        data: null,
      };
    }
  }
  return {
    success: false,
    statusCode: 500,
    message: "Failed to update donor",
    error: error,
    data: null,
  };
}
});
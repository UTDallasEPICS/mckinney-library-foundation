import prisma from "~~/server/utils/prisma";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  try {
    await requireSession(event, 1);
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

    const updatedDonor = await prisma.donor.update({
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
    await prisma.donation.updateMany({
      where: { donorId: id },
      data: { isAuthor: updatedDonor.isAuthor },
    });
    return {
      success: true,
      statusCode: 200,
      data: updatedDonor,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          statusCode: 400,
          message: "This contact information is already in use!",
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

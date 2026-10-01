import prisma from "~~/server/utils/prisma";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  try {
    await requireSession(event, 1);
    const body = await readBody(event);
    const email = body.email?.trim() || null;
    const phone = body.phone?.trim() || null;

    if (body.email || body.phone) {
      const existingDonor = await prisma.donor.findFirst({
        where: {
          OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
        },
      });

      if (existingDonor) {
        return {
          success: false,
          statusCode: 400,
          message: "This contact information is already in use.",
          error: { code: "P2002" },
          data: null,
        };
      }
    }

    const donor = await prisma.donor.create({
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
        donations: body.donations,
      },
      include: {
        boardMember: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      success: true,
      statusCode: 200,
      data: donor,
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
      message: "Failed to create donor",
      error: error,
      data: null,
    };
  }
});

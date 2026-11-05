import prisma from "~~/server/utils/prisma";
import { requireSession } from "~~/server/utils/requireSession";
import { z } from "zod";

const fileSchema = z
  .file()
  .min(1, "File cannot be empty")
  .max(2 * 1024 * 1024)
  .mime(["image/webp", "image/jpg", "image/png", "application/pdf"], {
    message: "Invalid file type (PDF/JPG/PNG/WEBP only)",
  });

export default defineEventHandler(async (event) => {
  try {
    await requireSession(event, 1);
    const grantId = getRouterParam(event, "id");
    const body = await readBody(event);
    const grant = await prisma.grant.update({
      where: { id: grantId },
      data: {
        boardMemberId: body.boardMemberId,
        grantorId: body.grantorId,
        purpose: body.purpose,
        method: body.method,
        monetaryAmount: body.monetaryAmount,
        nonMonetaryAmount: body.nonMonetaryAmount,
        reimburse: body.reimburse,
        notes: body.notes,
        proposedDate: body.proposedDate ? new Date(body.proposedDate) : null,
        receivedDate: new Date(body.receivedDate),
      },
      include: {
        boardMember: true,
        grantor: true,
      },
    });

    return {
      success: true,
      statusCode: 200,
      data: grant,
      error: { code: "" },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update grant",
      error: error,
      data: null,
    };
  }
});

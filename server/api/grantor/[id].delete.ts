import prisma from "~~/server/utils/prisma";
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireSession(event, 1);
    const grantorId = await getRouterParam(event, "id");

    const deletedGrantor = await prisma.$transaction(async (tx) => {
      const grantor = await tx.grantor.delete({
        where: { id: grantorId },
      });

      await writeAuditLog(
        tx,
        session.user.id,
        "DELETE",
        "GRANTOR",
        grantor.id,
        {
          name: grantor.name,
          ...(grantor.phone?.trim() ? { phone: grantor.phone.trim() } : {}),
          ...(grantor.email?.trim() ? { email: grantor.email.trim() } : {}),
          ...(grantor.organization?.trim()
            ? { organization: grantor.organization.trim() }
            : {}),
        },
        {},
      );

      return grantor;
    });

    return {
      success: true,
      statusCode: 200,
      data: deletedGrantor,
      error: { code: "" },
    };
  } catch (error) {
    console.error(error);
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    return {
      success: false,
      statusCode: 500,
      message: "Failed to delete grantor",
      error,
      data: null,
    };
  }
});

import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const currentApprovedAwards = await prisma.grant.count({
      where: {
        status: 1, // 1: completed/approved
        endDate: {
          gte: today, // End Date must be Greater Than or Equal to today
        },
      },
    });

    return {
      activeGrants: currentApprovedAwards,
      description: "Currently approved and active awards",
    };
  } catch (backendIssue) {
    console.error("Critical error fetching active grants:", backendIssue);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database failed to return active grant count.',
    });
  }
});
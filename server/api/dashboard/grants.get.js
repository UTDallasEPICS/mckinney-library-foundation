import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const currentApprovedAwards = await prisma.grant.count({
      where: {
        status: 1, 
        endDate: {
          gte: today, 
        },
      },
    });

    return {
      activeGrants: currentApprovedAwards,
      description: "Currently approved and active grants",
    };
  } catch (backendIssue) {
    console.error("Critical error fetching active grants:", backendIssue);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database failed to return active grant count.',
    });
  }
});
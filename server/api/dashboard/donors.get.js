import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {

  try {
    const donorCountSnapshot = await prisma.donor.count();

    return {
      totalDonors: donorCountSnapshot,
      description: "All-time total count of unique contributors",
    };
  } catch (backendIssue) {
    
    console.error("Critical error fetching donor count:", backendIssue);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database failed to return donor count.',
    });
  }
});
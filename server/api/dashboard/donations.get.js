import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  
  try {
    const confirmedFundingList = await prisma.donation.findMany({
      where: {
        status: 1, 
      },
      select: {
        monetaryAmount: true,
      },
    });

    const totalMonetaryAmount = confirmedFundingList.reduce((runningTotal, record) => {
      
      const currentAmount = parseFloat(record.monetaryAmount || '0');
      if (!isNaN(currentAmount)) {
        runningTotal += currentAmount;
      }
      return runningTotal;
    }, 0);

    return {
      totalDonations: Math.round(totalMonetaryAmount),
      description: "Total funding received across all time",
    };
  } catch (backendIssue) {
    console.error("Critical error fetching donations total:", backendIssue);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection failed while calculating total funds.',
    });
  }
});
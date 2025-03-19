// server/api/donations/[id].js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific donation
    if (event.node.req.method === 'GET') {
        try {
            // Note the correct relationship name is "donors" not "donor"
            const donation = await prisma.donations.findUnique({
                where: {
                    donationID: id
                },
                include: {
                    donors: {
                        include: {
                            contactInfo: true
                        }
                    }
                }
            });

            if (!donation) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            // Transform data to match the format expected by the frontend
            const transformedDonation = {
                id: donation.donationID,
                amount: donation.value || 0,
                date: donation.date || null,
                donationMethod: donation.donationMethod || null,
                allocatedFor: donation.allocatedFor || null,
                notes: donation.notes || null
            };

            // Add donor information if available
            if (donation.donors && donation.donors.contactInfo) {
                transformedDonation.donor = donation.donors.contactInfo.firstName + ' ' + donation.donors.contactInfo.lastName;
                transformedDonation.donorId = donation.donors.donorID;
            }

            return transformedDonation;
        } catch (error) {
            console.error('Error fetching donation:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to fetch donation: ' + error.message,
            });
        }
    }

    // PUT: Update a donation
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);

            // Check if donation exists
            const existingDonation = await prisma.donations.findUnique({
                where: {
                    donationID: id
                }
            });

            if (!existingDonation) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            // If amount is being changed, we need to update donor's lifetime donations
            let amountDifference = 0;
            if (body.amount !== undefined && existingDonation.value !== parseFloat(body.amount)) {
                amountDifference = parseFloat(body.amount) - existingDonation.value;
            }

            // Prepare update data
            const updateData = {};

            if (body.amount !== undefined) updateData.value = parseFloat(body.amount);
            if (body.date !== undefined) updateData.date = body.date;
            if (body.donationMethod !== undefined) updateData.donationMethod = body.donationMethod;
            if (body.allocatedFor !== undefined || body.category !== undefined) {
                updateData.allocatedFor = body.allocatedFor || body.category;
            }
            if (body.notes !== undefined) updateData.notes = body.notes;

            // Update donation
            const updatedDonation = await prisma.donations.update({
                where: {
                    donationID: id
                },
                data: updateData
            });

            // Update donor's lifetime donations if amount changed and donor exists
            if (amountDifference !== 0 && existingDonation.donorID) {
                await prisma.donors.update({
                    where: {
                        donorID: existingDonation.donorID
                    },
                    data: {
                        lifetimeDonations: {
                            increment: amountDifference
                        },
                        lastDonationDate: new Date().toISOString().split('T')[0]
                    }
                });
            }

            return {
                message: 'Donation updated successfully',
                donation: {
                    id: updatedDonation.donationID,
                    amount: updatedDonation.value,
                    date: updatedDonation.date,
                    donationMethod: updatedDonation.donationMethod,
                    allocatedFor: updatedDonation.allocatedFor,
                    donorId: updatedDonation.donorID,
                    notes: updatedDonation.notes
                }
            };
        } catch (error) {
            console.error('Error updating donation:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to update donation: ' + error.message,
            });
        }
    }

    // DELETE: Remove a donation
    if (event.node.req.method === 'DELETE') {
        try {
            // Get donation with donor info before deleting
            const donation = await prisma.donations.findUnique({
                where: {
                    donationID: id
                }
            });

            if (!donation) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            // Store the amount and donor ID for later use
            const amount = donation.value || 0;
            const donorId = donation.donorID;

            // Delete the donation
            await prisma.donations.delete({
                where: {
                    donationID: id
                }
            });

            // Update donor's lifetime donations if applicable
            if (donorId && amount > 0) {
                await prisma.donors.update({
                    where: {
                        donorID: donorId
                    },
                    data: {
                        lifetimeDonations: {
                            decrement: amount
                        }
                    }
                });
            }

            return {
                message: 'Donation deleted successfully',
                id
            };
        } catch (error) {
            console.error('Error deleting donation:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to delete donation: ' + error.message,
            });
        }
    }
});
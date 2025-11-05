/* TODO:
    - separate each function into its own file and use TypeScript
    - i.e. [id].get.ts, [id].put.ts, [id].delete.ts 
    - repeat with every page
*/
// server/api/donations/[id].js
import prisma from '~/server/utils/prisma'
// import { Prisma } from '@prisma/client'; // REMOVE or comment out this line if only used for enums

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch a specific donation
    if (event.node.req.method === 'GET') {
        try {
            // Fetch donation including related info (no changes needed in GET for this schema update)
            const donation = await prisma.donations.findUnique({
                where: { donationID: id },
                include: {
                    donors: { include: { contactInfo: true } },
                    boardMember: { include: { contactInfo: true } },
                    lastEditor: { include: { contactInfo: true } }
                }
            });

            if (!donation) {
                throw createError({ statusCode: 404, statusMessage: 'Donation not found' });
            }

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedDonation = {
                id: donation.donationID,
                donorId: donation.donorID,
                monetaryAmount: donation.monetaryAmount,
                nonmonetaryAmount: donation.nonmonetaryAmount,
                amountSpent: donation.amountSpent,
                donationMethod: donation.donationMethod,
                allocatedFor: donation.allocatedFor,
                date: donation.date,
                status: donation.status, // Now just a string
                boardMemberId: donation.boardMemberID,
                lastEditorId: donation.lastEditorID,
                notes: donation.notes,
                boardMemberName: donation.boardMember ? `${donation.boardMember.contactInfo.firstName} ${donation.boardMember.contactInfo.lastName}` : null,
                lastEditorName: donation.lastEditor ? `${donation.lastEditor.contactInfo.firstName} ${donation.lastEditor.contactInfo.lastName}` : null,
            };
            if (donation.donors && donation.donors.contactInfo) {
                transformedDonation.donor = donation.donors.contactInfo.firstName + ' ' + donation.donors.contactInfo.lastName;
            } else if (donation.donorID === null) {
                transformedDonation.donor = 'Anonymous';
            }
            return transformedDonation;

        } catch (error) {
            console.error('Error fetching donation:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
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

            // Check if donation exists (logic remains the same)
            const existingDonation = await prisma.donations.findUnique({
                where: { donationID: id }
            });
            if (!existingDonation) {
                throw createError({ statusCode: 404, statusMessage: 'Donation not found' });
            }

            // REMOVE Enum Validation Block:
            /* if (body.status && !Object.values(Prisma.DonationStatus).includes(body.status)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid status value. Must be one of: ${Object.values(Prisma.DonationStatus).join(', ')}`,
                });
            } */
            // Optional: Add basic string validation for status if needed
            // if (body.status !== undefined && !body.status.trim()) {
            //     throw createError({ statusCode: 400, statusMessage: 'Status cannot be empty' });
            // }

            // Calculate monetary difference (logic remains the same)
            let monetaryAmountDifference = 0;
            if (body.monetaryAmount !== undefined && existingDonation.monetaryAmount !== parseFloat(body.monetaryAmount)) {
                monetaryAmountDifference = parseFloat(body.monetaryAmount) - existingDonation.monetaryAmount;
            }

            // Prepare update data (status is now just passed as a string)
            const updateData = {
                lastEditorID: currentUserID // Always update the last editor
            };
            if (body.donorId !== undefined) updateData.donorID = body.donorId ? parseInt(body.donorId) : null;
            if (body.monetaryAmount !== undefined) updateData.monetaryAmount = parseFloat(body.monetaryAmount);
            if (body.nonmonetaryAmount !== undefined) updateData.nonmonetaryAmount = body.nonmonetaryAmount;
            if (body.amountSpent !== undefined) updateData.amountSpent = parseFloat(body.amountSpent);
            if (body.donationMethod !== undefined) updateData.donationMethod = body.donationMethod;
            if (body.allocatedFor !== undefined) updateData.allocatedFor = body.allocatedFor;
            if (body.date !== undefined) updateData.date = body.date;
            if (body.status !== undefined) updateData.status = body.status; // Pass string directly
            if (body.boardMemberId !== undefined) updateData.boardMemberID = body.boardMemberId ? parseInt(body.boardMemberId) : null;
            if (body.notes !== undefined) updateData.notes = body.notes;

            // Transaction for updating donation and potentially donor (logic remains the same)
            const result = await prisma.$transaction(async (tx) => {
                const updatedDonation = await tx.donations.update({
                    where: { donationID: id },
                    data: updateData
                });

                if (monetaryAmountDifference !== 0 && updatedDonation.donorID) {
                    const donorUpdateData = {
                        lifetimeDonations: { increment: monetaryAmountDifference },
                        lastEditorID: currentUserID
                    };
                    if (body.date !== undefined) {
                        donorUpdateData.lastDonationDate = body.date;
                    }
                    await tx.donors.update({
                        where: { donorID: updatedDonation.donorID },
                        data: donorUpdateData
                    });
                } else if (updatedDonation.donorID) {
                    await tx.donors.update({
                        where: { donorID: updatedDonation.donorID },
                        data: { lastEditorID: currentUserID }
                    });
                }
                return updatedDonation;
            });

            // Return updated donation (structure remains the same, status is just a string now)
            return {
                message: 'Donation updated successfully',
                donation: {
                    id: result.donationID,
                    donorId: result.donorID,
                    monetaryAmount: result.monetaryAmount,
                    nonmonetaryAmount: result.nonmonetaryAmount,
                    amountSpent: result.amountSpent,
                    donationMethod: result.donationMethod,
                    allocatedFor: result.allocatedFor,
                    date: result.date,
                    status: result.status, // String value
                    boardMemberId: result.boardMemberID,
                    lastEditorId: result.lastEditorID,
                    notes: result.notes
                }
            };
        } catch (error) {
            console.error('Error updating donation:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to update donation: ' + error.message,
            });
        }
    }

    // DELETE: Remove a donation (logic remains the same for this schema update)
    if (event.node.req.method === 'DELETE') {
        try {
            const donationToDelete = await prisma.donations.findUnique({
                where: { donationID: id }
            });
            if (!donationToDelete) {
                throw createError({ statusCode: 404, statusMessage: 'Donation not found' });
            }
            const monetaryAmountToDelete = donationToDelete.monetaryAmount || 0;
            const donorIDToUpdate = donationToDelete.donorID;

            await prisma.$transaction(async (tx) => {
                await tx.donations.delete({ where: { donationID: id } });
                if (donorIDToUpdate) {
                    const donor = await tx.donors.findUnique({ where: { donorID: donorIDToUpdate } });
                    if (donor) {
                        await tx.donors.update({
                            where: { donorID: donorIDToUpdate },
                            data: {
                                lifetimeDonations: { decrement: monetaryAmountToDelete },
                                numDonations: { decrement: 1 },
                                lastEditorID: currentUserID
                            }
                        });
                    }
                }
            });

            return {
                message: 'Donation deleted successfully and donor totals updated',
                id,
                amountDeducted: monetaryAmountToDelete,
                donorUpdated: donorIDToUpdate ? true : false
            };
        } catch (error) {
            console.error('Error deleting donation:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete donation: ' + error.message,
            });
        }
    }
});
// server/api/donors/[id].js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific donor
    if (event.node.req.method === 'GET') {
        try {
            const donor = await prisma.donors.findUnique({
                where: {
                    donorID: id
                },
                include: {
                    contactInfo: true,
                    donations: true // Include all donations for this donor
                }
            });

            if (!donor) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            // Transform data to match the format expected by the frontend
            const transformedDonor = {
                id: donor.donorID,
                name: `${donor.contactInfo.firstName} ${donor.contactInfo.lastName}`,
                firstName: donor.contactInfo.firstName,
                lastName: donor.contactInfo.lastName,
                email: donor.contactInfo.email,
                phone: donor.contactInfo.phoneNumber ? String(donor.contactInfo.phoneNumber) : null,
                address: donor.contactInfo.address || null,
                organization: donor.contactInfo.organizationName || null,
                totalDonations: donor.lifetimeDonations,
                firstDonationDate: donor.firstDonationDate,
                lastDonationDate: donor.lastDonationDate,
                lastContacted: donor.lastContacted,
                notes: donor.notes || null,
                // Include donation details
                donations: donor.donations.map(donation => ({
                    id: donation.donationID,
                    amount: donation.value,
                    date: donation.date,
                    method: donation.donationMethod,
                    allocatedFor: donation.allocatedFor,
                    notes: donation.notes
                }))
            };

            return transformedDonor;
        } catch (error) {
            console.error('Error fetching donor:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to fetch donor: ' + error.message,
            });
        }
    }

    // PUT: Update a donor
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);

            // Find the donor first to get the contactInfoID
            const donor = await prisma.donors.findUnique({
                where: {
                    donorID: id
                },
                include: {
                    contactInfo: true
                }
            });

            if (!donor) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            // Update in a transaction to ensure both donor and contact info are updated together
            const updatedDonor = await prisma.$transaction(async (tx) => {
                // Prepare updates for contact info
                const contactInfoUpdate = {};

                if (body.firstName !== undefined) contactInfoUpdate.firstName = body.firstName;
                if (body.lastName !== undefined) contactInfoUpdate.lastName = body.lastName;
                if (body.email !== undefined) contactInfoUpdate.email = body.email;
                // Skip phone number for now to avoid conversion issues
                if (body.address !== undefined) contactInfoUpdate.address = body.address;
                if (body.organization !== undefined) contactInfoUpdate.organizationName = body.organization;
                if (body.notes !== undefined) contactInfoUpdate.notes = body.notes;

                // Update contact info if there are any changes
                if (Object.keys(contactInfoUpdate).length > 0) {
                    await tx.contactInfo.update({
                        where: {
                            contactInfoID: donor.contactInfoID
                        },
                        data: contactInfoUpdate
                    });
                }

                // Prepare updates for donor
                const donorUpdate = {};

                if (body.totalDonations !== undefined) donorUpdate.lifetimeDonations = parseFloat(body.totalDonations);
                if (body.lastDonationDate !== undefined) donorUpdate.lastDonationDate = body.lastDonationDate;
                if (body.lastContacted !== undefined) donorUpdate.lastContacted = body.lastContacted;
                if (body.notes !== undefined) donorUpdate.notes = body.notes;

                // Update donor if there are any changes
                let updatedDonorData = donor;
                if (Object.keys(donorUpdate).length > 0) {
                    updatedDonorData = await tx.donors.update({
                        where: {
                            donorID: id
                        },
                        data: donorUpdate,
                        include: {
                            contactInfo: true
                        }
                    });
                }

                // Return transformed donor data
                return {
                    id: updatedDonorData.donorID,
                    name: `${updatedDonorData.contactInfo.firstName} ${updatedDonorData.contactInfo.lastName}`,
                    firstName: updatedDonorData.contactInfo.firstName,
                    lastName: updatedDonorData.contactInfo.lastName,
                    email: updatedDonorData.contactInfo.email,
                    phone: updatedDonorData.contactInfo.phoneNumber ? String(updatedDonorData.contactInfo.phoneNumber) : null,
                    address: updatedDonorData.contactInfo.address,
                    organization: updatedDonorData.contactInfo.organizationName,
                    totalDonations: updatedDonorData.lifetimeDonations,
                    lastDonationDate: updatedDonorData.lastDonationDate,
                    lastContacted: updatedDonorData.lastContacted,
                    notes: updatedDonorData.notes
                };
            });

            return {
                message: 'Donor updated successfully',
                donor: updatedDonor
            };
        } catch (error) {
            console.error('Error updating donor:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to update donor: ' + error.message,
            });
        }
    }

    // DELETE: Remove a donor
    if (event.node.req.method === 'DELETE') {
        try {
            // Find the donor first to check if it exists
            const donor = await prisma.donors.findUnique({
                where: {
                    donorID: id
                },
                include: {
                    donations: true
                }
            });

            if (!donor) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            // Use a transaction to delete donations first, then donor
            await prisma.$transaction(async (tx) => {
                // 1. Delete all donations from this donor
                if (donor.donations && donor.donations.length > 0) {
                    await tx.donations.deleteMany({
                        where: {
                            donorID: id
                        }
                    });

                    console.log(`Deleted ${donor.donations.length} donations for donor ${id}`);
                }

                // 2. Delete the donor record (but not contact info)
                await tx.donors.delete({
                    where: {
                        donorID: id
                    }
                });

                console.log(`Deleted donor with ID: ${id}`);
            });

            // Return success response
            return {
                message: `Donor and ${donor.donations.length} associated donations deleted successfully`,
                id,
                donationsDeleted: donor.donations.length
            };
        } catch (error) {
            console.error('Error deleting donor:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete donor: ' + error.message,
            });
        }
    }
});
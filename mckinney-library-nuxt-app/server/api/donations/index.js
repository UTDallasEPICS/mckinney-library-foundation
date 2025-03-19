// server/api/donations/index.js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // GET: Fetch all donations
    if (event.node.req.method === 'GET') {
        try {
            // Fetch donations from database with correct relation names
            const donations = await prisma.donations.findMany({
                include: {
                    donors: {
                        include: {
                            contactInfo: true
                        }
                    }
                }
            });

            // Transform data to match the format expected by the frontend
            const transformedDonations = donations.map(donation => {
                // Build the response object based on what's in the database
                const donationData = {
                    id: donation.donationID,
                    amount: donation.value || 0,
                    date: donation.date || null,
                    donationMethod: donation.donationMethod || null,
                    allocatedFor: donation.allocatedFor || null,
                    notes: donation.notes || null
                };

                // Add donor information if available
                if (donation.donors && donation.donors.contactInfo) {
                    donationData.donor = donation.donors.contactInfo.firstName + ' ' + donation.donors.contactInfo.lastName;
                    donationData.donorId = donation.donors.donorID;
                }

                return donationData;
            });

            return transformedDonations;
        } catch (error) {
            console.error('Error fetching donations:', error);
            // More detailed error for debugging
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch donations: ' + error.message,
            });
        }
    }

    // POST: Add a new donation
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (body.amount === undefined) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Amount is required',
                });
            }

            // Required fields according to your schema
            if (!body.donationMethod) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Donation method is required',
                });
            }

            if (!body.allocatedFor) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Allocated for is required',
                });
            }

            let donorId = null;

            // Handle different donor scenarios
            if (body.donorId) {
                // Case 1: Existing donor specified by ID
                donorId = parseInt(body.donorId);

                // Verify the donor exists
                const existingDonor = await prisma.donors.findUnique({
                    where: { donorID: donorId }
                });

                if (!existingDonor) {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'Specified donor not found',
                    });
                }
            } else if (body.donor && typeof body.donor === 'string' && body.donor !== 'Anonymous') {
                // Case 2: New donor with details
                if (body.donorDetails) {
                    try {
                        const result = await prisma.$transaction(async (tx) => {
                            // Create contact info
                            const contactInfo = await tx.contactInfo.create({
                                data: {
                                    firstName: body.donorDetails.firstName || body.donor.split(' ')[0] || 'Anonymous',
                                    lastName: body.donorDetails.lastName || body.donor.split(' ').slice(1).join(' ') || 'Anonymous',
                                    email: body.donorDetails.email || 'No email listed',
                                    phoneNumber: body.donorDetails.phoneNumber ? null : null, // Using null to avoid type conversion issues
                                    address: body.donorDetails.address || 'No address listed',
                                    organizationName: body.donorDetails.organization || 'No organization listed'
                                }
                            });

                            // Create donor with contactInfo relation
                            const donor = await tx.donors.create({
                                data: {
                                    contactInfoID: contactInfo.contactInfoID,
                                    lastContacted: new Date().toISOString().split('T')[0],
                                    lifetimeDonations: parseFloat(body.amount),
                                    // These are auto-defaulted in your schema
                                    firstDonationDate: new Date().toISOString().split('T')[0],
                                    lastDonationDate: new Date().toISOString().split('T')[0]
                                }
                            });

                            return donor.donorID;
                        });

                        donorId = result;
                    } catch (txError) {
                        console.error('Transaction error:', txError);
                        throw txError;
                    }
                }
            }
            // Case 3: Anonymous donation (donorId remains null)

            // Create the donation
            const newDonation = await prisma.donations.create({
                data: {
                    value: parseFloat(body.amount),
                    donationMethod: body.donationMethod,
                    allocatedFor: body.allocatedFor || body.category,
                    date: body.date || new Date().toISOString().split('T')[0],
                    notes: body.notes || null,
                    donorID: donorId
                }
            });

            // Update donor's lifetime donations if a donor was specified
            if (donorId) {
                await prisma.donors.update({
                    where: { donorID: donorId },
                    data: {
                        lifetimeDonations: {
                            increment: parseFloat(body.amount)
                        },
                        lastContacted: new Date().toISOString().split('T')[0],
                        lastDonationDate: new Date().toISOString().split('T')[0]
                    }
                });
            }

            return {
                message: 'Donation added successfully',
                donation: {
                    id: newDonation.donationID,
                    amount: newDonation.value,
                    date: newDonation.date,
                    donationMethod: newDonation.donationMethod,
                    allocatedFor: newDonation.allocatedFor,
                    donorId: newDonation.donorID,
                    notes: newDonation.notes
                }
            };
        } catch (error) {
            console.error('Error creating donation:', error);
            // More detailed error for debugging
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to add donation: ' + error.message,
            });
        }
    }
});
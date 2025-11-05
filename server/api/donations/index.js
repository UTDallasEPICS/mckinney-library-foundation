// server/api/donations/index.js
import prisma from '~/server/utils/prisma'
import donors from '../donors';
import Id from './[id]';
import boardMembers from '../boardMembers';
// import { Prisma } from '@prisma/client'; // REMOVE or comment out this line if only used for enums

export default defineEventHandler(async (event) => {
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch all donations
    if (event.node.req.method === 'GET') {
        try {
            // Fetch donations including related info (no changes needed in GET for this schema update)
            const donations = await prisma.donations.findMany({
                include: {
                    donors: {
                        include: { contactInfo: true }
                    },
                    boardMember: {
                        include: { contactInfo: true }
                    },
                    lastEditor: {
                        include: { contactInfo: true }
                    }
                }
            });

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedDonations = donations.map(donation => {
                const donationData = {
                    id: donation.donationID,
                    donorId: donation.donorID,
                    monetaryAmount: donation.monetaryAmount,
                    nonmonetaryAmount: donation.nonmonetaryAmount,
                    amountSpent: donation.amountSpent,
                    donationMethod: donation.donationMethod,
                    allocatedFor: donation.allocatedFor,
                    date: donation.date,
                    status: donation.status, // Now just a string
                    lastEditorId: donation.lastEditorID,
                    notes: donation.notes,
                    lastEditorName: donation.lastEditor ? `${donation.lastEditor.contactInfo.firstName} ${donation.lastEditor.contactInfo.lastName}` : null,
                };

                if (donation.donors && donation.donors.contactInfo) {
                    donationData.donor = donation.donors.contactInfo.firstName + ' ' + donation.donors.contactInfo.lastName;
                } else if (donation.donorID === null) {
                    donationData.donor = 'Anonymous';
                }

                if (donation.boardMember) {
                    donationData.boardMember = donation.boardMember.contactInfo.firstName + ' ' + donation.boardMember.contactInfo.lastName;
                }

                return donationData;
            });

            return transformedDonations;
        } catch (error) {
            console.error('Error fetching donations:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
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

            // Validate required fields from schema (status is now just a string)
            if (body.monetaryAmount === undefined || body.nonmonetaryAmount === undefined || body.amountSpent === undefined || !body.donationMethod || !body.allocatedFor || !body.status) { // status still required as per schema
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields (monetaryAmount, nonmonetaryAmount, amountSpent, donationMethod, allocatedFor, status)',
                });
            }

            let donorId = body.donorId ? parseInt(body.donorId) : null;
            let boardMemberId = body.boardMemberId ? parseInt(body.boardMemberId) : null;

            // Handle new donor creation if needed (logic remains the same)
            if (!donorId && body.donorDetails && body.donorDetails.firstName && body.donorDetails.lastName) {
                try {
                    const result = await prisma.$transaction(async (tx) => {
                        const contactInfo = await tx.contactInfo.create({
                            data: { /* ... contact info data ... */ }
                        });
                        const donor = await tx.donors.create({
                            data: { /* ... donor data, including numDonations: 1, lifetimeDonations etc... */ }
                        });
                        return donor.donorID;
                    });
                    donorId = result;
                } catch (txError) {
                    console.error('Transaction error creating new donor:', txError);
                    throw createError({ statusCode: 500, statusMessage: 'Failed to create new donor during donation: ' + txError.message });
                }
            } else if (body.donorId) {
                // Verify existing donor ID (logic remains the same)
                const existingDonor = await prisma.donors.findUnique({ where: { donorID: donorId } });
                if (!existingDonor) {
                    throw createError({ statusCode: 404, statusMessage: 'Specified donor not found' });
                }
            }

            // Create the donation (pass status string directly)
            const newDonation = await prisma.donations.create({
                data: {
                    // donorID: donorId,
                    donors: {connect: {donorID: donorId}},
                    monetaryAmount: parseFloat(body.monetaryAmount),
                    nonmonetaryAmount: body.nonmonetaryAmount,
                    amountSpent: parseFloat(body.amountSpent),
                    donationMethod: body.donationMethod,
                    allocatedFor: body.allocatedFor,
                    date: body.date || new Date().toISOString().split('T')[0],
                    status: body.status, // Pass the string directly
                    //If boardMemberID is null, this won't connect to the users table
                    ...(boardMemberId ? { boardMember: { connect: { userID: boardMemberId } } } : {}),

                    lastEditor: {
                        connect: {userID: currentUserID}
                     },
                    notes: body.notes || null,
                },
                include: {
                    donors: true,
                    boardMember: true,
                    lastEditor: {
                        include: {
                            contactInfo: true
                        } 
                }
            }

            });

            // 🔍 Console log the last editor's contact info
                if (newDonation.lastEditor && newDonation.lastEditor.contactInfo) {
                    console.log("Last editor contact info:");
                    console.log("Email:", newDonation.lastEditor.contactInfo.email);
                    console.log("Phone:", newDonation.lastEditor.contactInfo.phoneNumber);
                } else {
                    console.log("No contact info found for last editor.");
                }

            // Update donor's lifetime donations and count if needed (logic remains the same)
            if (donorId) {
                await prisma.donors.update({
                    where: { donorID: donorId },
                    data: {
                        lifetimeDonations: { increment: parseFloat(body.monetaryAmount) },
                        numDonations: { increment: 1 },
                        lastDonationDate: newDonation.date,
                        lastContacted: new Date().toISOString().split('T')[0],
                        lastEditorID: currentUserID // Update editor on donor too
                    }
                });
            }

            // Return created donation (structure remains the same, status is just a string now)
            return {
                message: 'Donation added successfully',
                donation: {
                    id: newDonation.donationID,
                    donorId: newDonation.donorID,
                    monetaryAmount: newDonation.monetaryAmount,
                    nonmonetaryAmount: newDonation.nonmonetaryAmount,
                    amountSpent: newDonation.amountSpent,
                    donationMethod: newDonation.donationMethod,
                    allocatedFor: newDonation.allocatedFor,
                    date: newDonation.date,
                    status: newDonation.status, // String value
                    boardMemberId: newDonation.boardMemberID,
                    lastEditorId: newDonation.lastEditorID,
                    notes: newDonation.notes
                }
            };
        } catch (error) {
            console.error('Error creating donation:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to add donation: ' + error.message,
            });
        }
    }
});
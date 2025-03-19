// server/api/donors/index.js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // GET: Fetch all donors
    if (event.node.req.method === 'GET') {
        try {
            // Fetch donors from database with contact info
            const donors = await prisma.donors.findMany({
                include: {
                    contactInfo: true
                }
            });

            // Transform data to match the format expected by the frontend
            const transformedDonors = donors.map(donor => {
                return {
                    id: donor.donorID,
                    name: `${donor.contactInfo.firstName} ${donor.contactInfo.lastName}`,
                    email: donor.contactInfo.email,
                    phone: donor.contactInfo.phoneNumber ? String(donor.contactInfo.phoneNumber) : null,
                    address: donor.contactInfo.address || null,
                    totalDonations: donor.lifetimeDonations,
                    lastDonationDate: donor.lastDonationDate,
                    lastContacted: donor.lastContacted,
                    notes: donor.notes || null,
                    contactInfoID: donor.contactInfoID
                };
            });

            return transformedDonors;
        } catch (error) {
            console.error('Error fetching donors:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch donors: ' + error.message,
            });
        }
    }

    // POST: Add a new donor
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (!body.name) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Donor name is required',
                });
            }

            // Split name into first and last name
            const nameParts = body.name.split(' ');
            const firstName = nameParts[0] || 'Anonymous';
            const lastName = nameParts.slice(1).join(' ') || 'Anonymous';

            // Check if donor with this email already exists
            if (body.email) {
                const existingContact = await prisma.contactInfo.findFirst({
                    where: {
                        email: body.email
                    },
                    include: {
                        donors: true
                    }
                });

                if (existingContact && existingContact.donors) {
                    throw createError({
                        statusCode: 409,
                        statusMessage: 'A donor with this email already exists',
                    });
                }
            }

            // Create donor and contact info in a transaction
            const result = await prisma.$transaction(async (tx) => {
                // Create contact info first
                const contactInfo = await tx.contactInfo.create({
                    data: {
                        firstName,
                        lastName,
                        email: body.email || 'No email listed',
                        phoneNumber: body.phone ? null : null, // Using null to avoid type conversion issues
                        address: body.address || 'No address listed',
                        organizationName: body.organization || 'No organization listed',
                        notes: body.notes
                    }
                });

                // Then create donor with reference to contact info
                const donor = await tx.donors.create({
                    data: {
                        contactInfoID: contactInfo.contactInfoID,
                        firstDonationDate: body.firstDonationDate || new Date().toISOString().split('T')[0],
                        lastDonationDate: body.lastDonationDate || new Date().toISOString().split('T')[0],
                        lastContacted: body.lastContacted || new Date().toISOString().split('T')[0],
                        lifetimeDonations: body.totalDonations ? parseFloat(body.totalDonations) : 0,
                        notes: body.notes
                    },
                    include: {
                        contactInfo: true
                    }
                });

                return {
                    id: donor.donorID,
                    name: `${contactInfo.firstName} ${contactInfo.lastName}`,
                    email: contactInfo.email,
                    phone: contactInfo.phoneNumber ? String(contactInfo.phoneNumber) : null,
                    address: contactInfo.address,
                    totalDonations: donor.lifetimeDonations,
                    lastDonationDate: donor.lastDonationDate,
                    lastContacted: donor.lastContacted,
                    notes: donor.notes
                };
            });

            return {
                message: 'Donor created successfully',
                donor: result
            };
        } catch (error) {
            console.error('Error creating donor:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to create donor: ' + error.message,
            });
        }
    }
});
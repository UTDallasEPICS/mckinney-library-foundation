// server/api/grants/index.js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // GET: Fetch all grants
    if (event.node.req.method === 'GET') {
        try {
            // Fetch grants from database with contact info
            const grants = await prisma.grants.findMany({
                include: {
                    contactInfo: true
                }
            });

            // Transform data to match the format expected by the frontend
            const transformedGrants = grants.map(grant => {
                return {
                    id: grant.grantID,
                    orgName: grant.contactInfo.organizationName || 'Unnamed Grant',
                    firstName: grant.contactInfo.firstName,
                    lastName: grant.contactInfo.lastName,
                    email: grant.contactInfo.email,
                    phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                    address: grant.contactInfo.address,
                    monetaryAmountRequested: grant.monetaryAmountRequested,
                    nonmonetaryAmountRequested: grant.nonmonetaryAmountRequested,
                    monetaryAmountReceived: grant.monetaryAmountReceived || 0,
                    nonmonetaryAmountReceived: grant.nonmonetaryAmountReceived,
                    monetaryAmountSpent: grant.monetaryAmountSpent || 0,
                    allocatedFor: grant.allocatedFor,
                    status: grant.status,
                    proposalDate: grant.proposalDate,
                    awardDate: grant.awardDate,
                    startDate: grant.startDate,
                    expirationDate: grant.expirationDate,
                    notes: grant.notes,
                    boardMember: grant.boardMember,
                    lastEditor: grant.lastEditor,      //Hardcoded value that will be changed once we offer support for multiple accounts
                    contactInfoID: grant.contactInfoID
                };
            });

            return transformedGrants;
        } catch (error) {
            console.error('Error fetching grants:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch grants: ' + error.message,
            });
        }
    }

    // POST: Add a new grant
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (body.monetaryAmountRequested === undefined || !body.allocatedFor) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields (amount, allocatedFor)',
                });
            }

            // Create grant and contact info in a transaction
            const result = await prisma.$transaction(async (tx) => {
                console.log("Attempting to create contactInfo with data:", {
                    organizationName: body.orgName,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    phoneNumber: body.phone ? null : null,
                    address: body.address,
                    lastEditor: body.lastEditor,      //Hardcoded value that will be changed once we offer support for multiple accounts
                    notes: body.notes
                });

                // Create contact info first
                const contactInfo = await tx.contactInfo.create({
                    data: {
                        organizationName: body.orgName || 'No organization listed',
                        firstName: body.firstName || 'Anonymous',
                        lastName: body.lastName || 'Anonymous',
                        email: body.email || 'No email listed',
                        phoneNumber: body.phone ? null : null, // Using null to avoid type conversion issues
                        address: body.address || 'No address listed',
                        notes: body.notes
                    }
                });

                //console.log("Created contactInfo:", contactInfo);
                //console.log("contactInfo.contactInfoID:", contactInfo.contactInfoID);

                // Then create grant with reference to contact info
                const grant = await tx.grants.create({
                    data: {
                        monetaryAmountRequested: parseFloat(body.monetaryAmountRequested),
                        nonmonetaryAmountRequested: body.nonmonetaryAmountRequested,
                        allocatedFor: body.allocatedFor,
                        proposalDate: body.proposalDate || new Date().toISOString().split('T')[0],
                        awardDate: body.awardDate,
                        startDate: body.startDate,
                        expirationDate: body.expirationDate,
                        status: body.status,
                        notes: body.notes,

                        lastEditor: {
                            connect: {
                                userID: body.lastEditor
                            }
                        },
                        contactInfo: {
                            connect: {
                                contactInfoID: contactInfo.contactInfoID
                            }
                        }
                    },
                    include: {
                        contactInfo: true,
                        lastEditor: true
                    }
                });

                //console.log("Created grant:", grant);

                // Store custom fields in a separate metadata object or table if needed
                // For now, we'll just return them with the response

                return {
                    id: grant.grantID,
                    orgName: contactInfo.organizationName,
                    firstName: contactInfo.firstName,
                    lastName: contactInfo.lastName,
                    email: contactInfo.email,
                    phone: contactInfo.phoneNumber ? String(contactInfo.phoneNumber) : null,
                    address: contactInfo.address,
                    monetaryAmountRequested: grant.monetaryAmountRequested,
                    nonmonetaryAmountRequested: grant.nonmonetaryAmountRequested,
                    allocatedFor: grant.allocatedFor,
                    status: grant.status,
                    proposalDate: grant.proposalDate,
                    awardDate: grant.awardDate,
                    startDate: grant.startDate,
                    expirationDate: grant.expirationDate,
                    boardMember: grant.boardMember,
                    lastEditor: grant.lastEditor,      //Hardcoded value that will be changed once we offer support for multiple accounts
                    notes: grant.notes
                };
            });

            return {
                message: 'Grant created successfully',
                grant: result
            };
        } catch (error) {
            console.error('Error creating grant:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to create grant: ' + error.message,
            });
        }
    }
});
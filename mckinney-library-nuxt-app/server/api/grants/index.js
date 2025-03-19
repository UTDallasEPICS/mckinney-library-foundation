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
                    name: grant.contactInfo.organizationName || 'Unnamed Grant',
                    contactName: `${grant.contactInfo.firstName} ${grant.contactInfo.lastName}`,
                    email: grant.contactInfo.email,
                    phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                    amount: grant.value,
                    date: grant.date,
                    allocatedFor: grant.allocatedFor,
                    status: 'Active', // Default status since it's not in the schema
                    notes: grant.notes || null,
                    boardMember: false, // Default value since it's not in the schema
                    link: null, // Default value since it's not in the schema
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
            if (body.amount === undefined || !body.allocatedFor) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields (amount, allocatedFor)',
                });
            }

            // Create grant and contact info in a transaction
            const result = await prisma.$transaction(async (tx) => {
                // Split name into first and last name if provided, otherwise use defaults
                let firstName = 'Anonymous';
                let lastName = 'Anonymous';

                if (body.contactName) {
                    const nameParts = body.contactName.split(' ');
                    firstName = nameParts[0] || 'Anonymous';
                    lastName = nameParts.slice(1).join(' ') || 'Anonymous';
                }

                // Create contact info first
                const contactInfo = await tx.contactInfo.create({
                    data: {
                        firstName,
                        lastName,
                        email: body.email || 'No email listed',
                        phoneNumber: body.phone ? null : null, // Using null to avoid type conversion issues
                        address: body.address || 'No address listed',
                        organizationName: body.name || 'No organization listed',
                        notes: body.notes
                    }
                });

                // Then create grant with reference to contact info
                const grant = await tx.grants.create({
                    data: {
                        contactInfoID: contactInfo.contactInfoID,
                        value: parseFloat(body.amount),
                        allocatedFor: body.allocatedFor,
                        date: body.date || new Date().toISOString().split('T')[0],
                        notes: body.notes
                    },
                    include: {
                        contactInfo: true
                    }
                });

                // Store custom fields in a separate metadata object or table if needed
                // For now, we'll just return them with the response

                return {
                    id: grant.grantID,
                    name: contactInfo.organizationName,
                    contactName: `${contactInfo.firstName} ${contactInfo.lastName}`,
                    email: contactInfo.email,
                    phone: contactInfo.phoneNumber ? String(contactInfo.phoneNumber) : null,
                    amount: grant.value,
                    date: grant.date,
                    allocatedFor: grant.allocatedFor,
                    status: body.status || 'Active',
                    boardMember: body.boardMember || false,
                    link: body.link || null,
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
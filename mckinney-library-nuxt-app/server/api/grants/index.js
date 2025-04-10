// server/api/grants/index.js
import prisma from '~/server/utils/prisma'
// import { Prisma } from '@prisma/client'; // REMOVE or comment out this line if only used for enums

export default defineEventHandler(async (event) => {
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch all grants
    if (event.node.req.method === 'GET') {
        try {
            // Fetch grants including related info (no changes needed in GET for this schema update)
            const grants = await prisma.grants.findMany({
                include: {
                    contactInfo: true,
                    boardMember: { include: { contactInfo: true } },
                    lastEditor: { include: { contactInfo: true } }
                }
            });

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedGrants = grants.map(grant => {
                return {
                    id: grant.grantID,
                    organizationName: grant.contactInfo.organizationName || 'No organization listed',
                    firstName: grant.contactInfo.firstName,
                    lastName: grant.contactInfo.lastName,
                    contactName: `${grant.contactInfo.firstName} ${grant.contactInfo.lastName}`,
                    email: grant.contactInfo.email,
                    phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                    address: grant.contactInfo.address || null,
                    contactNotes: grant.contactInfo.notes || null,
                    contactInfoID: grant.contactInfoID,
                    monetaryAmountRequested: grant.monetaryAmountRequested,
                    nonmonetaryAmountRequested: grant.nonmonetaryAmountRequested,
                    monetaryAmountReceived: grant.monetaryAmountReceived,
                    nonmonetaryAmountReceived: grant.nonmonetaryAmountReceived,
                    monetaryAmountSpent: grant.monetaryAmountSpent,
                    allocatedFor: grant.allocatedFor,
                    proposalDate: grant.proposalDate,
                    awardDate: grant.awardDate,
                    startDate: grant.startDate,
                    expirationDate: grant.expirationDate,
                    status: grant.status, // Now just a string
                    boardMemberId: grant.boardMemberID,
                    lastEditorId: grant.lastEditorID,
                    grantNotes: grant.notes || null,
                    boardMemberName: grant.boardMember ? `${grant.boardMember.contactInfo.firstName} ${grant.boardMember.contactInfo.lastName}` : null,
                    lastEditorName: grant.lastEditor ? `${grant.lastEditor.contactInfo.firstName} ${grant.lastEditor.contactInfo.lastName}` : null,
                };
            });

            return transformedGrants;
        } catch (error) {
            console.error('Error fetching grants:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
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

            // Validate required fields based on schema (status is now just a string)
            if (body.monetaryAmountRequested === undefined ||
                body.nonmonetaryAmountRequested === undefined ||
                !body.allocatedFor ||
                !body.proposalDate ||
                !body.status || // status still required as per schema
                !body.firstName || // Required for contact info
                !body.lastName) { // Required for contact info
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields (firstName, lastName, monetaryAmountRequested, nonmonetaryAmountRequested, allocatedFor, proposalDate, status)',
                });
            }

            // REMOVE Enum Validation Block:
            /* if (!Object.values(Prisma.GrantStatus).includes(body.status)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid status value. Must be one of: ${Object.values(Prisma.GrantStatus).join(', ')}`,
                });
            } */
            // Optional: Add basic string validation for status if needed
            // if (!body.status.trim()) {
            //     throw createError({ statusCode: 400, statusMessage: 'Status cannot be empty' });
            // }


            // Optional: Check if contact info already exists (logic remains the same)
            if (body.email && body.email !== 'No email listed') {
                // ... (check logic) ...
            }

            // Create grant and contact info in a transaction (pass status string directly)
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create contact info first (logic remains the same)
                const contactInfo = await tx.contactInfo.create({
                    data: {
                        firstName: body.firstName,
                        lastName: body.lastName,
                        organizationName: body.organizationName || 'No organization listed',
                        email: body.email || 'No email listed',
                        phoneNumber: body.phone ? BigInt(body.phone.replace(/\D/g, '')) : null,
                        address: body.address || 'No address listed',
                        notes: body.contactNotes || null
                    }
                });

                // 2. Then create grant (pass status string directly)
                const grant = await tx.grants.create({
                    data: {
                        contactInfoID: contactInfo.contactInfoID,
                        monetaryAmountRequested: parseFloat(body.monetaryAmountRequested),
                        nonmonetaryAmountRequested: body.nonmonetaryAmountRequested,
                        monetaryAmountReceived: body.monetaryAmountReceived ? parseFloat(body.monetaryAmountReceived) : null,
                        nonmonetaryAmountReceived: body.nonmonetaryAmountReceived || null,
                        monetaryAmountSpent: body.monetaryAmountSpent ? parseFloat(body.monetaryAmountSpent) : null,
                        allocatedFor: body.allocatedFor,
                        proposalDate: body.proposalDate,
                        awardDate: body.awardDate || null,
                        startDate: body.startDate || null,
                        expirationDate: body.expirationDate || null,
                        status: body.status, // Pass the string directly
                        boardMemberID: body.boardMemberId ? parseInt(body.boardMemberId) : null,
                        lastEditorID: currentUserID, // Required
                        notes: body.grantNotes || null
                    },
                    include: {
                        contactInfo: true,
                        boardMember: { include: { contactInfo: true } },
                        lastEditor: { include: { contactInfo: true } }
                    }
                });

                // Return transformed data (structure remains the same, status is just a string)
                return {
                    id: grant.grantID,
                    organizationName: grant.contactInfo.organizationName,
                    firstName: grant.contactInfo.firstName,
                    lastName: grant.contactInfo.lastName,
                    contactName: `${grant.contactInfo.firstName} ${grant.contactInfo.lastName}`,
                    email: grant.contactInfo.email,
                    phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                    address: grant.contactInfo.address,
                    contactNotes: grant.contactInfo.notes,
                    monetaryAmountRequested: grant.monetaryAmountRequested,
                    nonmonetaryAmountRequested: grant.nonmonetaryAmountRequested,
                    monetaryAmountReceived: grant.monetaryAmountReceived,
                    nonmonetaryAmountReceived: grant.nonmonetaryAmountReceived,
                    monetaryAmountSpent: grant.monetaryAmountSpent,
                    allocatedFor: grant.allocatedFor,
                    proposalDate: grant.proposalDate,
                    awardDate: grant.awardDate,
                    startDate: grant.startDate,
                    expirationDate: grant.expirationDate,
                    status: grant.status, // String value
                    boardMemberId: grant.boardMemberID,
                    lastEditorId: grant.lastEditorID,
                    grantNotes: grant.notes,
                    boardMemberName: grant.boardMember ? `${grant.boardMember.contactInfo.firstName} ${grant.boardMember.contactInfo.lastName}` : null,
                    lastEditorName: grant.lastEditor ? `${grant.lastEditor.contactInfo.firstName} ${grant.lastEditor.contactInfo.lastName}` : null,
                };
            });

            return {
                message: 'Grant created successfully',
                grant: result
            };
        } catch (error) {
            console.error('Error creating grant:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            if (error.code === 'P2002') {
                throw createError({
                    statusCode: 409,
                    statusMessage: 'Failed to create grant. A contact record with some unique field (like email) might already exist.',
                });
            }
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to create grant: ' + error.message,
            });
        }
    }
});
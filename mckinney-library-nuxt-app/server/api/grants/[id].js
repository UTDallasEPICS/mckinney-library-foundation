// server/api/grants/[id].js
import prisma from '~/server/utils/prisma'
// import { Prisma } from '@prisma/client'; // REMOVE or comment out this line if only used for enums

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));
    // TODO: Get authenticated user ID for lastEditorID
    const currentUserID = 1; // Placeholder - Replace with actual user ID logic

    // GET: Fetch a specific grant
    if (event.node.req.method === 'GET') {
        try {
            // Fetch grant including related info (no changes needed in GET for this schema update)
            const grant = await prisma.grants.findUnique({
                where: { grantID: id },
                include: {
                    contactInfo: true,
                    boardMember: { include: { contactInfo: true } },
                    lastEditor: { include: { contactInfo: true } }
                }
            });
            if (!grant) {
                throw createError({ statusCode: 404, statusMessage: 'Grant not found' });
            }

            // Transform data (no changes needed in transformation logic itself for this update)
            const transformedGrant = {
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
            return transformedGrant;

        } catch (error) {
            console.error('Error fetching grant:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to fetch grant: ' + error.message,
            });
        }
    }

    // PUT: Update a grant
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);

            // Find the grant first (logic remains the same)
            const grant = await prisma.grants.findUnique({ where: { grantID: id } });
            if (!grant) {
                throw createError({ statusCode: 404, statusMessage: 'Grant not found' });
            }

            // REMOVE Enum Validation Block:
            /* if (body.status && !Object.values(Prisma.GrantStatus).includes(body.status)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid status value. Must be one of: ${Object.values(Prisma.GrantStatus).join(', ')}`,
                });
            } */
            // Optional: Add basic string validation for status if needed
            // if (body.status !== undefined && !body.status.trim()) {
            //     throw createError({ statusCode: 400, statusMessage: 'Status cannot be empty' });
            // }


            // Update in a transaction (pass status string directly)
            const result = await prisma.$transaction(async (tx) => {
                // 1. Prepare and Update Contact Info (logic remains the same)
                const contactInfoUpdate = {};
                if (body.firstName !== undefined) contactInfoUpdate.firstName = body.firstName;
                if (body.lastName !== undefined) contactInfoUpdate.lastName = body.lastName;
                if (body.organizationName !== undefined) contactInfoUpdate.organizationName = body.organizationName;
                if (body.email !== undefined) contactInfoUpdate.email = body.email;
                if (body.phone !== undefined) {
                    contactInfoUpdate.phoneNumber = body.phone ? BigInt(body.phone.replace(/\D/g, '')) : null;
                }
                if (body.address !== undefined) contactInfoUpdate.address = body.address;
                if (body.contactNotes !== undefined) contactInfoUpdate.notes = body.contactNotes;

                if (Object.keys(contactInfoUpdate).length > 0) {
                    await tx.contactInfo.update({
                        where: { contactInfoID: grant.contactInfoID },
                        data: contactInfoUpdate
                    });
                }

                // 2. Prepare and Update Grant fields (pass status string directly)
                const grantUpdate = {
                    lastEditorID: currentUserID // Always update the last editor
                };
                if (body.monetaryAmountRequested !== undefined) grantUpdate.monetaryAmountRequested = parseFloat(body.monetaryAmountRequested);
                if (body.nonmonetaryAmountRequested !== undefined) grantUpdate.nonmonetaryAmountRequested = body.nonmonetaryAmountRequested;
                if (body.monetaryAmountReceived !== undefined) grantUpdate.monetaryAmountReceived = parseFloat(body.monetaryAmountReceived);
                if (body.nonmonetaryAmountReceived !== undefined) grantUpdate.nonmonetaryAmountReceived = body.nonmonetaryAmountReceived;
                if (body.monetaryAmountSpent !== undefined) grantUpdate.monetaryAmountSpent = parseFloat(body.monetaryAmountSpent);
                if (body.allocatedFor !== undefined) grantUpdate.allocatedFor = body.allocatedFor;
                if (body.proposalDate !== undefined) grantUpdate.proposalDate = body.proposalDate;
                if (body.awardDate !== undefined) grantUpdate.awardDate = body.awardDate;
                if (body.startDate !== undefined) grantUpdate.startDate = body.startDate;
                if (body.expirationDate !== undefined) grantUpdate.expirationDate = body.expirationDate;
                if (body.status !== undefined) grantUpdate.status = body.status; // Pass string directly
                if (body.boardMemberId !== undefined) grantUpdate.boardMemberID = body.boardMemberId ? parseInt(body.boardMemberId) : null;
                if (body.grantNotes !== undefined) grantUpdate.notes = body.grantNotes;

                // Update Grant
                const updatedGrant = await tx.grants.update({
                    where: { grantID: id },
                    data: grantUpdate,
                    include: {
                        contactInfo: true,
                        boardMember: { include: { contactInfo: true } },
                        lastEditor: { include: { contactInfo: true } }
                    }
                });

                // Return transformed updated grant data (structure remains the same, status is just a string)
                return {
                    id: updatedGrant.grantID,
                    organizationName: updatedGrant.contactInfo.organizationName,
                    firstName: updatedGrant.contactInfo.firstName,
                    lastName: updatedGrant.contactInfo.lastName,
                    contactName: `${updatedGrant.contactInfo.firstName} ${updatedGrant.contactInfo.lastName}`,
                    email: updatedGrant.contactInfo.email,
                    phone: updatedGrant.contactInfo.phoneNumber ? String(updatedGrant.contactInfo.phoneNumber) : null,
                    address: updatedGrant.contactInfo.address,
                    contactNotes: updatedGrant.contactInfo.notes,
                    monetaryAmountRequested: updatedGrant.monetaryAmountRequested,
                    nonmonetaryAmountRequested: updatedGrant.nonmonetaryAmountRequested,
                    monetaryAmountReceived: updatedGrant.monetaryAmountReceived,
                    nonmonetaryAmountReceived: updatedGrant.nonmonetaryAmountReceived,
                    monetaryAmountSpent: updatedGrant.monetaryAmountSpent,
                    allocatedFor: updatedGrant.allocatedFor,
                    proposalDate: updatedGrant.proposalDate,
                    awardDate: updatedGrant.awardDate,
                    startDate: updatedGrant.startDate,
                    expirationDate: updatedGrant.expirationDate,
                    status: updatedGrant.status, // String value
                    boardMemberId: updatedGrant.boardMemberID,
                    lastEditorId: updatedGrant.lastEditorID,
                    grantNotes: updatedGrant.notes,
                    boardMemberName: updatedGrant.boardMember ? `${updatedGrant.boardMember.contactInfo.firstName} ${updatedGrant.boardMember.contactInfo.lastName}` : null,
                    lastEditorName: updatedGrant.lastEditor ? `${updatedGrant.lastEditor.contactInfo.firstName} ${updatedGrant.lastEditor.contactInfo.lastName}` : null,
                };
            });

            return {
                message: 'Grant updated successfully',
                grant: result
            };
        } catch (error) {
            console.error('Error updating grant:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw createError({
                    statusCode: 409,
                    statusMessage: 'Update failed: Another contact with this email already exists.',
                });
            }
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to update grant: ' + error.message,
            });
        }
    }

    // DELETE: Remove a grant (logic remains the same for this schema update)
    if (event.node.req.method === 'DELETE') {
        try {
            const grant = await prisma.grants.findUnique({
                where: { grantID: id },
                select: { grantID: true, contactInfoID: true }
            });
            if (!grant) {
                throw createError({ statusCode: 404, statusMessage: 'Grant not found' });
            }
            const contactInfoIdToDelete = grant.contactInfoID;

            await prisma.$transaction(async (tx) => {
                await tx.grants.delete({ where: { grantID: id } });
                const contactInUse = await tx.contactInfo.findUnique({
                    where: { contactInfoID: contactInfoIdToDelete },
                    select: { _count: { select: { donors: true, users: true } } }
                });
                if (contactInUse && contactInUse._count.donors === 0 && contactInUse._count.users === 0) {
                    await tx.contactInfo.delete({ where: { contactInfoID: contactInfoIdToDelete } });
                    console.log(`Deleted associated contactInfo record with ID: ${contactInfoIdToDelete}`);
                } else {
                    console.log(`ContactInfo record ${contactInfoIdToDelete} kept as it is linked elsewhere.`);
                }
            });

            return { message: 'Grant deleted successfully', id };
        } catch (error) {
            console.error('Error deleting grant:', error);
            console.error('Full error details:', JSON.stringify({ message: error.message, stack: error.stack }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to delete grant: ' + error.message,
            });
        }
    }
});
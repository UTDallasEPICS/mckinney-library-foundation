// server/api/grants/[id].js
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific grant
    if (event.node.req.method === 'GET') {
        try {
            const grant = await prisma.grants.findUnique({
                where: {
                    grantID: id
                },
                include: {
                    contactInfo: true
                }
            });

            if (!grant) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            // Transform data to match the format expected by the frontend
            const transformedGrant = {
                id: grant.grantID,
                orgName: grant.contactInfo.organizationName,
                firstName: grant.contactInfo.firstName,
                lastName: grant.contactInfo.lastName,
                email: grant.contactInfo.email,
                phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                address: grant.contactInfo.address || null,
                monetaryAmountRequested: grant.monetaryAmountRequested,
                nonmonetaryAmountRequested: grant.nonmonetaryAmountRequested,
                monetaryAmountReceived: updatedGrantData.monetaryAmountReceived,
                nonmonetaryAmountReceived: grant.nonmonetaryAmountReceived,
                monetaryAmountSpent: updatedGrantData.monetaryAmountSpent,
                allocatedFor: grant.allocatedFor,
                status: grant.status,
                proposalDate: grant.proposalDate,
                awardDate: grant.awardDate,
                startDate: grant.startDate,
                expirationDate: grant.expirationDate,
                boardMember: grant.boardMember,
                lastEditor: 1,          //Hardcoded value that we'll change after we offer support for multiple accounts
                notes: grant.notes
            };

            return transformedGrant;
        } catch (error) {
            console.error('Error fetching grant:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
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

            // Find the grant first to get the contactInfoID
            const grant = await prisma.grants.findUnique({
                where: {
                    grantID: id
                },
                include: {
                    contactInfo: true
                }
            });

            if (!grant) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            // Update in a transaction to ensure both grant and contact info are updated together
            const updatedGrant = await prisma.$transaction(async (tx) => {
                // Prepare updates for contact info
                const contactInfoUpdate = {};

                if (body.firstName !== undefined) contactInfoUpdate.firstName = body.firstName;
                if (body.lastName !== undefined) contactInfoUpdate.lastName = body.lastName;
                if (body.email !== undefined) contactInfoUpdate.email = body.email;
                // Skip phone number for now to avoid conversion issues
                if (body.address !== undefined) contactInfoUpdate.address = body.address;
                if (body.organization !== undefined || body.name !== undefined) {
                    contactInfoUpdate.organizationName = body.organization || body.name;
                }
                if (body.notes !== undefined) contactInfoUpdate.notes = body.notes;

                // Update contact info if there are any changes
                if (Object.keys(contactInfoUpdate).length > 0) {
                    await tx.contactInfo.update({
                        where: {
                            contactInfoID: grant.contactInfoID
                        },
                        data: contactInfoUpdate
                    });
                }

                // Prepare updates for grant
                const grantUpdate = {};

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
                if (body.status !== undefined) grantUpdate.status = body.status;
                //if (body.boardMember !== undefined) grantUpdate.boardMember = body.boardMember;
                if (body.notes !== undefined) grantUpdate.notes = body.notes;

                // Update grant if there are any changes
                let updatedGrantData = grant;
                if (Object.keys(grantUpdate).length > 0) {
                    updatedGrantData = await tx.grants.update({
                        where: {
                            grantID: id
                        },
                        data: grantUpdate,
                        include: {
                            contactInfo: true
                        }
                    });
                }

                // Return transformed grant data
                return {
                    id: updatedGrantData.grantID,
                    orgName: updatedGrantData.contactInfo.organizationName || 'Unnamed Grant',
                    firstName: updatedGrantData.contactInfo.firstName,
                    lastName: updatedGrantData.contactInfo.lastName,
                    email: updatedGrantData.contactInfo.email,
                    phone: updatedGrantData.contactInfo.phoneNumber ? String(updatedGrantData.contactInfo.phoneNumber) : null,
                    address: updatedGrantData.contactInfo.address,
                    monetaryAmountRequested: updatedGrantData.monetaryAmountRequested,
                    nonmonetaryAmountRequested: updatedGrantData.nonmonetaryAmountRequested,
                    monetaryAmountReceived: updatedGrantData.monetaryAmountReceived,
                    monetaryAmountSpent: updatedGrantData.monetaryAmountSpent,
                    allocatedFor: updatedGrantData.allocatedFor,
                    status: updatedGrantData.status,
                    proposalDate: updatedGrantData.proposalDate,
                    awardDate: updatedGrantData.awardDate,
                    startDate: updatedGrantData.startDate,
                    expirationDate: updatedGrantData.expirationDate,
                    boardMember: updatedGrantData.boardMember,
                    lastEditor: 1,          //Hardcoded value that we'll change after we offer support for multiple accounts
                    notes: updatedGrantData.notes
                };
            });

            return {
                message: 'Grant updated successfully',
                grant: updatedGrant
            };
        } catch (error) {
            console.error('Error updating grant:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to update grant: ' + error.message,
            });
        }
    }

    // DELETE: Remove a grant
    if (event.node.req.method === 'DELETE') {
        try {
            // Find the grant first to get the contactInfoID
            const grant = await prisma.grants.findUnique({
                where: {
                    grantID: id
                }
            });

            if (!grant) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            // Delete in a transaction
            await prisma.$transaction(async (tx) => {
                // First delete the grant
                await tx.grants.delete({
                    where: {
                        grantID: id
                    }
                });

                // Then delete the associated contact info
                // Note: Only do this if contactInfo is not referenced by other entities
                // Check if this contactInfo is used elsewhere first
                const donorUsage = await tx.donors.findFirst({
                    where: {
                        contactInfoID: grant.contactInfoID
                    }
                });

                if (!donorUsage) {
                    const userUsage = await tx.users.findFirst({
                        where: {
                            contactInfoID: grant.contactInfoID
                        }
                    });

                    if (!userUsage) {
                        await tx.contactInfo.delete({
                            where: {
                                contactInfoID: grant.contactInfoID
                            }
                        });
                    }
                }
            });

            return {
                message: 'Grant deleted successfully',
                id
            };
        } catch (error) {
            console.error('Error deleting grant:', error);
            console.error('Full error details:', JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: 'Failed to delete grant: ' + error.message,
            });
        }
    }
});
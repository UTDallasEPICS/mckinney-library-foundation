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
                name: grant.contactInfo.organizationName || 'Unnamed Grant',
                contactName: `${grant.contactInfo.firstName} ${grant.contactInfo.lastName}`,
                firstName: grant.contactInfo.firstName,
                lastName: grant.contactInfo.lastName,
                email: grant.contactInfo.email,
                phone: grant.contactInfo.phoneNumber ? String(grant.contactInfo.phoneNumber) : null,
                address: grant.contactInfo.address || null,
                organization: grant.contactInfo.organizationName || null,
                amount: grant.value,
                date: grant.date,
                allocatedFor: grant.allocatedFor,
                status: 'Active', // Default since not in schema
                boardMember: false, // Default since not in schema
                link: null, // Default since not in schema
                notes: grant.notes || null
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
                if (body.contactName !== undefined) {
                    const nameParts = body.contactName.split(' ');
                    contactInfoUpdate.firstName = nameParts[0] || 'Anonymous';
                    contactInfoUpdate.lastName = nameParts.slice(1).join(' ') || 'Anonymous';
                }
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

                if (body.amount !== undefined) grantUpdate.value = parseFloat(body.amount);
                if (body.allocatedFor !== undefined) grantUpdate.allocatedFor = body.allocatedFor;
                if (body.date !== undefined) grantUpdate.date = body.date;
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
                    name: updatedGrantData.contactInfo.organizationName || 'Unnamed Grant',
                    contactName: `${updatedGrantData.contactInfo.firstName} ${updatedGrantData.contactInfo.lastName}`,
                    firstName: updatedGrantData.contactInfo.firstName,
                    lastName: updatedGrantData.contactInfo.lastName,
                    email: updatedGrantData.contactInfo.email,
                    phone: updatedGrantData.contactInfo.phoneNumber ? String(updatedGrantData.contactInfo.phoneNumber) : null,
                    address: updatedGrantData.contactInfo.address,
                    organization: updatedGrantData.contactInfo.organizationName,
                    amount: updatedGrantData.value,
                    date: updatedGrantData.date,
                    allocatedFor: updatedGrantData.allocatedFor,
                    status: body.status || 'Active',
                    boardMember: body.boardMember || false,
                    link: body.link || null,
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
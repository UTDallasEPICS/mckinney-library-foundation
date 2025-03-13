// server/api/grants/[id].js
import { mockGrants } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific grant
    if (event.node.req.method === 'GET') {
        try {
            const grant = mockGrants.find(g => g.id === id);

            if (!grant) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            return grant;
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to fetch grant',
            });
        }
    }

    // PUT: Update a grant
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);
            const grantIndex = mockGrants.findIndex(g => g.id === id);

            if (grantIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            // Update the grant
            mockGrants[grantIndex] = {
                ...mockGrants[grantIndex],
                ...body,
                id: id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            return {
                message: 'Grant updated successfully',
                grant: mockGrants[grantIndex]
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to update grant',
            });
        }
    }

    // DELETE: Remove a grant
    if (event.node.req.method === 'DELETE') {
        try {
            const grantIndex = mockGrants.findIndex(g => g.id === id);

            if (grantIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Grant not found',
                });
            }

            // Remove the grant from the array
            const deleted = mockGrants.splice(grantIndex, 1)[0];

            console.log(`Deleted grant with ID: ${id}`);

            return {
                message: 'Grant deleted successfully',
                id: id,
                deleted: deleted
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete grant',
            });
        }
    }
});
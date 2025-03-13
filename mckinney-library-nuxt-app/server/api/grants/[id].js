// server/api/grants/[id].js
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    // GET: Fetch a specific grant
    if (event.node.req.method === 'GET') {
        try {
            // Replace with your actual database query
            const grant = {
                id: parseInt(id),
                name: 'Community Literacy',
                amount: 5000,
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                status: 'Active'
            };

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

            // Here you would update your database
            // For example: const updatedGrant = await db.grants.update(id, body);

            // Mock response with updated grant
            const updatedGrant = {
                id: parseInt(id),
                ...body,
                updatedAt: new Date().toISOString()
            };

            return {
                message: 'Grant updated successfully',
                grant: updatedGrant
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
            // Here you would delete from your database
            // For example: await db.grants.delete(id);

            return {
                message: 'Grant deleted successfully',
                id: parseInt(id)
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete grant',
            });
        }
    }
});
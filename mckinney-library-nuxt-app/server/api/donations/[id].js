// server/api/donations/[id].js
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    // GET: Fetch a specific donation
    if (event.node.req.method === 'GET') {
        try {
            // Replace with your actual database query
            const donation = {
                id: parseInt(id),
                donor: 'John Smith',
                amount: 100,
                date: '2025-03-01',
                category: 'Books'
            };

            if (!donation) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            return donation;
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to fetch donation',
            });
        }
    }

    // PUT: Update a donation
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);

            // Here you would update your database
            // For example: const updatedDonation = await db.donations.update(id, body);

            // Mock response with updated donation
            const updatedDonation = {
                id: parseInt(id),
                ...body,
                updatedAt: new Date().toISOString()
            };

            return {
                message: 'Donation updated successfully',
                donation: updatedDonation
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to update donation',
            });
        }
    }

    // DELETE: Remove a donation
    if (event.node.req.method === 'DELETE') {
        try {
            // Here you would delete from your database
            // For example: await db.donations.delete(id);

            return {
                message: 'Donation deleted successfully',
                id: parseInt(id)
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete donation',
            });
        }
    }
});
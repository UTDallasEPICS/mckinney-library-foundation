// server/api/grants/index.js
export default defineEventHandler(async (event) => {
    // GET: Fetch all grants
    if (event.node.req.method === 'GET') {
        try {
            // Replace with your actual database query
            const grants = [
                { id: 1, name: 'Community Literacy', amount: 5000, startDate: '2025-01-01', endDate: '2025-12-31', status: 'Active' },
                { id: 2, name: 'Technology Fund', amount: 7500, startDate: '2025-02-15', endDate: '2025-08-15', status: 'Pending' }
            ];

            return grants;
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch grants',
            });
        }
    }

    // POST: Add a new grant
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (!body.name || !body.amount || !body.startDate || !body.endDate) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields',
                });
            }

            // Here you would add to your database
            // For example: const newGrant = await db.grants.create(body);

            // Mock response with created grant
            const newGrant = {
                id: Math.floor(Math.random() * 1000),
                ...body,
                status: body.status || 'Pending',
                createdAt: new Date().toISOString()
            };

            return {
                message: 'Grant added successfully',
                grant: newGrant
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to add grant',
            });
        }
    }
});
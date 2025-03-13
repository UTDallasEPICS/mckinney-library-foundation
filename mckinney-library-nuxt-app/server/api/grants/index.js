// server/api/grants/index.js
import { mockGrants } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    // GET: Fetch all grants
    if (event.node.req.method === 'GET') {
        try {
            return mockGrants;
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

            // Create a new grant with incremental ID
            const newId = mockGrants.length > 0
                ? Math.max(...mockGrants.map(g => g.id)) + 1
                : 1;

            const newGrant = {
                id: newId,
                ...body,
                amount: parseFloat(body.amount),
                status: body.status || 'Pending',
                createdAt: new Date().toISOString()
            };

            // Add to mock database
            mockGrants.push(newGrant);

            console.log(`Added new grant with ID: ${newId}`);

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
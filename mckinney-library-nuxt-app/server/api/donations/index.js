// server/api/donations/index.js
// Share the same mock database with the [id].js file
import { mockDonations } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    // GET: Fetch all donations
    if (event.node.req.method === 'GET') {
        try {
            return mockDonations;
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch donations',
            });
        }
    }

    // POST: Add a new donation
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (!body.donor || !body.amount || !body.date) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields',
                });
            }

            // Create a new donation with incremental ID
            const newId = mockDonations.length > 0
                ? Math.max(...mockDonations.map(d => d.id)) + 1
                : 1;

            const newDonation = {
                id: newId,
                ...body,
                amount: parseFloat(body.amount),
                createdAt: new Date().toISOString()
            };

            // Add to mock database
            mockDonations.push(newDonation);

            console.log(`Added new donation with ID: ${newId}`);

            return {
                message: 'Donation added successfully',
                donation: newDonation
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to add donation',
            });
        }
    }
});
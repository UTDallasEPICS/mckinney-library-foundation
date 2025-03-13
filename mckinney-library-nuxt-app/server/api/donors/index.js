// server/api/donors/index.js
import { mockDonors } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    // GET: Fetch all donors
    if (event.node.req.method === 'GET') {
        try {
            return mockDonors;
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch donors',
            });
        }
    }

    // POST: Add a new donor
    if (event.node.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // Validate required fields
            if (!body.name || !body.email) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Missing required fields',
                });
            }

            // Create a new donor with incremental ID
            const newId = mockDonors.length > 0
                ? Math.max(...mockDonors.map(d => d.id)) + 1
                : 1;

            const newDonor = {
                id: newId,
                ...body,
                totalDonations: body.totalDonations || 0,
                lastDonationDate: body.lastDonationDate || new Date().toISOString().split('T')[0],
                status: body.status || 'Active',
                createdAt: new Date().toISOString()
            };

            // Add to mock database
            mockDonors.push(newDonor);

            console.log(`Added new donor with ID: ${newId}`);

            return {
                message: 'Donor added successfully',
                donor: newDonor
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to add donor',
            });
        }
    }
});
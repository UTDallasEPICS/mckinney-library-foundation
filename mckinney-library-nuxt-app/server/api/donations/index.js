// server/api/donations/index.js
export default defineEventHandler(async (event) => {
    // GET: Fetch all donations
    if (event.node.req.method === 'GET') {
        try {
            // Sample data
            const donations = [
                { id: 1, donor: 'John Smith', amount: 100, date: '2025-03-01', category: 'Books' },
                { id: 2, donor: 'Jane Doe', amount: 250, date: '2025-03-05', category: 'Programs' }
            ];

            return donations;
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

            // Here you would add to your database
            // For example: const newDonation = await db.donations.create(body);

            // Mock response with created donation
            const newDonation = {
                id: Math.floor(Math.random() * 1000),
                ...body,
                createdAt: new Date().toISOString()
            };

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
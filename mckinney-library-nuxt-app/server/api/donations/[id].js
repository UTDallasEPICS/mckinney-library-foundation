// server/api/donations/[id].js
import { mockDonations } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific donation
    if (event.node.req.method === 'GET') {
        try {
            const donation = mockDonations.find(d => d.id === id);

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
            const donationIndex = mockDonations.findIndex(d => d.id === id);

            if (donationIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            // Update the donation
            mockDonations[donationIndex] = {
                ...mockDonations[donationIndex],
                ...body,
                id: id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            return {
                message: 'Donation updated successfully',
                donation: mockDonations[donationIndex]
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
            const donationIndex = mockDonations.findIndex(d => d.id === id);

            if (donationIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donation not found',
                });
            }

            // Remove the donation from the array
            const deleted = mockDonations.splice(donationIndex, 1)[0];

            console.log(`Deleted donation with ID: ${id}`);

            return {
                message: 'Donation deleted successfully',
                id: id,
                deleted: deleted
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete donation',
            });
        }
    }
});
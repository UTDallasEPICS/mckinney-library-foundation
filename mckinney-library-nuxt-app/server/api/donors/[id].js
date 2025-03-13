// server/api/donors/[id].js
import { mockDonors } from '~/server/data/mockData';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id'));

    // GET: Fetch a specific donor
    if (event.node.req.method === 'GET') {
        try {
            const donor = mockDonors.find(d => d.id === id);

            if (!donor) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            return donor;
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to fetch donor',
            });
        }
    }

    // PUT: Update a donor
    if (event.node.req.method === 'PUT') {
        try {
            const body = await readBody(event);
            const donorIndex = mockDonors.findIndex(d => d.id === id);

            if (donorIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            // Update the donor
            mockDonors[donorIndex] = {
                ...mockDonors[donorIndex],
                ...body,
                id: id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            return {
                message: 'Donor updated successfully',
                donor: mockDonors[donorIndex]
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to update donor',
            });
        }
    }

    // DELETE: Remove a donor
    if (event.node.req.method === 'DELETE') {
        try {
            const donorIndex = mockDonors.findIndex(d => d.id === id);

            if (donorIndex === -1) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Donor not found',
                });
            }

            // Remove the donor from the array
            const deleted = mockDonors.splice(donorIndex, 1)[0];

            console.log(`Deleted donor with ID: ${id}`);

            return {
                message: 'Donor deleted successfully',
                id: id,
                deleted: deleted
            };
        } catch (error) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Failed to delete donor',
            });
        }
    }
});
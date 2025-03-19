// composables/useGrants.js
import { ref } from 'vue';

export const useGrants = () => {
    const grants = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all grants
    const fetchGrants = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the standard fetch API
            const response = await fetch('/api/grants');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Process the grants data to include additional fields
            grants.value = data.map(grant => ({
                ...grant,
                boardMember: grant.boardMember || false,
                link: grant.link || null
            }));
        } catch (err) {
            error.value = err.message || 'Failed to fetch grants';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch a single grant by ID
    const fetchGrant = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/grants/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const grant = await response.json();

            // Add additional fields if they don't exist
            return {
                ...grant,
                boardMember: grant.boardMember || false,
                link: grant.link || null
            };
        } catch (err) {
            error.value = err.message || `Failed to fetch grant ${id}`;
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new grant
    const addGrant = async (grant) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Validate required fields
            if (!grant.amount || !grant.allocatedFor) {
                throw new Error('Grant amount and allocation purpose are required');
            }

            // Prepare grant data for API
            const grantData = {
                ...grant,
                // Convert amount to number if it's a string
                amount: typeof grant.amount === 'string' ? parseFloat(grant.amount) : grant.amount
            };

            // Transform the keys to match the backend API expectations
            const apiGrant = {
                name: grantData.name,
                contactName: grantData.contactName,
                email: grantData.email,
                phone: grantData.phone,
                amount: grantData.amount,
                allocatedFor: grantData.allocatedFor,
                date: grantData.date,
                status: grantData.status,
                notes: grantData.notes,
                boardMember: grantData.boardMember,
                link: grantData.link
            };

            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiGrant)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to add grant';
            console.error('Grant submission error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a grant
    const updateGrant = async (id, grantData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Prepare updated grant data
            const updatedGrant = {
                ...grantData,
                // Convert amount to number if it's a string
                amount: typeof grantData.amount === 'string' ? parseFloat(grantData.amount) : grantData.amount
            };

            const response = await fetch(`/api/grants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedGrant)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to update grant';
            console.error('Update error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Delete a grant
    const deleteGrant = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/grants/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to delete grant';
            console.error('Deletion error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Toggle grant status
    const toggleGrantStatus = async (id, currentStatus) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Determine new status based on current status
            let newStatus;
            switch (currentStatus) {
                case 'Active':
                    newStatus = 'Expired';
                    break;
                case 'Pending':
                    newStatus = 'Active';
                    break;
                case 'Expired':
                case 'Rejected':
                    newStatus = 'Active';
                    break;
                default:
                    newStatus = 'Pending';
            }

            return updateGrant(id, { status: newStatus });
        } catch (err) {
            error.value = err.message || `Failed to toggle status for grant ${id}`;
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        grants,
        isLoading,
        error,
        fetchGrants,
        fetchGrant,
        addGrant,
        updateGrant,
        deleteGrant,
        toggleGrantStatus
    };
};
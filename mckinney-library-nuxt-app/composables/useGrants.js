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
            // Use the standard fetch API instead of $fetch
            const response = await fetch('/api/grants');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            grants.value = await response.json();
        } catch (err) {
            error.value = err.message || 'Failed to fetch grants';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new grant
    const addGrant = async (grant) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(grant)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to add grant';
            console.error(err);
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to delete grant';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a grant
    const updateGrant = async (id, grant) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/grants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(grant)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the grants list
            await fetchGrants();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to update grant';
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
        addGrant,
        deleteGrant,
        updateGrant
    };
};
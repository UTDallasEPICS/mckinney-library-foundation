// composables/useGrants.js
export const useGrants = () => {
    const { $fetch } = useNuxtApp();

    const grants = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all grants
    const fetchGrants = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            grants.value = await $fetch('/api/grants');
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
            const response = await $fetch('/api/grants', {
                method: 'POST',
                body: grant
            });

            // Refresh the grants list
            await fetchGrants();

            return response;
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
            const response = await $fetch(`/api/grants/${id}`, {
                method: 'DELETE'
            });

            // Refresh the grants list
            await fetchGrants();

            return response;
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
            const response = await $fetch(`/api/grants/${id}`, {
                method: 'PUT',
                body: grant
            });

            // Refresh the grants list
            await fetchGrants();

            return response;
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
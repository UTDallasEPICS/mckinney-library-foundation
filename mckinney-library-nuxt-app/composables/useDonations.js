// composables/useDonations.js
export const useDonations = () => {
    const { $fetch } = useNuxtApp();

    const donations = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all donations
    const fetchDonations = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            donations.value = await $fetch('/api/donations');
        } catch (err) {
            error.value = err.message || 'Failed to fetch donations';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new donation
    const addDonation = async (donation) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await $fetch('/api/donations', {
                method: 'POST',
                body: donation
            });

            // Refresh the donations list
            await fetchDonations();

            return response;
        } catch (err) {
            error.value = err.message || 'Failed to add donation';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Delete a donation
    const deleteDonation = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await $fetch(`/api/donations/${id}`, {
                method: 'DELETE'
            });

            // Refresh the donations list
            await fetchDonations();

            return response;
        } catch (err) {
            error.value = err.message || 'Failed to delete donation';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a donation
    const updateDonation = async (id, donation) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await $fetch(`/api/donations/${id}`, {
                method: 'PUT',
                body: donation
            });

            // Refresh the donations list
            await fetchDonations();

            return response;
        } catch (err) {
            error.value = err.message || 'Failed to update donation';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        donations,
        isLoading,
        error,
        fetchDonations,
        addDonation,
        deleteDonation,
        updateDonation
    };
};
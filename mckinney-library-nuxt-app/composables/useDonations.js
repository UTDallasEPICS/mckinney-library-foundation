// composables/useDonations.js
import { ref } from 'vue';

export const useDonations = () => {
    const donations = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all donations
    const fetchDonations = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the fetch API directly instead of $fetch
            const response = await fetch('/api/donations');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            donations.value = await response.json();
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
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donation)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donations list
            await fetchDonations();

            return result;
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
            const response = await fetch(`/api/donations/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donations list
            await fetchDonations();

            return result;
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
            const response = await fetch(`/api/donations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donation)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donations list
            await fetchDonations();

            return result;
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
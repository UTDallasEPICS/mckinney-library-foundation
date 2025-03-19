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
            // Use the standard fetch API
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
            // Make sure required fields are present according to your Prisma schema
            if (!donation.amount) {
                throw new Error('Donation amount is required');
            }

            if (!donation.donationMethod) {
                // Default if not provided
                donation.donationMethod = 'Other';
            }

            if (!donation.allocatedFor && donation.category) {
                // Use category as allocatedFor if provided
                donation.allocatedFor = donation.category;
            } else if (!donation.allocatedFor) {
                // Default if not provided
                donation.allocatedFor = 'General';
            }

            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donation)
            });

            // Check if the request was successful
            if (!response.ok) {
                // Try to get more details about the error
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donations list
            await fetchDonations();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to add donation';
            console.error('Donation submission error:', err);
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
            // Make sure required fields are present for update
            if (donation.amount === undefined && donation.donationMethod === undefined &&
                donation.allocatedFor === undefined && donation.date === undefined) {
                throw new Error('At least one field must be updated');
            }

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
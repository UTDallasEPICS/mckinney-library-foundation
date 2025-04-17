// composables/useDonations.js
import { ref } from 'vue';

// REMOVE Enum constant definition:
// const validDonationStatuses = ['PENDING', 'RECEIVED', 'DECLINED']; 

export const useDonations = () => {
    const donations = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all donations 
    const fetchDonations = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch('/api/donations');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            donations.value = await response.json(); // Data now has status as string
        } catch (err) {
            error.value = err.message || 'Failed to fetch donations';
            console.error('fetchDonations Error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new donation
    const addDonation = async (newDonationData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation ---
            // Required fields check (status is just a string now)
            if (newDonationData.monetaryAmount === undefined || newDonationData.monetaryAmount === null ||
                newDonationData.nonmonetaryAmount === undefined ||
                newDonationData.amountSpent === undefined || newDonationData.amountSpent === null ||
                !newDonationData.donationMethod ||
                !newDonationData.allocatedFor ||
                !newDonationData.status) { // Still required, but just needs to be a non-empty string maybe
                throw new Error('Missing required fields: monetaryAmount, nonmonetaryAmount, amountSpent, donationMethod, allocatedFor, status are required.');
            }

            // REMOVE Enum Validation Block:
            /* if (!validDonationStatuses.includes(newDonationData.status)) {
                throw new Error(`Invalid status value. Must be one of: ${validDonationStatuses.join(', ')}`);
            } */
            // Optional: Add basic string validation if needed
            // if (!newDonationData.status.trim()) {
            //     throw new Error('Status cannot be empty');
            // }
            // --- End Frontend Validation ---


            // Send data matching the API structure (status sent as string)
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Required fields
                    monetaryAmount: parseFloat(newDonationData.monetaryAmount) || 0,
                    nonmonetaryAmount: newDonationData.nonmonetaryAmount || '',
                    amountSpent: parseFloat(newDonationData.amountSpent) || 0,
                    donationMethod: newDonationData.donationMethod,
                    allocatedFor: newDonationData.allocatedFor,
                    status: newDonationData.status, // Pass string directly
                    // Optional fields
                    donorId: newDonationData.donorId ? parseInt(newDonationData.donorId) : null,
                    donorDetails: newDonationData.donorDetails || null,
                    boardMemberId: newDonationData.boardMemberId ? parseInt(newDonationData.boardMemberId) : null,
                    date: newDonationData.date || null,
                    lastEditor: 1, 
                    notes: newDonationData.notes || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            await fetchDonations();
            return result;

        } catch (err) {
            error.value = err.message || 'Failed to add donation';
            console.error('addDonation Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Delete a donation 
    const deleteDonation = async (id) => {
        // ... (no changes needed here for status update) ...
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            await fetchDonations(); // Refresh list
            return result;
        } catch (err) {
            error.value = err.message || 'Failed to delete donation';
            console.error('deleteDonation Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a donation
    const updateDonation = async (id, updateData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation ---
            const validUpdateKeys = ['monetaryAmount', 'nonmonetaryAmount', 'amountSpent', 'donationMethod', 'allocatedFor', 'date', 'status', 'boardMemberId', 'notes', 'donorId'];
            const updateKeys = Object.keys(updateData);
            const isValidUpdate = updateKeys.some(key => validUpdateKeys.includes(key) && updateData[key] !== undefined);
            if (!isValidUpdate) {
                throw new Error('No valid fields provided for update.');
            }

            // REMOVE Enum Validation Block:
            /* if (updateData.status && !validDonationStatuses.includes(updateData.status)) {
                throw new Error(`Invalid status value. Must be one of: ${validDonationStatuses.join(', ')}`);
            } */
            // Optional: Add basic string validation for status if included
            // if (updateData.status !== undefined && !updateData.status.trim()) {
            //     throw new Error('Status cannot be empty');
            // }
            // --- End Frontend Validation ---

            // Send data (status sent as string)
            const response = await fetch(`/api/donations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            await fetchDonations();
            return result;

        } catch (err) {
            error.value = err.message || 'Failed to update donation';
            console.error('updateDonation Error:', err);
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
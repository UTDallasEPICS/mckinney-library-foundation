// composables/useDonors.js
import { ref } from 'vue';

export const useDonors = () => {
    const donors = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all donors
    const fetchDonors = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the standard fetch API
            const response = await fetch('/api/donors');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            donors.value = await response.json();
        } catch (err) {
            error.value = err.message || 'Failed to fetch donors';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch a single donor by ID
    const fetchDonor = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/donors/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            error.value = err.message || `Failed to fetch donor ${id}`;
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new donor
    const addDonor = async (donor) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Validate required fields
            if (!donor.name) {
                throw new Error('Donor name is required');
            }

            const response = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donor)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donors list
            await fetchDonors();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to add donor';
            console.error('Donor submission error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a donor
    const updateDonor = async (id, donorData) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/donors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donorData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donors list
            await fetchDonors();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to update donor';
            console.error('Update error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Delete a donor
    const deleteDonor = async (id) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(`/api/donors/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Refresh the donors list
            await fetchDonors();

            return result;
        } catch (err) {
            error.value = err.message || 'Failed to delete donor';
            console.error('Deletion error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Toggle user status (Active/Frozen)
    const toggleDonorStatus = async (id, currentStatus) => {
        isLoading.value = true;
        error.value = null;

        try {
            // This could be handled differently based on your needs
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            return updateDonor(id, { status: newStatus });
        } catch (err) {
            error.value = err.message || `Failed to toggle status for donor ${id}`;
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        donors,
        isLoading,
        error,
        fetchDonors,
        fetchDonor,
        addDonor,
        updateDonor,
        deleteDonor,
        toggleDonorStatus
    };
};
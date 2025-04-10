// composables/useGrants.js
import { ref } from 'vue';

// REMOVE Enum constant definition:
// const validGrantStatuses = ['PENDING', 'ACTIVE', 'EXPIRED', 'DECLINED', 'REJECTED'];

export const useGrants = () => {
    const grants = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all grants
    const fetchGrants = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch('/api/grants');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            grants.value = await response.json(); // Data now has status as string
        } catch (err) {
            error.value = err.message || 'Failed to fetch grants';
            console.error('fetchGrants Error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch a single grant by ID
    const fetchGrant = async (id) => {
        // ... (no changes needed here for status update) ...
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch(`/api/grants/${id}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            return await response.json(); // Data now has status as string
        } catch (err) {
            error.value = err.message || `Failed to fetch grant ${id}`;
            console.error('fetchGrant Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new grant
    const addGrant = async (newGrantData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation ---
            // Required fields check (status is just a string now)
            if (!newGrantData.firstName || !newGrantData.lastName ||
                newGrantData.monetaryAmountRequested === undefined || newGrantData.monetaryAmountRequested === null ||
                newGrantData.nonmonetaryAmountRequested === undefined ||
                !newGrantData.allocatedFor ||
                !newGrantData.proposalDate ||
                !newGrantData.status) { // Still required, but just needs to be non-empty string maybe
                throw new Error('Missing required fields: firstName, lastName, monetaryAmountRequested, nonmonetaryAmountRequested, allocatedFor, proposalDate, status are required.');
            }

            // REMOVE Enum Validation Block:
            /* if (!validGrantStatuses.includes(newGrantData.status)) {
                throw new Error(`Invalid status value. Must be one of: ${validGrantStatuses.join(', ')}`);
            } */
            // Optional: Add basic string validation if needed
            // if (!newGrantData.status.trim()) {
            //     throw new Error('Status cannot be empty');
            // }
            // --- End Frontend Validation ---

            // Send data (status sent as string)
            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Contact Info fields
                    firstName: newGrantData.firstName,
                    lastName: newGrantData.lastName,
                    organizationName: newGrantData.organizationName || null,
                    email: newGrantData.email || null,
                    phone: newGrantData.phone || null,
                    address: newGrantData.address || null,
                    contactNotes: newGrantData.contactNotes || null,
                    // Grant fields (Required)
                    monetaryAmountRequested: parseFloat(newGrantData.monetaryAmountRequested) || 0,
                    nonmonetaryAmountRequested: newGrantData.nonmonetaryAmountRequested || '',
                    allocatedFor: newGrantData.allocatedFor,
                    proposalDate: newGrantData.proposalDate,
                    status: newGrantData.status, // Pass string directly
                    // Grant fields (Optional)
                    monetaryAmountReceived: newGrantData.monetaryAmountReceived ? parseFloat(newGrantData.monetaryAmountReceived) : null,
                    nonmonetaryAmountReceived: newGrantData.nonmonetaryAmountReceived || null,
                    monetaryAmountSpent: newGrantData.monetaryAmountSpent ? parseFloat(newGrantData.monetaryAmountSpent) : null,
                    awardDate: newGrantData.awardDate || null,
                    startDate: newGrantData.startDate || null,
                    expirationDate: newGrantData.expirationDate || null,
                    boardMemberId: newGrantData.boardMemberId ? parseInt(newGrantData.boardMemberId) : null,
                    grantNotes: newGrantData.grantNotes || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            await fetchGrants();
            return result;

        } catch (err) {
            error.value = err.message || 'Failed to add grant';
            console.error('addGrant Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Update a grant
    const updateGrant = async (id, updateData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation ---
            const validUpdateKeys = [ /* ... all valid keys ... */ 'status'];
            const updateKeys = Object.keys(updateData);
            const isValidUpdate = updateKeys.some(key => validUpdateKeys.includes(key) && updateData[key] !== undefined);
            if (!isValidUpdate) {
                throw new Error('No valid fields provided for update.');
            }

            // REMOVE Enum Validation Block:
            /* if (updateData.status && !validGrantStatuses.includes(updateData.status)) {
                 throw new Error(`Invalid status value. Must be one of: ${validGrantStatuses.join(', ')}`);
             } */
            // Optional: Add basic string validation for status if included
            // if (updateData.status !== undefined && !updateData.status.trim()) {
            //     throw new Error('Status cannot be empty');
            // }
            // --- End Frontend Validation ---

            // Send data (status sent as string)
            const response = await fetch(`/api/grants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            await fetchGrants();
            return result;

        } catch (err) {
            error.value = err.message || 'Failed to update grant';
            console.error('updateGrant Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Delete a grant
    const deleteGrant = async (id) => {
        // ... (no changes needed here for status update) ...
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch(`/api/grants/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            await fetchGrants(); // Refresh list
            return result;
        } catch (err) {
            error.value = err.message || 'Failed to delete grant';
            console.error('deleteGrant Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Set grant status (now just uses strings)
    const setGrantStatus = async (id, newStatus) => {
        isLoading.value = true;
        error.value = null;
        try {
            // Basic validation that status is a non-empty string
            if (!newStatus || !String(newStatus).trim()) {
                throw new Error(`Invalid status: Status cannot be empty`);
            }
            // Call updateGrant with only the status field
            return await updateGrant(id, { status: String(newStatus).trim() }); // Ensure it's a string
        } catch (err) {
            error.value = err.message || `Failed to set status for grant ${id}`;
            console.error('setGrantStatus Error:', err);
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
        setGrantStatus
    };
};
// composables/useGrants.js
import { ref } from 'vue';

// Define valid statuses locally (matches GrantStatus enum) - REMOVED as status is now string
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
            // Data directly from API reflects the schema (status is string)
            // REMOVED manual mapping: grants.value = data.map(...)
            grants.value = await response.json();
        } catch (err) {
            error.value = err.message || 'Failed to fetch grants';
            console.error('fetchGrants Error:', err);
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            // Data directly from API reflects the schema (status is string)
            // REMOVED manual mapping: return { ...grant, boardMember: ... }
            return await response.json();
        } catch (err) {
            error.value = err.message || `Failed to fetch grant ${id}`;
            console.error('fetchGrant Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Add a new grant
    // Expects 'newGrantData' containing fields matching API/schema
    const addGrant = async (newGrantData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation (align with API requirements) ---
            if (!newGrantData.firstName || !newGrantData.lastName ||
                newGrantData.monetaryAmountRequested === undefined || newGrantData.monetaryAmountRequested === null ||
                newGrantData.nonmonetaryAmountRequested === undefined ||
                !newGrantData.allocatedFor ||
                !newGrantData.proposalDate ||
                !newGrantData.status) {
                throw new Error('Missing required fields: firstName, lastName, monetaryAmountRequested, nonmonetaryAmountRequested, allocatedFor, proposalDate, status are required.');
            }
            // REMOVED Enum validation block
            // --- End Frontend Validation ---

            // REMOVED intermediate 'grantData' and 'apiGrant' objects
            // Directly prepare the body from newGrantData using correct field names

            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Body includes all fields expected by the API, directly from input object
                body: JSON.stringify({
                    // Contact Info fields
                    firstName: newGrantData.firstName,
                    lastName: newGrantData.lastName,
                    // Use 'organizationName' matching schema/API, not 'orgName'
                    organizationName: newGrantData.organizationName || newGrantData.orgName || null,
                    email: newGrantData.email || null,
                    phone: newGrantData.phone || null,
                    address: newGrantData.address || null,
                    contactNotes: newGrantData.contactNotes || null,
                    // Grant fields (Required)
                    monetaryAmountRequested: parseFloat(newGrantData.monetaryAmountRequested) || 0,
                    nonmonetaryAmountRequested: newGrantData.nonmonetaryAmountRequested || '',
                    allocatedFor: newGrantData.allocatedFor,
                    proposalDate: newGrantData.proposalDate,
                    status: String(newGrantData.status || ''), // Pass string directly
                    // Grant fields (Optional)
                    monetaryAmountReceived: newGrantData.monetaryAmountReceived ? parseFloat(newGrantData.monetaryAmountReceived) : null,
                    nonmonetaryAmountReceived: newGrantData.nonmonetaryAmountReceived || null,
                    monetaryAmountSpent: newGrantData.monetaryAmountSpent ? parseFloat(newGrantData.monetaryAmountSpent) : null,
                    awardDate: newGrantData.awardDate || null,
                    startDate: newGrantData.startDate || null,
                    expirationDate: newGrantData.expirationDate || null,
                    // Use 'boardMemberId' matching schema/API, not 'boardMember' string
                    boardMemberId: newGrantData.boardMemberId ? parseInt(newGrantData.boardMemberId) : null,
                    grantNotes: newGrantData.grantNotes || newGrantData.notes || null // Accept either key
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
    // Expects 'updateData' object to contain *only* the fields being changed
    const updateGrant = async (id, updateData) => {
        isLoading.value = true;
        error.value = null;

        try {
            // --- Frontend Validation ---
            // REMOVED intermediate 'updatedGrant' object preparation
            const validUpdateKeys = [ /* ... all valid keys from schema ... */ 'status'];
            const updateKeys = Object.keys(updateData);
            const isValidUpdate = updateKeys.some(key => validUpdateKeys.includes(key) && updateData[key] !== undefined);
            if (!isValidUpdate) {
                throw new Error('No valid fields provided for update.');
            }
            // REMOVED Enum validation block
            // --- End Frontend Validation ---

            // Send only the updateData object (status sent as string if present)
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
        // ... (no significant changes needed here) ...
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch(`/api/grants/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.statusMessage || `HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            await fetchGrants();
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
            if (!newStatus || !String(newStatus).trim()) {
                throw new Error(`Invalid status: Status cannot be empty`);
            }
            // Call updateGrant with only the status field
            return await updateGrant(id, { status: String(newStatus).trim() });
        } catch (err) {
            error.value = err.message || `Failed to set status for grant ${id}`;
            console.error('setGrantStatus Error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };
    // REMOVED toggleGrantStatus function if setGrantStatus replaces it


    return {
        grants,
        isLoading,
        error,
        fetchGrants,
        fetchGrant,
        addGrant,
        updateGrant,
        deleteGrant,
        setGrantStatus // Using the clearer function name
    };
};

// --- useValidDates Function Definition ---
// This was included in the file you provided. Decide what to do with it.

export function useValidDates() {
    const getMinStartDate = (proposalDate, awardDate) => {
        if (!proposalDate && !awardDate) {
            return null;
        }
        else if (!awardDate) {
            return proposalDate;
        }
        else {
            return awardDate;
        }
    };

    const getMinExpirationDate = (proposalDate, awardDate, startDate) => {
        if (!proposalDate && !awardDate && !startDate) {
            return null;
        }
        else if (!startDate) {
            return getMinStartDate(proposalDate, awardDate);
        }
        else {
            return startDate;
        }
    };

    return {
        getMinStartDate,
        getMinExpirationDate
    };
}
// --- End of useValidDates ---
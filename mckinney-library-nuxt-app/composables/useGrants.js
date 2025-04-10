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
            // Prepare grant data for API
            const grantData = {
                ...grant,
                // Convert amount to number if it's a string
                monetaryAmountRequested: typeof grant.monetaryAmountRequested === 'string' ? parseFloat(grant.monetaryAmountRequested) : grant.monetaryAmountRequested,
                monetaryAmountReceived: typeof grant.monetaryAmounteceived === 'string' ? parseFloat(grant.monetaryAmountReceived) : grant.monetaryAmountReceived,
                monetaryAmountSpent: typeof grant.monetaryAmountSpent === 'string' ? parseFloat(grant.monetaryAmountSpent) : grant.monetaryAmountSpent
            };

            // Transform the keys to match the backend API expectations
            const apiGrant = {
                orgName: grantData.orgName,
                firstName: grantData.firstName,
                lastName: grantData.lastName,
                email: grantData.email,
                phone: grantData.phone,
                address: grantData.address,
                monetaryAmountRequested: grantData.monetaryAmountRequested,
                nonmonetaryAmountRequested: grantData.nonmonetaryAmountRequested,
                monetaryAmountReceived: grantData.monetaryAmountReceived,
                nonmonetaryAmountReceived: grantData.nonmonetaryAmountReceived,
                monetaryAmountSpent: grantData.monetaryAmountSpent,
                allocatedFor: grantData.allocatedFor,
                status: grantData.status,
                proposalDate: grantData.proposalDate,
                awardDate: grantData.awardDate,
                startDate: grantData.startDate,
                expirationDate: grantData.expirationDate,
                lastEditor: grantData.lastEditor,      //Hardcoded value that will be changed once we offer support for multiple accounts
                boardMember: grantData.boardMember,
                notes: grantData.notes
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
                monetaryAmountRequested: typeof grantData.monetaryAmountRequested === 'string' ? parseFloat(grantData.monetaryAmountRequested) : grantData.monetaryAmountRequested
                // monetaryAmountReceived: typeof grant.monetaryAmounteceived === 'string' ? parseFloat(grant.monetaryAmountReceived) : grant.monetaryAmountReceived,
                // monetaryAmountSpent: typeof grant.monetaryAmountSpent === 'string' ? parseFloat(grant.monetaryAmountSpent) : grant.monetaryAmountSpent
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
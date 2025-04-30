// composables/useUsers.js
import { ref } from 'vue';

export const useUsers = () => {
    const users = ref([]);
    const boardMembers = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch all users
    const fetchUsers = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the standard fetch API
            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            users.value = await response.json();
        } catch (err) {
            error.value = err.message || 'Failed to fetch users';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchBoardMembers = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the standard fetch API
            const response = await fetch('/api/boardMembers');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            boardMembers.value = await response.json();
        } catch (err) {
            error.value = err.message || 'Failed to fetch board members';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        users,
        fetchUsers,
        boardMembers,
        fetchBoardMembers,
    };
};
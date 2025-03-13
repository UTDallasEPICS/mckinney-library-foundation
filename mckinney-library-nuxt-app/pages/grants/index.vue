<template>
  <div class="table-container">
    <div v-if="isLoading" class="loading-message">Loading grants...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else>
      
      <table v-if="grants.length > 0">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grant in grants" :key="grant.id">
            <td>{{ grant.name }}</td>
            <td>
              <a v-if="grant.link" :href="grant.link" target="_blank" class="grant-link">
                View
              </a>
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(grant.endDate) }}</td>
            <td>${{ grant.amount.toFixed(2) }}</td>
            <td>
              <span :class="'status-badge ' + grant.status.toLowerCase()">
                {{ grant.status }}
              </span>
            </td>
            <td>{{ grant.notes || '-' }}</td>
            <td>{{ grant.boardMember ? 'Yes' : 'No' }}</td>
            <td class="actions-cell">
              <button @click="editGrant(grant.id)" class="edit-button">Edit</button>
              <button @click="confirmDelete(grant)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="no-data-message">
        No grants found. Add your first grant!
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the grant "{{ selectedGrant?.name }}"?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="handleDelete" class="confirm-delete-button">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGrants } from '~/composables/useGrants';

const router = useRouter();
const headers = ref([
  "Name",
  "Link",
  "Due Date",
  "Amount",
  "Status",
  "Notes",
  "Board Member"
]);

// Get everything we need from the composable
const { grants, isLoading, error, fetchGrants, deleteGrant } = useGrants();

// State for delete confirmation
const showDeleteModal = ref(false);
const selectedGrant = ref(null);

// Fetch grants when the component mounts
onMounted(() => {
  fetchGrants();
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Navigate to edit page
const editGrant = (id) => {
  router.push(`/grants/${id}/edit`);
};

// Show delete confirmation
const confirmDelete = (grant) => {
  selectedGrant.value = grant;
  showDeleteModal.value = true;
};

// Handle grant deletion
const handleDelete = async () => {
  try {
    await deleteGrant(selectedGrant.value.id);
    showDeleteModal.value = false;
    selectedGrant.value = null;
  } catch (err) {
    // Error is handled in the composable
    showDeleteModal.value = false;
  }
};
</script>

<style scoped>
/* Match the header navigation styles */
.table-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 20px auto;
}

/* Add button styling */
.actions-bar {
  width: 98%;
  max-width: 1400px;
  margin-bottom: 15px;
  text-align: right;
}

.add-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

/* Style the table to be consistent with the navigation */
table {
  width: 98%;
  max-width: 1400px;
  border-collapse: collapse;
  font-size: 14px;
  font-weight: bold;
  font-family: sans-serif;
  color: #545679;
}

/* Headers: Blue background with white text */
th {
  background-color: #545679;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  padding: 15px;
  text-align: center;
  border-bottom: 2px solid #ddd;
}

/* Table body */
td {
  background-color: white;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

/* Action buttons */
.actions-cell {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.edit-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.active {
  background-color: #4CAF50;
  color: white;
}

.status-badge.pending {
  background-color: #FFC107;
  color: black;
}

.status-badge.expired {
  background-color: #9E9E9E;
  color: white;
}

.status-badge.rejected {
  background-color: #F44336;
  color: white;
}

/* Grant link */
.grant-link {
  color: #2196F3;
  text-decoration: none;
  font-weight: bold;
}

.grant-link:hover {
  text-decoration: underline;
}

/* Loading, error, and no data messages */
.loading-message, .error-message, .no-data-message {
  width: 98%;
  max-width: 1400px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

.error-message {
  color: #f44336;
}

/* Modal Styles */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  background-color: #9e9e9e;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete-button {
  background-color: #f44336;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
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
            <td>{{ grant.contactName || '-' }}</td>
            <td>${{ (grant.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
            <td>{{ formatDate(grant.date) }}</td>
            <td>{{ grant.allocatedFor }}</td>
            <td>
              <span :class="'status-badge ' + (grant.status || 'pending').toLowerCase()">
                {{ grant.status || 'Pending' }}
              </span>
            </td>
            <td>{{ grant.boardMember ? 'Yes' : 'No' }}</td>
            <td class="actions-cell">
              <button @click="editGrant(grant)" class="edit-button">Edit</button>
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
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the grant "{{ selectedGrant?.name }}"?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="handleDelete" class="confirm-delete-button">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Grant Modal -->
    <div v-if="showAddGrantModal || showEditGrantModal" class="modal">
      <div class="modal-content grant-form-modal">
        <h3>{{ showEditGrantModal ? 'Edit' : 'Add' }} Grant</h3>
        <form @submit.prevent="submitGrantForm">
          <div class="form-group">
            <label for="name">Grant/Organization Name *</label>
            <input id="name" v-model="grantForm.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label for="contactName">Contact Name</label>
            <input id="contactName" v-model="grantForm.contactName" type="text">
          </div>
          
          <div class="form-group">
            <label for="email">Contact Email</label>
            <input id="email" v-model="grantForm.email" type="email">
          </div>
          
          <div class="form-group">
            <label for="phone">Contact Phone</label>
            <input id="phone" v-model="grantForm.phone" type="tel">
          </div>
          
          <div class="form-group">
            <label for="amount">Grant Amount ($) *</label>
            <input id="amount" v-model="grantForm.amount" type="number" step="0.01" min="0" required>
          </div>
          
          <div class="form-group">
            <label for="allocatedFor">Allocation Purpose *</label>
            <input id="allocatedFor" v-model="grantForm.allocatedFor" type="text" required>
          </div>
          
          <div class="form-group">
            <label for="date">Grant Start Date *</label>
            <input id="date" v-model="grantForm.date" type="date" required>
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="grantForm.status">
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="boardMember">Board Member</label>
            <select id="boardMember" v-model="grantForm.boardMember">
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="grantForm.notes" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cancelGrantForm" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : (showEditGrantModal ? 'Update' : 'Add') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGrants } from '~/composables/useGrants';

const headers = ref([
  "Name",
  "Contact",
  "Amount",
  "Start Date",
  "Allocated For",
  "Status",
  "Board Member"
]);

// Get everything we need from the composable
const { grants, isLoading, error, fetchGrants, addGrant, deleteGrant, updateGrant } = useGrants();

// State for modals
const showDeleteModal = ref(false);
const showAddGrantModal = ref(false);
const showEditGrantModal = ref(false);
const selectedGrant = ref(null);
const isSubmitting = ref(false);

// Default form values
const emptyGrantForm = {
  name: '',
  contactName: '',
  email: '',
  phone: '',
  amount: 0,
  allocatedFor: '',
  date: new Date().toISOString().split('T')[0],
  status: 'Pending',
  boardMember: false,
  notes: ''
};

// Grant form data
const grantForm = ref({...emptyGrantForm});

// Fetch grants when the component mounts
onMounted(() => {
  fetchGrants();
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  // Use local date string to avoid timezone issues
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString();
};

// Show edit modal with grant data
const editGrant = (grant) => {
  selectedGrant.value = grant;
  grantForm.value = {
    name: grant.name || '',
    contactName: grant.contactName || '',
    email: grant.email || '',
    phone: grant.phone || '',
    amount: grant.amount || 0,
    allocatedFor: grant.allocatedFor || '',
    date: grant.date || new Date().toISOString().split('T')[0],
    status: grant.status || 'Pending',
    boardMember: grant.boardMember || false,
    notes: grant.notes || ''
  };
  showEditGrantModal.value = true;
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

// Cancel form
const cancelGrantForm = () => {
  showAddGrantModal.value = false;
  showEditGrantModal.value = false;
  grantForm.value = {...emptyGrantForm};
  selectedGrant.value = null;
  isSubmitting.value = false;
};

// Submit form for add/edit
const submitGrantForm = async () => {
  isSubmitting.value = true;
  
  try {
    // Prepare grant data for API
    const grantData = {
      ...grantForm.value,
      amount: parseFloat(grantForm.value.amount)
    };
    
    if (showEditGrantModal.value) {
      await updateGrant(selectedGrant.value.id, grantData);
    } else {
      await addGrant(grantData);
    }
    
    // Reset form and close modal
    cancelGrantForm();
  } catch (err) {
    // Error is handled in the composable
    console.error('Form submission failed:', err);
  } finally {
    isSubmitting.value = false;
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
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  justify-content: center;
  gap: 5px;
  align-items: center;
  white-space: nowrap; /* Prevent buttons from wrapping */
}

.edit-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  display: inline-block;
  margin: 0 2px; /* Add horizontal margin between buttons */
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

/* Modal Styles */
.modal {
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

.grant-form-modal {
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

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

.cancel-button {
  background-color: #9e9e9e;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete-button, .submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete-button {
  background-color: #f44336;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
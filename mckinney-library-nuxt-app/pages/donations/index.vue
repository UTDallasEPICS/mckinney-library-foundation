<template>
  <div class="table-container">
    <div v-if="isLoading" class="loading-message">Loading donations...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else>
      
      <table v-if="donations.length > 0">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donations" :key="donation.id">
            <td>{{ donation.donor }}</td>
            <td>{{ donation.communicationMethod || '-' }}</td>
            <td>{{ donation.personalInfo || '-' }}</td>
            <td>{{ formatDate(donation.date) }}</td>
            <td>${{ donation.monetaryAmount?.toFixed(2) || '0.00' }}</td> 
            <td>{{ donation.nonmonetaryAmount || '-' }}</td> 
            <td>{{ donation.status || 'Received' }}</td>
            <td>{{ donation.category || 'General' }}</td>
            <td>{{ donation.boardMember ? 'Yes' : 'No' }}</td>
            <td class="actions-cell">
              <button @click="editDonation(donation)" class="edit-button">Edit</button>
              <button @click="confirmDelete(donation)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="no-data-message">
        No donations found. Add your first donation!
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the donation from {{ selectedDonation?.donor }}?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="handleDelete" class="confirm-delete-button">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Edit Donation Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content donation-form-modal">
        <h3>Edit Donation</h3>
        <form @submit.prevent="submitEditForm">
          <div class="form-group">
            <label for="donor">Donor Name *</label>
            <input id="donor" v-model="donationForm.donor" type="text" required>
          </div>
          
          <div class="form-group">
            <label for="amount">Amount ($) *</label>
            <input id="amount" v-model="donationForm.amount" type="number" step="0.01" min="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="date">Date *</label>
            <input id="date" v-model="donationForm.date" type="date" required>
          </div>
          
          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" v-model="donationForm.category" required>
              <option value="" disabled>Select a category</option>
              <option value="Books">Books</option>
              <option value="Programs">Programs</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
              <option value="Children's Area">Children's Area</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="donationForm.status">
              <option value="Requested">Requested</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="boardMember">Board Member</label>
            <select id="boardMember" v-model="donationForm.boardMember">
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="donationForm.notes" rows="3"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Update Donation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDonations } from '~/composables/useDonations';

const router = useRouter();
const headers = ref([
  "Name",
  "Communication",
  "Personal Info",
  "Date",
  "Monetary Amount",
  "Non-Monetary",
  "Status",
  "Type",
  "Board Member"
]);

// Get everything we need from the composable
const { donations, isLoading, error, fetchDonations, deleteDonation, updateDonation } = useDonations();

// State for modals
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const selectedDonation = ref(null);
const isSubmitting = ref(false);

// Donation form data
const donationForm = ref({
  donor: '',
  amount: '',
  date: '',
  category: '',
  status: 'Received',
  boardMember: false,
  notes: ''
});

// Fetch donations when the component mounts
onMounted(() => {
  fetchDonations();
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';

  // Validate MM/DD/YYYY
  const [month, day, year] = dateString.split('/');
  if (!month || !day || !year) return '-';

  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
};

// Open edit modal with donation data
const editDonation = (donation) => {
  selectedDonation.value = donation;
  donationForm.value = {
    donor: donation.donor,
    amount: donation.amount,
    date: formatToInputDate(donation.date),
    category: donation.category || 'General',
    status: donation.status || 'Received',
    boardMember: donation.boardMember || false,
    notes: donation.notes || ''
  };
  showEditModal.value = true;
};

// Show delete confirmation
const confirmDelete = (donation) => {
  selectedDonation.value = donation;
  showDeleteModal.value = true;
};

// Match Grant Date on Edit Modal
const formatToInputDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return new Date().toISOString().split('T')[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  const parts = dateString.split('/');
  if (parts.length !== 3) return new Date().toISOString().split('T')[0];

  let [month, day, year] = parts;

  if (!month || !day || !year) return new Date().toISOString().split('T')[0];

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Handle donation deletion
const handleDelete = async () => {
  try {
    await deleteDonation(selectedDonation.value.id);
    showDeleteModal.value = false;
    selectedDonation.value = null;
  } catch (err) {
    // Error is handled in the composable
    showDeleteModal.value = false;
  }
};

// Submit edit form
const submitEditForm = async () => {
  isSubmitting.value = true;
  
  try {
    // Prepare donation data for API
    const donationData = {
      ...donationForm.value,
      amount: parseFloat(donationForm.value.amount)
    };
    
    await updateDonation(selectedDonation.value.id, donationData);
    
    // Close modal and reset form
    showEditModal.value = false;
    selectedDonation.value = null;
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

.donation-form-modal {
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
</style>
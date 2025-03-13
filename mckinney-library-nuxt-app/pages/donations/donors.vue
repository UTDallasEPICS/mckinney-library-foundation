<template>
  <div class="table-container">
    <div v-if="isLoading" class="loading-message">Loading donors...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else>
      <div class="actions-bar">
        <button @click="showAddDonorModal = true" class="add-button">+ Add Donor</button>
        <button @click="showEmailModal = true" class="email-button" :disabled="selectedDonors.length === 0">
          Mass Email Donors {{ selectedDonors.length > 0 ? `(${selectedDonors.length})` : '' }}
        </button>
      </div>
      
      <table v-if="donors.length > 0">
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAllDonors" v-model="selectAll"></th>
            <th v-for="header in headers" :key="header">{{ header }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donor in donors" :key="donor.id">
            <td><input type="checkbox" v-model="selectedDonors" :value="donor.id"></td>
            <td>{{ donor.name }}</td>
            <td>{{ donor.email }}</td>
            <td>{{ donor.phone }}</td>
            <td>{{ donor.address }}</td>
            <td>${{ donor.totalDonations.toLocaleString() }}</td>
            <td>{{ formatDate(donor.lastDonationDate) }}</td>
            <td>
              <span :class="'status-badge ' + donor.status.toLowerCase()">
                {{ donor.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="editDonor(donor)" class="edit-button">Edit</button>
              <button @click="confirmDelete(donor)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="no-data-message">
        No donors found. Add your first donor!
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the donor "{{ selectedDonor?.name }}"?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="handleDelete" class="confirm-delete-button">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Donor Modal -->
    <div v-if="showAddDonorModal || showEditDonorModal" class="modal">
      <div class="modal-content donor-form-modal">
        <h3>{{ showEditDonorModal ? 'Edit' : 'Add' }} Donor</h3>
        <form @submit.prevent="submitDonorForm">
          <div class="form-group">
            <label for="name">Name *</label>
            <input id="name" v-model="donorForm.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input id="email" v-model="donorForm.email" type="email" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone</label>
            <input id="phone" v-model="donorForm.phone" type="tel">
          </div>
          
          <div class="form-group">
            <label for="address">Address</label>
            <input id="address" v-model="donorForm.address" type="text">
          </div>
          
          <div class="form-group">
            <label for="totalDonations">Total Donations ($)</label>
            <input id="totalDonations" v-model="donorForm.totalDonations" type="number" min="0">
          </div>
          
          <div class="form-group">
            <label for="lastDonationDate">Last Donation Date</label>
            <input id="lastDonationDate" v-model="donorForm.lastDonationDate" type="date">
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="donorForm.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cancelDonorForm" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button">
              {{ isLoading ? 'Saving...' : (showEditDonorModal ? 'Update' : 'Add') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Mass Email Modal -->
    <div v-if="showEmailModal" class="modal">
      <div class="modal-content email-form-modal">
        <h3>Send Email to {{ selectedDonors.length }} Donor{{ selectedDonors.length > 1 ? 's' : '' }}</h3>
        
        <div class="recipients-summary">
          <p>Recipients: {{ getSelectedDonorNames() }}</p>
        </div>
        
        <form @submit.prevent="sendEmail">
          <div class="form-group">
            <label for="emailSubject">Subject *</label>
            <input id="emailSubject" v-model="emailForm.subject" type="text" required>
          </div>
          
          <div class="form-group">
            <label for="emailTemplate">Template</label>
            <select id="emailTemplate" v-model="selectedTemplate" @change="applyTemplate">
              <option value="">Select a template</option>
              <option value="thankYou">Thank You</option>
              <option value="event">Upcoming Event</option>
              <option value="newsletter">Monthly Newsletter</option>
              <option value="fundraising">Fundraising Campaign</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="emailBody">Message *</label>
            <textarea id="emailBody" v-model="emailForm.body" rows="8" required></textarea>
          </div>
          
          <div class="form-group checkbox-group">
            <input id="includeUnsubscribe" type="checkbox" v-model="emailForm.includeUnsubscribe">
            <label for="includeUnsubscribe">Include unsubscribe link</label>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showEmailModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button" :disabled="emailsLoading">
              {{ emailsLoading ? 'Sending...' : 'Send Email' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDonors } from '~/composables/useDonors';
import { useEmails } from '~/composables/useEmails';

const headers = ref([
  "Donor Name",
  "Email",
  "Phone",
  "Address",
  "Total Donations",
  "Last Donation Date",
  "Status"
]);

// Get everything we need from the composables
const { donors, isLoading, error, fetchDonors, addDonor, deleteDonor, updateDonor } = useDonors();
const { isLoading: emailsLoading, error: emailError, getTemplate, getTemplates, sendMassEmail } = useEmails();

// State for modals
const showDeleteModal = ref(false);
const showAddDonorModal = ref(false);
const showEditDonorModal = ref(false);
const showEmailModal = ref(false);
const selectedDonor = ref(null);

// Default form values
const emptyDonorForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  totalDonations: 0,
  lastDonationDate: new Date().toISOString().split('T')[0],
  status: 'Active'
};

// Donor form data
const donorForm = ref({...emptyDonorForm});

// Email state
const selectedDonors = ref([]);
const selectAll = ref(false);
const emailForm = ref({
  subject: '',
  body: '',
  includeUnsubscribe: true
});
const selectedTemplate = ref('');

// Fetch donors when the component mounts
onMounted(() => {
  fetchDonors();
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Toggle all donors selection
const toggleAllDonors = () => {
  if (selectAll.value) {
    selectedDonors.value = donors.value.map(donor => donor.id);
  } else {
    selectedDonors.value = [];
  }
};

// Get names of selected donors
const getSelectedDonorNames = () => {
  if (selectedDonors.value.length === 0) return "None selected";
  
  const selectedNames = selectedDonors.value.map(id => {
    const donor = donors.value.find(d => d.id === id);
    return donor ? donor.name : '';
  }).filter(name => name);
  
  if (selectedNames.length <= 3) {
    return selectedNames.join(", ");
  } else {
    return `${selectedNames.slice(0, 3).join(", ")} and ${selectedNames.length - 3} more`;
  }
};

// Apply email template
const applyTemplate = () => {
  if (!selectedTemplate.value) return;
  
  const template = getTemplate(selectedTemplate.value);
  if (template) {
    emailForm.value.subject = template.subject;
    emailForm.value.body = template.body;
  }
};

// Get selected donor objects
const getSelectedDonorObjects = () => {
  return selectedDonors.value.map(id => 
    donors.value.find(donor => donor.id === id)
  ).filter(donor => donor);
};

// Send email to selected donors
const sendEmail = async () => {
  try {
    // Get selected donor objects
    const recipientDonors = getSelectedDonorObjects();
    
    // Prepare email data with unsubscribe link if needed
    let emailBody = emailForm.value.body;
    if (emailForm.value.includeUnsubscribe) {
      emailBody += "\n\n---\nTo unsubscribe from future emails, click here: [Unsubscribe Link]";
    }
    
    const emailData = {
      subject: emailForm.value.subject,
      body: emailBody
    };
    
    // Send emails using the composable
    const result = await sendMassEmail(recipientDonors, emailData);
    
    // Clear form and close modal on success
    emailForm.value = {
      subject: '',
      body: '',
      includeUnsubscribe: true
    };
    selectedTemplate.value = '';
    showEmailModal.value = false;
    
    // Optionally reset selection after sending
    selectedDonors.value = [];
    selectAll.value = false;
    
    // Show success message
    alert('Emails sent successfully!');
  } catch (err) {
    console.error('Failed to send emails:', err);
    alert(`Failed to send emails: ${err.message || 'Unknown error'}`);
  }
};

// Show edit modal with donor data
const editDonor = (donor) => {
  selectedDonor.value = donor;
  donorForm.value = {...donor};
  showEditDonorModal.value = true;
};

// Show delete confirmation
const confirmDelete = (donor) => {
  selectedDonor.value = donor;
  showDeleteModal.value = true;
};

// Handle donor deletion
const handleDelete = async () => {
  try {
    await deleteDonor(selectedDonor.value.id);
    showDeleteModal.value = false;
    selectedDonor.value = null;
  } catch (err) {
    // Error is handled in the composable
    showDeleteModal.value = false;
  }
};

// Cancel form
const cancelDonorForm = () => {
  showAddDonorModal.value = false;
  showEditDonorModal.value = false;
  donorForm.value = {...emptyDonorForm};
  selectedDonor.value = null;
};

// Submit form for add/edit
const submitDonorForm = async () => {
  try {
    if (showEditDonorModal.value) {
      await updateDonor(selectedDonor.value.id, donorForm.value);
    } else {
      await addDonor(donorForm.value);
    }
    
    // Reset form and close modal
    cancelDonorForm();
  } catch (err) {
    // Error is handled in the composable
    console.error('Form submission failed:', err);
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

.add-button, .email-button {
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.add-button {
  background-color: #4CAF50;
  color: white;
}

.email-button {
  background-color: #2196F3;
  color: white;
}

.email-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

/* Checkbox styling */
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

.status-badge.inactive {
  background-color: #9E9E9E;
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

.donor-form-modal {
  width: 500px;
}

.email-form-modal {
  width: 600px;
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

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-left: 10px;
  margin-bottom: 0;
}

.form-group input[type="text"], 
.form-group input[type="email"], 
.form-group input[type="tel"], 
.form-group input[type="number"], 
.form-group input[type="date"], 
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

.recipients-summary {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
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
</style>
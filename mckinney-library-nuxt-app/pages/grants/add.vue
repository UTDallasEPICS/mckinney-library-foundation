<template>
  <div class="add-grant-container">
    <h1 class="grant-title">Add New Grant</h1>
    
    <form @submit.prevent="submitGrant" class="grant-form">
      <!-- Grant Information Section -->
      <div class="form-fields">
        <div class="form-group">
          <label for="grantor">Grantor Organization *</label>
          <input 
            type="text" 
            id="grantor" 
            v-model="grantForm.name"
            required
            placeholder="Organization providing the grant"
          >
        </div>
        
        <div class="form-group">
          <label for="contactName">Contact Name</label>
          <input 
            type="text" 
            id="contactName" 
            v-model="grantForm.contactName"
            placeholder="Primary contact person"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Contact Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="grantForm.email"
            placeholder="contact@example.com"
          >
        </div>
        
        <div class="form-group">
          <label for="phone">Contact Phone</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="grantForm.phone"
            placeholder="(123) 456-7890"
          >
        </div>
      </div>
      
      <!-- Grant Details Section -->
      <div class="form-fields">
        <div class="form-group">
          <label for="amount">Amount Requested ($) *</label>
          <input 
            type="number" 
            id="amount" 
            v-model="grantForm.amount"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          >
        </div>
        
        <div class="form-group">
          <label for="allocatedFor">Purpose *</label>
          <input 
            type="text" 
            id="allocatedFor" 
            v-model="grantForm.allocatedFor"
            required
            placeholder="What the grant will be used for"
          >
        </div>
        
        <div class="form-group">
          <label for="date">Grant Date *</label>
          <input 
            type="date" 
            id="date" 
            v-model="grantForm.date"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="grantForm.status" required>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <!-- Additional Details Section -->
      <div class="form-fields">
        <div class="form-group">
          <label for="proposalDate">Proposal Date</label>
          <input 
            type="date" 
            id="proposalDate" 
            v-model="grantForm.proposalDate"
          >
        </div>
        
        <div class="form-group">
          <label for="awardDate">Award Date</label>
          <input 
            type="date" 
            id="awardDate" 
            v-model="grantForm.awardDate"
          >
        </div>
        
        <div class="form-group">
          <label for="boardMember">Board Member</label>
          <select id="boardMember" v-model="grantForm.boardMember">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="link">Grant URL</label>
          <input 
            type="url" 
            id="link" 
            v-model="grantForm.link"
            placeholder="https://example.com/grant"
          >
        </div>
      </div>
      
      <!-- Notes Section -->
      <div class="form-fields">
        <div class="form-group full-width">
          <label for="notes">Notes</label>
          <textarea 
            id="notes" 
            v-model="grantForm.notes"
            rows="3"
            placeholder="Additional details about this grant"
          ></textarea>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Form actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="cancel-button"
          @click="goBack"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Submitting...' : 'Submit Grant' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGrants } from '~/composables/useGrants';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addGrant, isLoading, error } = useGrants();

// Initialize today's date for default values
const today = new Date().toISOString().split('T')[0];

// Form data with default values
const grantForm = ref({
  name: '',                // This maps to organization name
  contactName: '',
  email: '',
  phone: '',
  amount: '',
  allocatedFor: '',        // Maps to purpose in your form
  date: today,             // Default to today
  proposalDate: '',
  awardDate: '',
  status: 'Pending',
  boardMember: false,
  link: '',
  notes: ''
});

// Handle form submission
const submitGrant = async () => {
  try {

    // Ensure the date is treated as local time by adding a timezone offset
  const dateObj = new Date(grantForm.value.date + 'T12:00:00'); // Add noon time to avoid any day boundary issues
  const formattedDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    // Prepare grant data for API based on our schema
    const grantData = {
      // Core fields from our schema
      name: grantForm.value.name,
      contactName: grantForm.value.contactName,
      email: grantForm.value.email,
      phone: grantForm.value.phone,
      amount: parseFloat(grantForm.value.amount || 0),
      allocatedFor: grantForm.value.allocatedFor,
      date: formattedDate,
      notes: grantForm.value.notes,
      
      // Additional fields that will be stored at API level
      status: grantForm.value.status,
      boardMember: grantForm.value.boardMember,
      link: grantForm.value.link,
      
      // Custom fields specific to grants UI
      proposalDate: grantForm.value.proposalDate,
      awardDate: grantForm.value.awardDate
    };
    
    await addGrant(grantData);
    
    // Redirect to grants list on success
    router.push('/grants');
  } catch (err) {
    // Error is handled in the composable
    console.error('Form submission failed:', err);
  }
};

// Navigate back to grants list
const goBack = () => {
  router.push('/grants');
};
</script>

<style scoped>
.add-grant-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  font-family: sans-serif;
  background-color: #e6f0ff;
  min-height: calc(100vh - 150px);
}

.grant-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.grant-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* Form fields styling */
.form-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1 0 100%;
}

.form-group.full-width {
  flex: 1 0 100%;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.error-message {
  color: #ff0000;
  font-weight: bold;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffeeee;
  border-radius: 4px;
  border: 1px solid #ffcccc;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.submit-button, .cancel-button {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f2f2f2;
  color: #333;
}

.cancel-button:hover {
  background-color: #e6e6e6;
}

/* Hide the increment/decrement buttons on number inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/* WebKit browsers (Chrome, Safari, Edge)

/* Responsive adjustments */
@media (min-width: 768px) {
  .form-group {
    flex: 0 0 calc(50% - 15px);
  }
  
  .form-group.full-width {
    flex: 1 0 100%;
  }
}
</style>
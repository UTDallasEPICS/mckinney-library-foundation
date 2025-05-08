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
            v-model="grantForm.orgName"
            required
            placeholder="Organization providing the grant"
          >
        </div>
        
        <div class="form-group">
          <label for="firstName">Contact First Name</label>
          <input 
            type="text" 
            id="firstName" 
            v-model="grantForm.firstName"
            placeholder="John"
          >
        </div>

        <div class="form-group">
          <label for="lastName">Contact Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            v-model="grantForm.lastName"
            placeholder="Doe"
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
      
      <div class="form-group">
          <label for="address">Contact Address</label>
          <input 
            type="text" 
            id="address" 
            v-model="grantForm.address"
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
            v-model="grantForm.monetaryAmountRequested"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          >
        </div>

        <div class="form-group">
          <label for="nonmonetaryAmountRequested">Nonmonetary Amount Requested *</label>
          <input
            type="text" 
            id="nonmonetaryAmountRequested" 
            v-model="grantForm.nonmonetaryAmountRequested"
            required
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
          <label for="date">Proposal Date *</label>
          <input 
            type="date" 
            id="proposalDate" 
            v-model="grantForm.proposalDate"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="grantForm.status" required>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Declined">Declined</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <!-- Additional Details Section -->
      <div class="form-group">
          <label for="awardDate">Award Date</label>
          <input 
            type="date" 
            id="awardDate" 
            v-model="grantForm.awardDate"
            :min="grantForm.proposalDate"
          >
        </div>

      <div class="form-fields">
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="grantForm.startDate"
            :min="minStartDate"
          >
        </div>

        <div class="form-group">
          <label for="expirationDate">Expiration Date</label>
          <input 
            type="date" 
            id="expirationDate" 
            v-model="grantForm.expirationDate"
            :min="minExpirationDate"
          >
        </div>
        
        <div class="form-group">
          <label for="boardMember">Board Member</label>
          <input 
            type="text" 
            id="boardMember" 
            v-model="grantForm.boardMember"
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
import { ref, computed } from 'vue';
import { useGrants } from '~/composables/useGrants';
import { useValidDates } from '~/composables/useGrants';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addGrant, isLoading, error } = useGrants();

// Initialize today's date for default values
const today = new Date().toISOString().split('T')[0];

// Form data with default values
const grantForm = ref({
  orgName: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  monetaryAmountRequested: '',
  nonmonetaryAmountRequested: '',
  allocatedFor: '',        // Maps to purpose in your form
  proposalDate: today,             // Default to today
  startDate: '',
  awardDate: '',
  expirationDate: '',
  status: 'Pending',
  boardMember: '',
  lastEditor: 1,          //Default lastEditor is the Main Admin
  notes: ''
});

const { getMinStartDate, getMinExpirationDate } = useValidDates();

const minStartDate = computed(() => 
  getMinStartDate(
    grantForm.value.proposalDate, 
    grantForm.value.awardDate
  )
);

const minExpirationDate = computed(() =>
  getMinExpirationDate(
    grantForm.value.proposalDate,
    grantForm.value.awardDate,
    grantForm.value.startDate
  )
);

// Handle form submission
const submitGrant = async () => {
  try {

  // Ensure the date is treated as local time by adding a timezone offset
  //const dateObj = new Date(grantForm.value.proposalDate + 'T12:00:00'); // Add noon time to avoid any day boundary issues
  //const formattedDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format
 
  const formatDateForDatabase = (dateString) => {
  if (!dateString) return null; // Or handle empty dates as needed
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};
    // Prepare grant data for API based on our schema
    const grantData = {
      // Core fields from our schema
      orgName: grantForm.value.orgName,
      firstName: grantForm.value.firstName,
      lastName: grantForm.value.lastName,
      email: grantForm.value.email,
      phone: grantForm.value.phone,
      address: grantForm.value.address,
      monetaryAmountRequested: parseFloat(grantForm.value.monetaryAmountRequested || 0),
      nonmonetaryAmountRequested: grantForm.value.nonmonetaryAmountRequested,
      allocatedFor: grantForm.value.allocatedFor,
      status: grantForm.value.status,
      proposalDate: formatDateForDatabase(grantForm.value.proposalDate),
      boardMember: grantForm.value.boardMember,
      lastEditor: 1,         //Hardcoded value that will be changed when we offer support for multiple accounts
      notes: grantForm.value.notes,
      
      // Custom fields specific to grants UI
      awardDate: formatDateForDatabase(grantForm.value.awardDate),
      startDate: formatDateForDatabase(grantForm.value.startDate),
      expirationDate: formatDateForDatabase(grantForm.value.expirationDate),
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
@import url('https://fonts.googleapis.com/css2?family=Aclonica&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
.add-grant-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  font-family: sans-serif;
  background-color: #e6f0ff;
  min-height: calc(100vh - 150px);
  box-sizing: border-box;
  overflow-x: hidden;
}

.grant-title {
  text-align: center;
  color: #42446A;
  font-family: 'Aclonica', san-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  font-size: 24px;
}

.grant-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

/* Form fields styling */
.form-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.form-group {
  flex: 1 0 100%;
  max-width: 100%;
  box-sizing: border-box;
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
  box-sizing: border-box;
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  width: 100%;
  max-width: 100%;
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
    max-width: calc(50% - 15px);
  }
  
  .form-group.full-width {
    flex: 1 0 100%;
    max-width: 100%;
  }
}
</style>
<template>
  <div class="add-grant-container">
    <form @submit.prevent="submitGrant" class="grant-form">
      <div class="form-group">
        <label for="grantor">Grantor</label>
        <input 
          type="text" 
          id="grantor" 
          v-model="grantForm.grantor"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="name">Grant</label>
        <input 
          type="text" 
          id="name" 
          v-model="grantForm.name"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="amount">Amount Requested</label>
        <input 
          type="number" 
          id="amount" 
          v-model="grantForm.amount"
          step="0.01"
          min="0"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="purpose">Purpose</label>
        <input 
          type="text" 
          id="purpose" 
          v-model="grantForm.purpose"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="startDate">Grant Start Date</label>
        <input 
          type="date" 
          id="startDate" 
          v-model="grantForm.startDate"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="endDate">Grant End Date</label>
        <input 
          type="date" 
          id="endDate" 
          v-model="grantForm.endDate"
          required
        >
      </div>
      
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
      
      <div class="form-actions">
        <button type="submit" class="submit-button">Submit</button>
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

// Form data with default values
const grantForm = ref({
  grantor: '',
  name: '',
  amount: '',
  purpose: '',
  startDate: '',
  endDate: '',
  proposalDate: '',
  awardDate: '',
  status: 'Pending',
  notes: ''
});

// Handle form submission
const submitGrant = async () => {
  try {
    // Prepare grant data for API
    const grantData = {
      name: grantForm.value.name,
      amount: parseFloat(grantForm.value.amount),
      startDate: grantForm.value.startDate,
      endDate: grantForm.value.endDate,
      status: 'Pending',
      notes: grantForm.value.purpose,
      // Additional fields
      grantor: grantForm.value.grantor,
      purpose: grantForm.value.purpose,
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
</script>

<style scoped>
.add-grant-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.grant-form {
  background-color: #e6f0ff;
  padding: 30px;
  border-radius: 5px;
}

.form-group {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.form-group label {
  width: 150px;
  text-align: right;
  margin-right: 15px;
  font-weight: bold;
}

.form-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background-color: white;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

/* Make inputs appear exactly like in the screenshot */
input {
  height: 36px;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-group label {
    width: 100%;
    text-align: left;
    margin-bottom: 5px;
  }
}
</style>
<template>
  <div class="create-account-container">
    <h1 class="page-title">Create Account</h1>
    <form @submit.prevent="submitAccount" class="create-account-form">
      
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" v-model="accountForm.firstName" required>
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" v-model="accountForm.lastName" required>
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="accountForm.email" required>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="accountForm.password" required>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="accountForm.confirmPassword" required>
      </div>
      
      <div class="form-group">
        <label for="role">Role</label>
        <select id="role" v-model="accountForm.role" required>
          <option value="" disabled>Select Role</option>
          <option v-for="role in roles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </div>
      
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const roles = ref(["Viewer", "Editor", "Admin", "Main Admin"]);

const accountForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

const isLoading = ref(false);
const error = ref('');

const submitAccount = async () => {
  error.value = '';
  // Simple validation: check if passwords match
  if (accountForm.value.password !== accountForm.value.confirmPassword) {
    error.value = "Passwords do not match.";
    return;
  }
  
  isLoading.value = true;
  try {
    // Simulate account creation
    console.log("Creating account:", accountForm.value);
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset the form on successful submission
    accountForm.value = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    };
    // Optionally, redirect to the Manage Accounts page or show a success message
  } catch (err) {
    error.value = "Failed to create account. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.create-account-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.create-account-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #545679;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  font-weight: bold;
  margin: 10px 0;
}
</style>
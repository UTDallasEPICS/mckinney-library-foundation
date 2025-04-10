<template>
  <div class="create-account-container">
    <h1 class="page-title">Create Account</h1>
    <form @submit.prevent="sendInvite" class="create-account-form">
      
      <div class="form-group">
        <label for="firstName">First Name *</label>
        <input type="text" id="firstName" v-model="accountForm.firstName" required>
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input type="text" id="lastName" v-model="accountForm.lastName" required>
      </div>
      
      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" v-model="accountForm.email" required>
      </div>
      
      <div class="form-group">
        <label for="role">Role *</label>
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
        <button type="submit" class="send-invite-button" :disabled="isLoading">
          {{ isLoading ? 'Sending Invite...' : 'Send Invite' }}
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
  role: ''
});

const isLoading = ref(false);
const error = ref('');

const sendInvite = async () => {
  error.value = '';
  isLoading.value = true;
  try {
    // Replace this with your actual invite API logic
    console.log("Sending invite for:", accountForm.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Reset the form on success
    accountForm.value = { firstName: '', lastName: '', email: '', role: '' };
  } catch (err) {
    console.error("Invite failed:", err);
    error.value = "Failed to send invite. Please try again.";
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
  background-color: #f9f9f9;
  border-radius: 8px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.create-account-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
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

.error-message {
  color: #f44336;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.send-invite-button {
  padding: 12px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-invite-button:hover {
  background-color: #45a049;
}

.send-invite-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
<template>
  <div class="table-container">
    <h1>Manage Accounts</h1>

    <table v-if="users.length > 0">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Email</th>
          <th colspan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>
            <select v-model="user.role">
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </td>
          <td>{{ user.email }}</td>
          <td class="actions-cell">
            <button :class="['status-button', user.status === 'Active' ? 'freeze' : 'unfreeze']">
              {{ user.status === 'Active' ? 'Freeze' : 'Unfreeze' }}
            </button>
          </td>
          <td class="actions-cell">
            <button class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else class="no-data-message">
      No accounts found. Add your first account.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([
  { firstName: "John", lastName: "Doe", role: "Admin", email: "johndoe@gmail.com", status: "Active" },
  { firstName: "Jane", lastName: "Doe", role: "Editor", email: "janedoe@gmail.com", status: "Frozen" },
  { firstName: "Main", lastName: "Admin", role: "Main Admin", email: "MPLFBoard@gmail.com", status: "Active" }
]);

const roles = ref(["Admin", "Editor", "Main Admin"]);
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

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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

/* Style the select dropdown */
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #545679;
}

/* Action buttons */
.actions-cell {
  white-space: nowrap;
  padding: 15px;
}

.status-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  width: 100%;
  margin: 0 2px; /* Add small horizontal spacing between buttons */
  display: inline-block; /* Keep buttons side-by-side */
}

.freeze {
  background-color: #FFC107;
  color: black;
}

.unfreeze {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

/* No data message */
.no-data-message {
  width: 98%;
  max-width: 1400px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}
</style>
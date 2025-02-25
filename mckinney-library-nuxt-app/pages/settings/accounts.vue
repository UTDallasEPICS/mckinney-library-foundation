<template>
    <div class="accounts-container">
      <h1>Manage Accounts</h1>
  
      <table class="accounts-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Manage Accounts</th>
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
            <td class="action-buttons">
              <button :class="user.status === 'Active' ? 'freeze' : 'unfreeze'">
                {{ user.status === 'Active' ? 'Freeze' : 'Unfreeze' }}
              </button>
              <button class="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
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
  .accounts-container {
    padding: 20px;
    max-width: 900px;
    margin: auto;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .accounts-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }
  
  .accounts-table th, .accounts-table td {
    border: 1px solid black;
    padding: 10px;
    text-align: left;
  }
  
  .accounts-table th {
    background: #ddd;
    text-align: center;
  }
  
  .accounts-table select {
    width: 100%;
    padding: 5px;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .freeze {
    background-color: yellow;
    color: black;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
  }
  
  .unfreeze {
    background-color: green;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
  }
  
  .delete {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
  }
  </style>
  
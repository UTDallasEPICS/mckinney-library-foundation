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
    <!-- please, please do not keep this in the final page - this is ONLY for testing -->
     <template v-if="requests && requests.length > 0">
        <h1> Account Requests</h1>
        <table >
        <thead>
           <tr>
          <th>Name</th>
          <th>Email</th>
          <th colspan="2">Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests">
            <td> {{ request.name }}</td>
            <td>{{ request.email }} </td> 
            <td><button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl" @click="createAccount(request.id,request.email,request.name)"> Accept </button></td>
            <td><button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#964240] to-[#c62929] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl" @click ="removeRequest(request.id)"> Deny </button></td>
          </tr>
        </tbody>
     </table>
     </template>
      
     
        
  </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';

async function createAccount(id:string,email:string, name:string){
  alert("account created for : " + email);
  await $fetch("/api/auth/user",{
    method: "POST",
    body:{
      name:name,
      email:email,
      id:id,
    }
  })
  reloadNuxtApp();
}

async function removeRequest(id:string){
  await $fetch("/api/auth/request", {
    method: 'DELETE',
    query:{
      id:id,
    }
  })
  reloadNuxtApp();
}

const users = ref([
  { firstName: "John", lastName: "Doe", role: "Admin", email: "johndoe@gmail.com", status: "Active" },
  { firstName: "Jane", lastName: "Doe", role: "Editor", email: "janedoe@gmail.com", status: "Frozen" },
  { firstName: "Main", lastName: "Admin", role: "Main Admin", email: "MPLFBoard@gmail.com", status: "Active" }
]);
//logic to check session permission level here
//
const requestOBJ = await useFetch("/api/auth/request");
const requests = requestOBJ.data.value;
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
  console.log("on page: " + requests[0]);
}


const roles = ref(["Admin", "Editor", "Main Admin"]);
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Aclonica&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
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
  color: #42446A;
  font-family: 'Aclonica', san-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  font-size: 30px;
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
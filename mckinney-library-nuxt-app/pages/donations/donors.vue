<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 25" :key="i"> <!-- Placeholder rows -->
          <td v-for="header in headers" :key="header"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const headers = ref([
  "Donor Name",
  "Email",
  "Phone",
  "Address",
  "Total Donations",
  "Last Donation Date",
  "Status"
]) // Updated column names for View Donors page
</script>

<style scoped>
/* Ensure the table container is styled properly */.table-container {
  width: 100%;
  display: flex;
  justify-content: center; /* Centers the table horizontally */
  padding: 0;
  margin: 20px auto; /* Adds space above and keeps it centered */
}

/* Style the table to be consistent with the navigation */
table {
  width: 98%; /* Ensures the table takes up more space */
  max-width: 1400px; /* Prevents excessive width on larger screens */
  border-collapse: collapse;
  font-size: 14px; /* Match .main-nav button */
  font-weight: bold;
  font-family: sans-serif; /* Inherit from navbar */
  color: #545679; /* Match inactive buttons */
}

.sub-nav {
  margin-bottom: 20px; /* Creates space between buttons and table */
}

/* Headers: Blue background with white text */
th {
  background-color: #545679; /* Blue background */
  color: white; /* White text */
  font-weight: bold;
  text-transform: uppercase;
  padding: 15px;
  text-align: center;
  border-bottom: 2px solid #ddd; /* Adds separation */
}

/* Table body */
td {
  background-color: white;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
</style>
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
  "Name",
  "Communication",
  "Personal Info",
  "Date",
  "Amount",
  "Status",
  "Type",
  "Board Member"
]) // Updated column names
</script>

<style scoped>
/* Match the header navigation styles */
.table-container {
  width: 100%;
  overflow-x: auto;
  padding: 20px;
}

/* Style the table to be consistent with the navigation */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px; /* Match .main-nav button */
  font-weight: bold;
  font-family: sans-serif; /* Inherit from navbar */
  color: #545679; /* Match inactive buttons */
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
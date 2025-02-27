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

const headers = ref(["Name", "Organization", "Email", "Phone", "Address", "First Donation Date", "Last Donation Date"]) // Define column names
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>

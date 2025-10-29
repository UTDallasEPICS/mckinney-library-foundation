<template>
    <div class="dashboard">
      <h1 class="main_title">MPLF Donor & Grant Tracker Dashboard</h1>

      <div>
        <h1> Donations</h1>
        <a href="/donations"> <button> View Donations </button></a>        
        <a v-if="permission > 0" href="/donations/add"> <button> Add Donation </button></a>        
        <a href="/donations/donors"> <button> View Donors </button></a>        
      </div>

      <div >
        <h1> Grants </h1>
        <a href="/grants"> <button> View Grants </button></a>        
        <a v-if="permission > 0" href="/grants/add"> <button> Add Grants </button></a>        
      </div>

      <div>
        <h1> Settings</h1>
        <a v-if="permission > 2" href="/settings"> <button> Create Account </button></a>        
        <a v-if="permission > 1" href="/settings/roles"> <button> View Roles </button></a>        
        <a v-if="permission > 2" href="/settings/accounts"> <button> Manage Accounts </button></a>        
      </div>

    </div>
  </template>
  
  <script setup>
const session = await useFetch("/api/auth/session");

if(!session.data.value?.user){
  navigateTo("/");
}
const permission = ref(session.data.value.user.permission);
  </script>
  
  <style scoped>

@import url('https://fonts.googleapis.com/css2?family=Aclonica&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');
  h1 {
    color: #545679;
    font-family: 'Alice', sans-serif;
    text-align: center;
  }

  button { 
    background-color: #545679; 
    font-family: sans-serif;
    border: none; 
    color: white; 
    padding: 15px 30px; 
    text-align: center; 
    text-decoration: none; 
    display: inline-block; 
    font-size: 20px; 
    margin: 10px; 
    cursor: pointer; 
    border-radius: 8px;
  }

  .dashboard {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Center items horizontally */
  gap: 20px; /* Add vertical spacing between sections */
}

.main_title {
  font-size: 50px;
  text-align: center;
  color: #42446A;
  margin-bottom: 5px;
  font-family: 'Aclonica', san-serif;
  text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2)
}

  </style>
  
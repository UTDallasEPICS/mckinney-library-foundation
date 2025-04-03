<template>
    <div class="dashboard">

      <div>
        <h1> Donations</h1>
        <a href="/donations"> <button> View Donations </button></a>        
        <a href="/donations/add"> <button> Add Donation </button></a>        
        <a href="/donations/donors"> <button> View Donors </button></a>        
      </div>

      <div>
        <h1 class="grants"> Grants </h1>
        <a href="/grants"> <button> View Grants </button></a>        
        <a href="/grants/add"> <button> Add Grants </button></a>        
      </div>

      <div>
        <h1 class="settings"> Settings</h1>
        <a href="/settings"> <button> Create Account </button></a>        
        <a href="/settings/roles"> <button> View Roles </button></a>        
        <a href="/settings/accounts"> <button> Manage Accounts </button></a>        
      </div>

    </div>
  </template>
  
  <script setup>
  // This page will automatically use the default layout (with header)
  </script>
  
  <style scoped>
  h1 {
    color: #545679;
    font-family: sans-serif;
  }

  .grants {
    padding-top: 20px;
  }

  .settings {
    padding-top: 20px;
  }

  button { 
    background-color: #545679; 
    font-family: sans-serif;
    border: none; 
    color: white; 
    padding: 20px 34px; 
    text-align: center; 
    text-decoration: none; 
    display: inline-block; 
    font-size: 20px; 
    margin: 4px 2px; 
    cursor: pointer; 
    border-radius: 8px;
  }
  </style>
  
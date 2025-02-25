<template>
    <header class="navbar">
      <div class="logo">
        <img src="../logo.jpg" alt="MPLF Logo" />
        <h1>MPLF Donor & Grant Tracker</h1>
      </div>
      <nav>
        <a href="https://mckinneylplf.org" target="_blank">MPLF Website</a>
        <button class="logout">Log out</button>
      </nav>
    </header>
  
    <nav class="main-nav">
      <NuxtLink to="/">Dashboard</NuxtLink>
      <NuxtLink to="/donations">Donations</NuxtLink>
      <NuxtLink to="/grants">Grants</NuxtLink>
      <NuxtLink to="/settings">Settings</NuxtLink>
    </nav>
  </template>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 10px 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo img {
    width: 40px;
    margin-right: 10px;
  }
  
  nav a, .logout {
    margin: 0 10px;
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  
  .logout {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .main-nav {
    display: flex;
    background: #f4f4f4;
    padding: 10px;
  }
  
  .main-nav a {
    margin-right: 15px;
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
  }
  </style>
  
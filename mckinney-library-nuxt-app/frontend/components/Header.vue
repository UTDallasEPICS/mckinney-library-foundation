<template>
    <header class="navbar">
      <div class="logo">
        <img src="../logo.jpg" alt="MPLF Logo" />
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
    width: 160px;
    height: auto; /* Maintain aspect ratio */
    margin-right: 10px;
  }
  
  nav a {
    margin: 0 10px;
    text-decoration: underline;
    color: #333;
    font-weight: none;
    font-size: 12px;
  }
  
  .logout {
    background: #545679;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 8px;
  }
  
  .main-nav {
    display: flex;
    background: #f4f4f4;
    width: 100%;
  }
  
  .main-nav a {
    flex: 1; /* Each button takes up equal space */
    text-align: center;
    padding: 15px 0;
    text-decoration: none;
    color: #545679;
    font-weight: bold;
    font-size: 18px;
  }
  </style>
  
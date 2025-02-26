<template>
    <header class="navbar">
      <div class="logo">
        <img src="/logo.jpg" alt="MPLF Logo" />
      </div>
      <nav>
        <a href="https://mckinneyplf.org" target="_blank">MPLF Website</a>
        <button class="logout">Log out</button>
      </nav>
    </header>
  
    <!-- Main Navigation Tabs -->
    <nav class="main-nav">
      <button @click="setActiveTab('dashboard')" :class="{ active: activeTab === 'dashboard' }">
        Dashboard
      </button>
      <button @click="setActiveTab('donations')" :class="{ active: activeTab === 'donations' }">
        Donations
      </button>
      <button @click="setActiveTab('grants')" :class="{ active: activeTab === 'grants' }">
        Grants
      </button>
      <button @click="setActiveTab('settings')" :class="{ active: activeTab === 'settings' }">
        Settings
      </button>
    </nav>
  
    <!-- Sub-tabs Navigation (Now using buttons) -->
    <nav v-if="subTabs.length" class="sub-nav">
      <button 
        v-for="tab in subTabs" 
        :key="tab.path" 
        @click="navigateTo(tab.path)"
        :class="{ active: activeSubTab === tab.path }"
      >
        {{ tab.label }}
      </button>
    </nav>
  </template>
  

  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const activeTab = ref('dashboard');
  const activeSubTab = ref('');
  
  const tabs = {
    dashboard: [],
    donations: [
      { label: 'View Donations', path: '/donations' },
      { label: 'Add Donation', path: '/donations/add' },
      { label: 'View Donors', path: '/donations/donors' }
    ],
    grants: [
      { label: 'View Grants', path: '/grants' },
      { label: 'Add Grant', path: '/grants/add' }
    ],
    settings: [
      { label: 'Create Account', path: '/settings' },
      { label: 'Manage Roles', path: '/settings/roles' },
      { label: 'Manage Accounts', path: '/settings/accounts' }
    ]
  };
  
  const setActiveTab = (tab) => {
  activeTab.value = tab;

  // Determine the default route for the selected tab
  let defaultPath = '';

  switch (tab) {
    case 'dashboard':
      defaultPath = '/';
      break;
    case 'donations':
      defaultPath = '/donations';
      break;
    case 'grants':
      defaultPath = '/grants';
      break;
    case 'settings':
      defaultPath = '/settings';
      break;
  }

  activeSubTab.value = tabs[tab]?.[0]?.path || defaultPath; 

  // Navigate to the correct page
  router.push(activeSubTab.value);
};

  
  const navigateTo = (path) => {
  console.log("Navigating to:", path); // Debugging log
  activeSubTab.value = path;
  router.push(path);
};

  
  const subTabs = computed(() => tabs[activeTab.value] || []);
  </script>
  
  
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
  
  /* Main Tabs */
  .main-nav {
    display: flex;
    width: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow under main tabs */
  }
  
  .main-nav button {
    flex: 1; /* Each button takes up equal space */
    text-align: center;
    padding: 15px 0;
    text-decoration: none;
    color: #545679;
    background: white;
    font-weight: bold;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .main-nav button.active {
  background: #545679;
  color: white;
}

/* Sub-tabs */
.sub-nav {
  display: flex;
  width: 100%;
  margin-top: 10px; /* Creates space between main and sub-tabs */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.sub-nav button {
    flex: 1; /* Each button takes up equal space */
    text-align: center;
    padding: 15px 0;
    text-decoration: none;
    color: #545679;
    background: white;
    font-weight: bold;
    font-size: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.sub-nav button.active {
  background: #545679;
  color: white;
}
  </style>
  
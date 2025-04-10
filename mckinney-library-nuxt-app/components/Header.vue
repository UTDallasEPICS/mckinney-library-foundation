<template>
  <header class="navbar">
    <div class="logo">
      <img src="/logo.jpg" alt="MPLF Logo" />
    </div>
    <nav>
      <a href="https://mckinneyplf.org" target="_blank">MPLF Website</a>
      <button class="logout" @click="logout">Log out</button>
    </nav>
  </header>

  <!-- Main Navigation Tabs -->
  <!-- <nav v-if="route.path !== '/dashboard'" class="main-nav"> for dissapearing navbar on dashboard -->
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
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
    { label: 'View Roles', path: '/settings/roles' },
    { label: 'Manage Accounts', path: '/settings/accounts' }
  ]
};

// Function to determine the active tab based on the current route
const updateActiveTabFromRoute = (path) => {
  // Default to dashboard
  let newActiveTab = 'dashboard';
  
  // Check which section we're in based on the path
  if (path.startsWith('/donations')) {
    newActiveTab = 'donations';
  } else if (path.startsWith('/grants')) {
    newActiveTab = 'grants';
  } else if (path.startsWith('/settings')) {
    newActiveTab = 'settings';
  } else if (path.startsWith('/dashboard')) {
    newActiveTab = 'dashboard';
  }
  
  activeTab.value = newActiveTab;
  
  // Set the active subtab based on the exact path
  // Find the matching subtab in the current tab's subtabs
  const currentSubTabs = tabs[newActiveTab] || [];
  const matchingSubTab = currentSubTabs.find(tab => tab.path === path);
  
  if (matchingSubTab) {
    activeSubTab.value = matchingSubTab.path;
  } else {
    // Default to the first subtab if none match exactly
    activeSubTab.value = currentSubTabs[0]?.path || '';
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;

  // Determine the default route for the selected tab
  let defaultPath = '';

  switch (tab) {
    case 'dashboard':
      defaultPath = '/dashboard';
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

// Logout function: navigate to the login page (using replace to clear history)
const logout = () => {
  // Clear authentication state if needed, e.g. remove tokens
  router.push('/', { replace: true });
};

// Initialize active tab based on the current route
onMounted(() => {
  updateActiveTabFromRoute(route.path);
});

// Watch for route changes to update the active tab and subtab
watch(
  () => route.path,
  (newPath) => {
    updateActiveTabFromRoute(newPath);
  }
);
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
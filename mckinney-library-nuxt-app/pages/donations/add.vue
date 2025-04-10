<template>
  <div class="add-donation-container">
    <h1 class="donation-title">Donor Info</h1>
    
    <form @submit.prevent="submitDonation" class="donation-form">
      <!-- Donor Type Selection Section -->
      <div class="donor-selection">
        <button 
          type="button" 
          :class="['selection-button', donorType === 'existing' ? 'selected' : '']" 
          @click="donorType = 'existing'"
        >
          Existing
        </button>
        <button 
          type="button" 
          :class="['selection-button', donorType === 'new' ? 'selected' : '']" 
          @click="donorType = 'new'"
        >
          New
        </button>
        
        <div class="anonymous-section" v-if="donorType === 'new'">
          <label for="anonymous" class="anonymous-label">Anonymous?</label>
          <input 
            type="checkbox" 
            id="anonymous" 
            v-model="donationForm.isAnonymous" 
            class="anonymous-checkbox"
            @change="handleAnonymousChange"
          >
        </div>
      </div>
      
      <!-- New Donor Information Section -->
      <div class="form-fields" v-if="donorType === 'new' && !donationForm.isAnonymous">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <div class="search-container">
            <input 
              type="text" 
              id="donorSearch" 
              v-model="donorSearchQuery" 
              @input="searchDonors"
            >
            <div v-if="showDonorSearchResults" class="search-results">
              <div 
                v-for="donor in filteredDonorsByName" 
                :key="donor.id" 
                class="search-result-item"
                @click="selectExistingDonor(donor)"
              >
                {{ donor.name }}
              </div>
              <div v-if="filteredDonorsByName.length === 0" class="no-results">
                No donors found
              </div>
            </div>
          </div>
          <!-- <input 
            type="text" 
            id="firstName" 
            v-model="donationForm.firstName"
            required
          > -->
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            v-model="donationForm.lastName"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            v-model="donationForm.phoneNumber"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="donationForm.email"
          >
        </div>
        
        <div class="form-group">
          <label for="address">Address</label>
          <input 
            type="text" 
            id="address" 
            v-model="donationForm.address"
          >
        </div>
        
        <div class="form-group">
          <label for="type">Type</label>
          <select id="type" v-model="donationForm.type" required>
            <option value="" disabled>Select</option>
            <option value="Individual">Individual</option>
            <option value="Corporation">Corporation</option>
            <option value="Foundation">Foundation</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="communicationPreference">Communication Preference</label>
          <select id="communicationPreference" v-model="donationForm.communicationPreference" required>
            <option value="" disabled>Select</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Mail">Mail</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>
      
      <!-- Existing Donor Selection Section -->
      <div class="form-fields" v-if="donorType === 'existing' && !donationForm.isAnonymous">
        <div class="form-group donor-search">
          <label for="donorSearch">Search Donors</label>
          <div class="search-container">
            <input 
              type="text" 
              id="donorSearch" 
              v-model="donorSearchQuery"
              placeholder="Start typing to search donors..." 
              @input="searchDonors"
            >
            <div v-if="showDonorSearchResults" class="search-results">
              <div 
                v-for="donor in filteredDonors" 
                :key="donor.id" 
                class="search-result-item"
                @click="selectExistingDonor(donor)"
              >
                {{ donor.name }} ({{ donor.email }})
              </div>
              <div v-if="filteredDonors.length === 0" class="no-results">
                No donors found
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedExistingDonor" class="selected-donor-info">
          <h3>Selected Donor</h3>
          <div class="donor-details">
            <p><strong>Name:</strong> {{ selectedExistingDonor.name }}</p>
            <p><strong>Email:</strong> {{ selectedExistingDonor.email }}</p>
            <p><strong>Phone:</strong> {{ selectedExistingDonor.phone || 'N/A' }}</p>
            <p><strong>Total Donations:</strong> ${{ (selectedExistingDonor.totalDonations || 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>
      
      <!-- Anonymous donor message -->
      <div class="form-fields" v-if="donationForm.isAnonymous">
        <p class="anonymous-message">Donor will be recorded as Anonymous</p>
      </div>
      
      <!-- Donation details section -->
      <div class="form-fields donation-details">
        <div class="form-group">
          <label for="amount">Donation Amount ($) *</label>
          <input 
            type="number" 
            id="amount" 
            v-model="donationForm.amount"
            min="0.01"
            required
          >
        </div>

        <div class="form-group">
          <label for="nonmonetaryAmount">Non-Monetary Amount/Items</label>
          <input 
            type="text" 
            id="nonmonetaryAmount" 
            v-model="donationForm.nonmonetaryAmount"
            placeholder="e.g., Books, Computer, Services" 
          > 
          </div>
        
        <div class="form-group">
          <label for="date">Date *</label>
          <input 
            type="date" 
            id="date" 
            v-model="donationForm.date"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="donationMethod">Donation Method *</label>
          <select id="donationMethod" v-model="donationForm.donationMethod" required>
            <option value="" disabled>Select</option>
            <option value="Check">Check</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
            <option value="GiveButter">GiveButter</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="allocatedFor">Allocated For *</label>
          <select id="allocatedFor" v-model="donationForm.allocatedFor" required>
            <option value="" disabled>Select</option>
            <option value="Books">Books</option>
            <option value="Programs">Programs</option>
            <option value="Technology">Technology</option>
            <option value="Furniture">Furniture</option>
            <option value="Children's Area">Children's Area</option>
            <option value="Fundraiser">Fundraiser</option>
            <option value="Library Event">Library Event</option>
            <option value="General">General</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea 
            id="notes" 
            v-model="donationForm.notes"
            rows="3"
          ></textarea>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Form actions -->
      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useDonations } from '~/composables/useDonations';
import { useDonors } from '~/composables/useDonors';

const router = useRouter();
const { addDonation, isLoading, error } = useDonations();
const { donors, fetchDonors } = useDonors();

// Default date to today
const today = new Date().toISOString().split('T')[0];

// Donor type selection ('new' or 'existing')
const donorType = ref('existing');
const donorSearchQuery = ref('');
const showDonorSearchResults = ref(false);
const selectedExistingDonor = ref(null);

// Form data
const donationForm = ref({
  isAnonymous: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  address: '',
  type: 'Individual',
  communicationPreference: 'Email',
  amount: '',
  nonmonetaryAmount: '',
  date: today,
  donationMethod: '',
  allocatedFor: '',
  notes: ''
});

// Fetch all donors when component mounts
onMounted(async () => {
  await fetchDonors();
});

// Filter donors based on search query
const filteredDonors = computed(() => {
  if (!donorSearchQuery.value.trim()) return donors.value.slice(0, 5); // Show first 5 by default
  
  const query = donorSearchQuery.value.toLowerCase();
  return donors.value.filter(donor => {
    return donor.name.toLowerCase().includes(query) || 
           (donor.email && donor.email.toLowerCase().includes(query));
  }).slice(0, 10); // Limit to 10 results
});

const filteredDonorsByName = computed(() => {
  if (!donorSearchQuery.value.trim()) return donors.value.slice(0, 5); // Show first 5 by default
  
  const query = donorSearchQuery.value.toLowerCase();
  return donors.value.filter(donor => {
    return donor.name.toLowerCase().includes(query); 
  }).slice(0, 10); // Limit to 10 results
});

// Clear selection when donor type changes
watch(donorType, () => {
  selectedExistingDonor.value = null;
  donorSearchQuery.value = '';
});

// Handle anonymous checkbox change
const handleAnonymousChange = () => {
  if (donationForm.value.isAnonymous) {
    // If anonymous, clear donor information
    selectedExistingDonor.value = null;
    donorSearchQuery.value = '';
    // Reset donor type to new (for when anonymous is unchecked)
    donorType.value = 'new';
  }
};

// Search donors
const searchDonors = () => {
  showDonorSearchResults.value = true;
};

// Select an existing donor
const selectExistingDonor = (donor) => {
  if (donorType.value === "new") {
    donorType.value = "existing";
  }
  
  selectedExistingDonor.value = donor;
  donorSearchQuery.value = donor.name;
  showDonorSearchResults.value = false;
};

// Handle form submission
const submitDonation = async () => {

  // Ensure the date is treated as local time by adding a timezone offset
  const dateObj = new Date(grantForm.value.date + 'T12:00:00'); // Add noon time to avoid any day boundary issues
  const formattedDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format

  try {
    let donorData = null;
    let donorId = null;
    
    // Determine donor information based on selection type
    if (donationForm.value.isAnonymous) {
      // Anonymous donation
      donorData = { donor: 'Anonymous' };
    } else if (donorType.value === 'existing' && selectedExistingDonor.value) {
      // Existing donor
      donorData = { 
        donor: selectedExistingDonor.value.name,
        donorId: selectedExistingDonor.value.id
      };
    } else if (donorType.value === 'new') {
      // New donor
      donorData = {
        donor: `${donationForm.value.firstName} ${donationForm.value.lastName}`,
        donorDetails: {
          firstName: donationForm.value.firstName,
          lastName: donationForm.value.lastName,
          phoneNumber: donationForm.value.phoneNumber,
          email: donationForm.value.email,
          address: donationForm.value.address,
          type: donationForm.value.type,
          communicationPreference: donationForm.value.communicationPreference
        }
      };
    } else {
      throw new Error('Please select a donor or choose anonymous');
    }
    
    // Prepare donation data for API
    const donationData = {
      ...donorData,
      monetaryAmount: parseFloat(donationForm.value.amount) || 0,
      nonmonetaryAmount: donationForm.value.nonmonetaryAmount || '',
      date: formattedDate,
      donationMethod: donationForm.value.donationMethod,
      allocatedFor: donationForm.value.allocatedFor,
      notes: donationForm.value.notes || '',
      amountSpent: 0,
      status: 'RECEIVED'
    };
    
    console.log("Submitting donation:", donationData);
    await addDonation(donationData);
    
    // Redirect to donations list on success
    router.push('/donations');
  } catch (err) {
    console.error('Form submission failed:', err);
    // Error will be handled by the composable and displayed in the template
  }
};
</script>

<style scoped>
.add-donation-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  font-family: sans-serif;
  background-color: #e6f0ff;
  min-height: calc(100vh - 150px);
  box-sizing: border-box;
  overflow-x: hidden; /* Prevent horizontal scroll */
}

.donation-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.donation-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

/* Donor selection styling */
.donor-selection {
  display: flex;
  justify-content: flex-start; /* Changed from space-between to prevent stretching */
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on small screens */
  gap: 10px; /* Add gap for spacing when wrapped */
}

.selection-button {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
}

.selection-button.selected {
  background-color: #333;
  color: white;
}

.anonymous-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.anonymous-label {
  margin-right: 10px;
  font-weight: bold;
}

.anonymous-checkbox {
  width: 18px;
  height: 18px;
}

/* Form fields styling */
.form-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  max-width: 100%; /* Ensure it doesn't exceed container width */
  box-sizing: border-box;
}

.form-group {
  flex: 1 0 100%;
  max-width: 100%; /* Ensure form groups don't exceed container width */
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  max-width: 100%; /* Prevent overflowing */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  box-sizing: border-box;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

/* Donor search styling */
.donor-search {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.search-result-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  word-break: break-word; /* Handle long text */
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.no-results {
  padding: 10px;
  color: #999;
  text-align: center;
}

.selected-donor-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.selected-donor-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.donor-details p {
  margin: 5px 0;
  word-break: break-word; /* Handle long text without overflow */
}

.anonymous-message {
  font-style: italic;
  color: #666;
  margin: 10px 0;
}

.error-message {
  color: #ff0000;
  font-weight: bold;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffeeee;
  border-radius: 4px;
  border: 1px solid #ffcccc;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  max-width: 100%;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Hide the increment/decrement buttons on number inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/* WebKit browsers (Chrome, Safari, Edge)

/* Responsive adjustments */
@media (min-width: 768px) {
  .form-group {
    flex: 0 0 calc(50% - 15px);
    max-width: calc(50% - 15px); /* Ensure proper sizing when in flex container */
  }
  
  .donor-search,
  .selected-donor-info,
  .form-group:last-child {
    flex: 1 0 100%;
    max-width: 100%;
  }
}
</style>
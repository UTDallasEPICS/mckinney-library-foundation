<template>
  <div class="add-donation-container">
    <h1 class="donation-title">Donor Info</h1>
    
    <form @submit.prevent="submitDonation" class="donation-form">
      <!-- Donor Selection Section -->
      <div class="donor-selection">
        <button 
          type="button" 
          :class="['selection-button', donorType === 'new' ? 'selected' : '']" 
          @click="donorType = 'new'"
        >
          New
        </button>
        
        <div class="anonymous-section">
          <label for="anonymous" class="anonymous-label">Anonymous?</label>
          <input 
            type="checkbox" 
            id="anonymous" 
            v-model="donationForm.isAnonymous" 
            class="anonymous-checkbox"
          >
        </div>
      </div>
      
      <!-- Donor Information Section -->
      <div class="form-fields" v-if="!donationForm.isAnonymous">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            v-model="donationForm.firstName"
            required
          >
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
          <select id="type" v-model="donationForm.type">
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
          <select id="communicationPreference" v-model="donationForm.communicationPreference">
            <option value="" disabled>Select</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Mail">Mail</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>
      
      <!-- Anonymous donor form - simplified version -->
      <div class="form-fields" v-else>
        <p class="anonymous-message">Donor will be recorded as Anonymous</p>
      </div>
      
      <!-- Additional donation details (not shown in screenshot but likely needed) -->
      <div class="form-fields donation-details">
        <div class="form-group">
          <label for="amount">Donation Amount ($)</label>
          <input 
            type="number" 
            id="amount" 
            v-model="donationForm.amount"
            step="0.01"
            min="0.01"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="date">Date</label>
          <input 
            type="date" 
            id="date" 
            v-model="donationForm.date"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" v-model="donationForm.category" required>
            <option value="" disabled>Select</option>
            <option value="Books">Books</option>
            <option value="Programs">Programs</option>
            <option value="Technology">Technology</option>
            <option value="Furniture">Furniture</option>
            <option value="Children's Area">Children's Area</option>
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
      
      <!-- Form actions -->
      <div class="form-actions">
        <button type="submit" class="submit-button">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDonations } from '~/composables/useDonations';

const router = useRouter();
const { addDonation, isLoading, error } = useDonations();

// Default date to today
const today = new Date().toISOString().split('T')[0];

// Donor type selection ('new' or 'existing')
const donorType = ref('new');

// Form data
const donationForm = ref({
  isAnonymous: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  address: '',
  type: '',
  communicationPreference: '',
  amount: '',
  date: today,
  category: '',
  notes: ''
});

// Handle form submission
const submitDonation = async () => {
  try {
    // Prepare donor name based on anonymous status
    const donor = donationForm.value.isAnonymous 
      ? 'Anonymous' 
      : `${donationForm.value.firstName} ${donationForm.value.lastName}`;
    
    // Prepare donation data for API
    const donationData = {
      donor: donor,
      amount: parseFloat(donationForm.value.amount),
      date: donationForm.value.date,
      category: donationForm.value.category,
      notes: donationForm.value.notes || '',
      status: 'Received',
      // Include donor details if not anonymous
      ...(donationForm.value.isAnonymous ? {} : {
        donorDetails: {
          phoneNumber: donationForm.value.phoneNumber,
          email: donationForm.value.email,
          address: donationForm.value.address,
          type: donationForm.value.type,
          communicationPreference: donationForm.value.communicationPreference
        }
      })
    };
    
    await addDonation(donationData);
    
    // Redirect to donations list on success
    router.push('/donations');
  } catch (err) {
    // Error is handled in the composable
    console.error('Form submission failed:', err);
  }
};
</script>

<style scoped>
.add-donation-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.donation-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.donation-form {
  background-color: #e6f0ff;
  padding: 20px;
  border-radius: 5px;
}

/* Donor selection styling */
.donor-selection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.selection-button {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.selection-button.selected {
  background-color: #333;
  color: white;
}

.anonymous-section {
  display: flex;
  align-items: center;
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
}

.form-group {
  flex: 1 0 100%;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.anonymous-message {
  font-style: italic;
  color: #666;
  margin: 10px 0;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
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

/* Responsive adjustments */
@media (min-width: 768px) {
  .form-group {
    flex: 0 0 calc(50% - 15px);
  }
}
</style>


<template>

    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
    <div class = "w-[90vw] flex justify-between">
      <button @click="showMenu = true"
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        Add Donation
      </button>
    
      <NuxtLink to = '/donations/'default>
      <button 
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        View Donation
      </button>
    </NuxtLink>


    <NuxtLink to="/donations/donors">
  <button class="px-3 py-1 rounded hover:bg-slate-600 transition">
    View Donors
  </button>
</NuxtLink>
      <button @click="showDonorForm = true"
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        Add Donor
      </button>
      </div>
    </div>
    
    
    
    <div v-if = "showMenu">
    
      <DonationsForm @close="showMenu = false"/>
    
    
    </div>
    
    <div  v-if = "showDonorForm"> 
    
    
      <DonorForm @close="showDonorForm = false"/>
    </div>
    
    
    </template>
    <script setup>
    
    import DonationsForm from '~/components/Forms/DonationsForm.vue';
    import DonorForm from '~/components/Forms/DonorForm.vue';

    import { ref } from 'vue';
    
    const showMenu = ref(false)
    
    const showDonorForm = ref (false) 
    
    
    </script>
    
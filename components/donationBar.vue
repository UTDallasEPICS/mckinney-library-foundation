

<template>

    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
    <div class = "w-[90vw] flex justify-between">
      <button v-if="permissionLevel>0" @click="showMenu = true"
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
      <button v-if="permissionLevel>0" @click="showDonorForm = true"
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        Add Donor
      </button>
      </div>
    </div>
    
    
    
    <div v-if = "showMenu">
    
      <DonationsForm :permission-level="permissionLevel" @add-donation = "addDonation"  @close="showMenu = false"/>
    
      
    </div>
    
    <div  v-if = "showDonorForm"> 
    
    
      <DonorForm :permission-level="permissionLevel" @close="showDonorForm = false" @add-donor = "addDonor"/>
    </div>
    
    
    </template>
    <script setup lang="ts">
    
    import DonationsForm from '~/components/Forms/DonationsForm.vue';
    import DonorForm from '~/components/Forms/DonorForm.vue';

    import { ref } from 'vue';

    const props = defineProps<{
      permissionLevel: number
    }>();
    
    const showMenu = ref(false)
    
    const showDonorForm = ref (false) 

    const emit = defineEmits(['add-donation','add-donor']);


    const addDonation = (data: any) => {
        console.log("dsssata",data)

        emit('add-donation', data);
    };

    const addDonor = ( data: any) => { 

      console.log('data for the dnoor',data)

      emit('add-donor',data)
    }
    
  

    </script>
    
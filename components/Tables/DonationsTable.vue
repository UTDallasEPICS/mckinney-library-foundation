<template>
    <div class="flex-1 p-8 ">

    <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
    <table class="w-full">
    <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
    <tr>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Donor name</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">event</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">method</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">monetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">non monetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">status</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">notes</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Board Member</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>

    </tr>
    </thead>


    <tr v-for ="(donation, index) in props.donationInfo?.donations" :key="index" 
     class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.donor?.['name']}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.event}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.method}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.monetaryAmount}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.nonMonetaryAmount}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.status == 0 ? 'pending': 'approved'}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.notes}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ donation.boardMember['name']}}</td>
<td>
        <div>
        <button  @click = "showMenu = true"  class ="rounded-md mt-2 text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"> Edit </button>
<div v-if = "showMenu == true" >

    <DonationsForm :donation-id = "donation.id"  method = "PUT" @close = "showMenu = false"/>
</div>

    </div>
</td>
    </tr>



    
  
    </table>
    </div>
    </div>
    </template>
    
    <script setup lang="ts">

import DonationsForm from '@/components/Forms/DonationsForm.vue';
const showMenu = ref(false)
const donationId = ref("")
const props = defineProps({ 
  donationInfo: { 
    type: Object,
  }
})

watch(() => props.donationInfo, (newVal) => {
    console.log("Donation Info Updated:", newVal);

},);


   


    
    
    </script>
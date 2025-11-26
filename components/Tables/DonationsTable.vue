<template>
<div class="flex-1 p-8">
<div class="bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
<table class="w-full">
    <thead class="bg-[#c5d0d8] sticky top-0 z-10">
<tr class="whitespace-nowrap">

  <th 
    class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
    @click="toggleSearch('donor')"
  >
    <span v-if="activeSearch !== 'donor'">Donor ↑↓</span>
    <input
      v-else
      v-model="searchInputs.donor"
      @click.stop
      class="mt-2 w-full px-2 py-1 border rounded"
      placeholder="Search donor"
    />
  </th>

  <th 
    class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
    @click="toggleSearch('event')"
  >
    <span v-if="activeSearch !== 'event'">Event ↑↓</span>
    <input
      v-else
      v-model="searchInputs.event"
      @click.stop
      class="mt-2 w-full px-2 py-1 border rounded"
      placeholder="Search event"
    />
  </th>

  <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Method
  </th>

  <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Monetary Amount
  </th>

  <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Non-Monetary Amount
  </th>

  <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Status
  </th>

  <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Notes
  </th>

  <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Received Date
  </th>

  <th 
    class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
    @click="toggleSearch('board')"
  >
    <span v-if="activeSearch !== 'board'">Board Member ↑↓</span>
    <input
      v-else
      v-model="searchInputs.board"
      @click.stop
      class="mt-2 w-full px-2 py-1 border rounded"
      placeholder="Search board"
    />
  </th>

  <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">
    Actions
  </th>

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
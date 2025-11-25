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


<tr
  v-for="(donation, index) in filteredAndSorted"
  :key="index"
  class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer"
>
  <td class="px-6 py-4">{{ donation.donor?.['name'] }}</td>
  <td class="px-6 py-4">{{ donation.event }}</td>
  <td class="px-6 py-4">{{ donation.method }}</td>
  <td class="px-6 py-4">{{ donation.monetaryAmount }}</td>
  <td class="px-6 py-4">{{ donation.nonMonetaryAmount }}</td>
  <td class="px-6 py-4">{{ donation.status == 0 ? 'pending' : 'approved' }}</td>
  <td class="px-6 py-4">{{ donation.notes }}</td>

  <td class="px-6 py-4 whitespace-nowrap w-[120px] truncate">
    {{ donation.receivedDate.slice(0,10) }}
  </td>

  <td class="px-6 py-4">{{ donation.boardMember?.['name'] }}</td>

  <td class="px-6 py-4">
    <div class="flex gap-2 justify-center">
      <button @click="openEdit(donation.id)" class="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Edit</button>
      <button @click="delete_donation(donation.id)" class="rounded-md bg-red-600 hover:bg-red-700 text-white px-6 py-2">Delete</button>
      <button @click="openView(donation.id)" class="rounded-md bg-green-600 hover:bg-green-700 text-white px-6 py-2">View</button>
    </div>
  </td>
</tr>

</table>
</div>

<div v-if="showMenu" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
<DonationsForm :donation-id="activeDonationId" method="PUT" @update-donation="handleUpdateDonations" @close="showMenu = false"/>
</div>

<div v-if="showViewDonations" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
<viewDonationsForm :donation-id="activeDonationId" @close="showViewDonations = false"/>
</div>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DonationsForm from '@/components/Forms/DonationsForm.vue'
import viewDonationsForm from '@/components/Forms/viewDonationsForm.vue'

const emit = defineEmits(['delete-donation', 'update-donation'])
    
const props = defineProps({
donationInfo: { type: Object }
})

const showMenu = ref(false)
const showViewDonations = ref(false)
const activeDonationId = ref(null)

const activeSearch = ref(null)

const searchInputs = ref({
    donor: '',
    event: '',
    board: ''
})
    
const toggleSearch = (field) => {
    
    if (['donor', 'event', 'board'].includes(field)) {
        activeSearch.value = activeSearch.value === field ? null : field
    }
}
    

const filteredAndSorted = computed(() => {
let list = props.donationInfo?.donations || []


list = list.filter((d) => {
    return (
        (d.donor?.name || '').toLowerCase().includes(searchInputs.value.donor.toLowerCase()) &&
        (d.event || '').toLowerCase().includes(searchInputs.value.event.toLowerCase()) &&
        (d.boardMember?.name || '').toLowerCase().includes(searchInputs.value.board.toLowerCase())
    )
})
return list
})
    
const openEdit = (id) => {
activeDonationId.value = id
showMenu.value = true
}

const openView = (id) => {
activeDonationId.value = id
showViewDonations.value = true
}

const delete_donation = async (id) => {
await $fetch(`/api/donations/${id}`, { method: 'DELETE' })
emit('delete-donation', id)
}

const handleUpdateDonations = (data) => {
emit('update-donation', data)
}
</script>
<template>
    <div class="flex-1 p-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
        <table class="w-full">
          <thead class="bg-[#c5d0d8] sticky top-0 z-10">
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
  
          <tr
            v-for="(donation, index) in props.donationInfo?.donations"
            :key="index"
            class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer"
          >
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.donor?.['name'] }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.event }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.method }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.monetaryAmount }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.nonMonetaryAmount }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.status == 0 ? 'pending' : 'approved' }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.notes }}
            </td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">
              {{ donation.boardMember?.['name'] }}
            </td>
            <td>
              <div class="flex gap-2">
                <button v-if="permissionLevel > 0"
                  @click="openEdit(donation.id)"
                  class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Edit
                </button>
                <button v-if="permissionLevel > 0"
                  @click="delete_donation(donation.id)"
                  class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"
                >
                  Delete
                </button>
                <button
                  @click="openView(donation.id)"
                  class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  View
                </button>
              </div>
            </td>
          </tr>
        </table>
      </div>
  
      <!-- Edit modal (ONE, not per row) -->
      <div
        v-if="showMenu && activeDonationId !== null"
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
      >
        <DonationsForm
          :donation-id="activeDonationId"
          method="PUT"
          @update-donation="handleUpdateDonations"
          @close="showMenu = false"
        />
      </div>
  
      <!-- View modal (ONE, not per row) -->
      <div
        v-if="showViewDonations && activeDonationId !== null"
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
      >
        <viewDonationsForm
          :donation-id="activeDonationId"
          @close="showViewDonations = false"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import DonationsForm from '@/components/Forms/DonationsForm.vue'
  import viewDonationsForm from '@/components/Forms/viewDonationsForm.vue'
  
  const emit = defineEmits(['delete-donation', 'update-donation'])
  
  const showMenu = ref(false)
  const showViewDonations = ref(false)
  const activeDonationId = ref<string | number | null>(null)
  
  const props = defineProps<{
    donationInfo: Object,
    permissionLevel: number
  }>()
  
  watch(
    () => props.donationInfo,
    (newVal) => {
      console.log('Donation Info Updated:', newVal)
    },
  )
  
  const openEdit = (id: string | number) => {
    activeDonationId.value = id
    showMenu.value = true
  }
  
  const openView = (id: string | number) => {
    activeDonationId.value = id
    showViewDonations.value = true
  }
  
  const delete_donation = async (id: string | number) => {
    try {
      await $fetch(`/api/donations/${id}`, {
        method: 'DELETE',
      })
  
      emit('delete-donation', id)
    } catch (err) {
      console.log("errors'", err)
    }
  }
  
  const handleUpdateDonations = (updatedDonation: any) => {
    console.log('something was reached', updatedDonation)
    emit('update-donation', updatedDonation)
  }
  </script>
  
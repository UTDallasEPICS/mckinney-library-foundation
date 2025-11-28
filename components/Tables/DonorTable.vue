<template>
  <div class="flex-1 p-8">
  <button 
    v-if="permissionLevel>1" 
    :disabled="!isEnabled" 
    @click="emailFunction(isChecked)" 
    class="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6 my-3"
  >Email Donors</button>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
      <table class="w-full">
        <thead class="bg-[#c5d0d8] sticky top-0 z-10">
          <tr>
            <th
              class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
              @click="toggleSearch('name')"
            >
              <span v-if="activeSearch !== 'name'">Name ↑↓</span>
              <input v-else v-model="searchInputs.name" @click.stop class="mt-2 w-full px-2 py-1 border rounded"
                placeholder="Search name"
              />
            </th>

            <th 
              class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer" 
              @click="toggleSearch('organization')"
            >
              <span v-if="activeSearch !== 'organization'">Organization ↑↓</span>
              <input v-else v-model="searchInputs.organization" @click.stop class="mt-2 w-full px-2 py-1 border rounded" 
                placeholder="Search organization"
              />
            </th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Email</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Phone</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">First Donation</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Last Donation</th>
            <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Actions</th>
            <th v-if="permissionLevel > 1" class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Select</th>
          </tr>
        </thead>

        <tbody>
        <tr
        v-for="idx in visibleIndices"
        :key="idx"
        class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer"
        >
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].name }}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].organization }}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].email }}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].phone }}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].firstDonationDate?.slice(0,10)}}</td>
        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].lastDonationDate?.slice(0,10) }}</td>
        <td class="px-6 py-4">
        <div class="flex justify-evenly">
        <button v-if="permissionLevel>0"
        class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
        @click="editFunction(props.data[idx])"
        >
        Edit
        </button>
        <button v-if="permissionLevel>0"
        class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"
        @click="deleteFunction(props.data[idx])"
        >
        Delete
        </button>
        <button
        class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6"
        @click="viewFunction(props.data[idx])"
        >
        View
        </button>
        </div>
        </td>
        <td>
        <div class="flex justify-center">
        <input
        v-if="props.data[idx].email && permissionLevel> 1"
        v-model="isChecked[idx]"
        type="checkbox"
        />
        </div>
        </td>
        </tr>
        </tbody>
      </table>
  </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed, type Ref } from 'vue'
  
  const props = defineProps<{
    data: { id: string, name: string, organization: string, email: string, phone: string, address: string, preferredCommunication: string, notes: string, webLink: string, firstDonationDate: any, lastDonationDate: any }[]
    emailFunction: (selected: boolean[]) => Promise<void>
    editFunction: (donor: { id: string, name: string, organization: string, email: string, phone: string, address: string, preferredCommunication: string, webLink: string, notes: string, firstDonationDate: any, lastDonationDate: any }) => Promise<void>
    viewFunction: (donor: { id: string, name: string, organization: string, email: string, phone: string, address: string, preferredCommunication: string, webLink: string, notes: string, firstDonationDate: any, lastDonationDate: any }) => Promise<void>
    permissionLevel:number
    }>()
  
  const emit = defineEmits(['delete-donor'])
  
  const isChecked: Ref<boolean[]> = ref(props.data.map(() => false))
  
  const selectedCount = computed(() => isChecked.value.filter(Boolean).length)
  const isEnabled = computed(() => selectedCount.value > 0)
  
  const activeSearch = ref<'name' | 'organization' | null>(null)
  const searchInputs = ref({ name: '', organization: '' })
  const searchFields = ['name', 'organization'] as const
  
  const toggleSearch = (field: 'name' | 'organization') => {
    activeSearch.value = activeSearch.value === field ? null : field
  }
  
  const visibleIndices = computed(() => {
    return props.data
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) =>
        searchFields.every((field) => {
          const search = searchInputs.value[field].toLowerCase().trim()
          if (!search) return true
          const value = (row[field] || '').toString().toLowerCase()
          return value.includes(search)
        })
      )
      .map(({ idx }) => idx)
  })
  
  const deleteFunction = async (data: (typeof props.data)[number]) => {
    emit('delete-donor', data)
  }
  </script>
  
<template>
    <div class="flex-1 p-8 ">
        <button v-if="permissionLevel>1" :disabled="!isEnabled" @click="emailFunction(isChecked)" class ="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6 my-3 ">Email Donors</button>
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('name')" v-if="activeSearch !== 'name'">Name ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.name" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search name"/>
                                    <button class="text-lg" @click="toggleSearch('name')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class = w-full>
                                <span @click="toggleSearch('organization')" v-if="activeSearch !== 'organization'">Organization ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.name" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Organization"/>
                                    <button class="text-lg" @click="toggleSearch('organization')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Email</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Phone</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">First Donation</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Last Donation</th>
                        <!-- <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Board Member</th> -->
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                        <th v-if="permissionLevel>1" class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Select</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,idx) in visibleIndices" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor.organization }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor.email }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor.phone }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row?.donations?.[0]?.receivedDate?  row?.donations?.[0]?.receivedDate.toString().split('T')[0] : "" }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row?.donations?.[row.donations.length-1]?.receivedDate?  row?.donations?.[row.donations.length-1]?.receivedDate?.toString().split('T')[0] : "" }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(props.data[idx].donor,idx)"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="deleteFunction(props.data[idx].donor,idx)"> Delete </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click ="viewFunction(props.data[idx].donor,idx)"> View </button>
                            </div>
                        </td>
                        <td v-if="permissionLevel>1">
                            <div class="flex justify-center">
                                <input autocomplete="off" v-if="row.donor.email" v-model="isChecked[idx]" type="checkbox"></input>
                            </div>     
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Donation, Donor } from '@prisma/client';

const props = defineProps<{
    data:{donor:Donor, donations:Donation[]}[]
    emailFunction: (selected:boolean[]) => Promise<void>
    editFunction: (donor:Donor,idx:number) => Promise<void>
    deleteFunction: (donor:Donor,idx:number) => Promise<void>
    viewFunction: (donor:Donor,idx:number) => Promise<void>
    permissionLevel:number
    }>();
const isChecked: Ref<boolean[]> = ref([])

props.data.forEach( (item,index) =>{
    isChecked.value[index] = false;
})

const selectedCount = computed(() => 
  isChecked.value.filter(Boolean).length
);
const isEnabled  = computed(() => selectedCount.value > 0);

const activeSearch = ref<'name' | 'organization' | null>(null)
const searchInputs = ref({ name: '', organization: ''})
const searchFields = ['name', 'organization'] as const
  
  const toggleSearch = (field: 'name' | 'organization') => {
    activeSearch.value = activeSearch.value === field ? null : field
    searchInputs.value = {name:'',organization:''};
  }

const visibleIndices = computed(() => {
  return props.data.filter((row) =>
    searchFields.every((field) => {
      const search = searchInputs.value[field].toLowerCase().trim()
      if (!search) return true
      
      const value = (row.donor[field] || '').toString().toLowerCase()
      return value.includes(search)
    })
  )
})

</script>
<template>
    <div class="flex-1 p-8 ">
  
    <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
    <table class="w-full">
    <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
    <tr>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
                            @click="toggleSearch('grantor')"
                        >
                            <span v-if="activeSearch !== 'grantor'">Grantor ↑↓</span>
                            <input
                                v-else
                                v-model="searchInputs.grantor"
                                @click.stop
                                class="mt-2 w-full px-2 py-1 border rounded"
                                placeholder="Search grantor"
                            />
        </th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
                            @click="toggleSearch('email')"
                        >
                            <span v-if="activeSearch !== 'email'">Email ↑↓</span>
                            <input
                                v-else
                                v-model="searchInputs.email"
                                @click.stop
                                class="mt-2 w-full px-2 py-1 border rounded"
                                placeholder="Search email"
                            />
        </th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Link</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Start Date</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">End Date</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Purpose</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Method</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Monetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Nonmonetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Status</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Notes</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer"
                            @click="toggleSearch('board')">
                            <span v-if="activeSearch !== 'board'">Board Member ↑↓</span>
                            <input
                                v-else
                                v-model="searchInputs.board"
                                @click.stop
                                class="mt-2 w-full px-2 py-1 border rounded"
                                placeholder="Search board"
                            />
                        </th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
    </tr>
    </thead>
    <tbody>
        <tr v-for = "(grant, index) in filteredAndSorted" :key="index" 
         class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.grantor.name}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.grantor.email}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.grantor.webLink}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.startDate.slice(0,10)}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.endDate.slice(0,10)}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.purpose}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.method}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.monetaryAmount}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.nonMonetaryAmount}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.status == 0 ? 'pending': 'approved'}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.notes}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.boardMember.name}}</td>

            <td>
                <div>
            <button   class ="rounded-md mt-2 text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"> Edit </button>

</div>
            </td>

        </tr>

         
                

 
    </tbody>
    </table>
    </div>
    </div>
    </template>
    
    <script setup>

import {ref, watch, computed} from 'vue';
const props = defineProps({
    grants :{
        type: Object
    }
})

const activeSearch = ref(null)

const searchInputs = ref({
    grantor: '',
    email: '',
    board: '',
})

const toggleSearch = (field) => {
    
    if (['grantor', 'email', 'board'].includes(field)) {
        activeSearch.value = activeSearch.value === field ? null : field
    }
}

const filteredAndSorted = computed(() => {
    let list = props.grants?.data || []

list = list.filter((g) => {
    return (
        (g.grantor?.name || '').toLowerCase().includes(searchInputs.value.grantor.toLowerCase()) &&
        (g.grantor?.email || '').toLowerCase().includes(searchInputs.value.email.toLowerCase()) &&
        (g.boardMember?.name || '').toLowerCase().includes(searchInputs.value.board.toLowerCase())
    )
})
return list
})

    
watch(() => props.grants, (newVal) => { 
    console.log("Grants data updated:", newVal);
}); 
    </script>
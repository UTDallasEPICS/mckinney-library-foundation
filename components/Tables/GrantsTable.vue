<template>
    <div class="flex-1 p-8 ">
  
    <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
    <table class="w-full">
    <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
    <tr>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Grantor</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Purpose</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Method</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Monetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Nonmonetary amount</th>
        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Status</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Select</th>
    </tr>
    </thead>
    <tbody>
        <tr v-for = "(grant, index) in props.grants?.data" :key="index" 
         class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.grantor}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.purpose}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.method}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.monetaryAmount}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.nonMonetaryAmount}}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ grant.status == 0 ? 'pending': 'approved'}}</td>

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

import {ref,watch} from 'vue';
const props = defineProps({
    grants :{
        type: Object
    }
})

watch(() => props.grants, (newVal) => { 
    console.log("Grants data updated:", newVal);
});




    
    
    </script>
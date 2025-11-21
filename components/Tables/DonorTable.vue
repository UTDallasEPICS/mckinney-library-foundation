<template>
<div class="flex-1 p-8 ">
<button :disabled="!isEnabled" @click="emailFunction(isChecked)" class ="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6 my-3 ">Email Donors</button>
<div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
<table class="w-full">
<thead  class="bg-[#c5d0d8] sticky top-0 z-10">
<tr>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Name</th>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Organization</th>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Email</th>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Phone</th>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">First Donation</th>
    <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Last Donation</th>
    <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
    <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Select</th>
</tr>
</thead>
<tbody>
<tr v-for="(row,idx) in data" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.name }}</td>
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.organization }}</td>
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.email }}</td>
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.phone }}</td>
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.firstDonationDate }}</td>
    <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.lastDonationDate }}</td>
    <td class="px-6 py-4">
        <div class="flex justify-evenly">
            <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row)"> Edit </button>
            <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="deleteFunction(row)"> Delete </button>
            <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click ="viewFunction(row)"> View </button>
        </div>
    </td>
    <td>
        <div class="flex justify-center">
            <input v-if="row.email" v-model="isChecked[idx]" type="checkbox"></input>
        </div>
            
    </td>
</tr>
</tbody>
</table>
</div>
</div>
</template>

<script setup lang="ts">
const props = defineProps<{
data:{id:string, name:string, organization:string, email:string, phone:string,address:string, preferredCommunication:string, notes:string,webLink:string, firstDonationDate:Date, lastDonationDate:Date}[]
emailFunction: (selected:boolean[]) => Promise<void>
editFunction: (donor:{id:string, name:string, organization:string, email:string, phone:string,address:string, preferredCommunication:string,webLink:string, notes:string, firstDonationDate:Date, lastDonationDate:Date}) => Promise<void>
deleteFunction: (donor:{id:string, name:string, organization:string, email:string, phone:string,address:string, firstDonationDate:Date, lastDonationDate:Date}) => Promise<void>
viewFunction: (donor:{id:string, name:string, organization:string, email:string, phone:string,address:string, preferredCommunication:string,webLink:string, notes:string, firstDonationDate:Date, lastDonationDate:Date}) => Promise<void>
}>();

const isChecked: Ref<boolean[]> = ref([])

props.data.forEach( (item,index) =>{
isChecked.value[index] = false;
})

const selectedCount = computed(() => 
isChecked.value.filter(Boolean).length
);
const isEnabled  = computed(() => selectedCount.value > 0);

</script>
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
                                    <input autocomplete="off" v-model="searchInputs.organization" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Organization"/>
                                    <button class="text-lg" @click="toggleSearch('organization')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class = w-full>
                                <span @click="toggleSearch('email')" v-if="activeSearch !== 'email'">Email ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.email" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Emaiils"/>
                                    <button class="text-lg" @click="toggleSearch('email')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class = w-full>
                                <span @click="toggleSearch('phone')" v-if="activeSearch !== 'phone'">Phone ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.phone" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Emaiils"/>
                                    <button class="text-lg" @click="toggleSearch('phone')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('firstDonoDate')" v-if="activeSearch !== 'firstDonoDate'">First Donation ↑↓</span>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestFirstDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestFirstDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch('firstDonoDate')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                         <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('lastDonoDate')" v-if="activeSearch !== 'lastDonoDate'">Last Donation ↑↓</span>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestLastDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestLastDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch('lastDonoDate')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('boardMember')" v-if="activeSearch !== 'boardMember'">Last Editor ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.boardMember" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Board Members"/>
                                    <button class="text-lg" @click="toggleSearch('boardMember')">&#x24E7;</button>
                                </div>
                            </div>
                        </th> 
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                        <th v-if="permissionLevel>1" class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="flex justify-center gap-2">
                                <span>Select</span>
                                <input autocomplete="off" @click="selectAll"  type="checkbox" :checked="allSelected"></input>
                            </div> 
                        </th>
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
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember? row.boardMember.name : "" }}</td>
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
    data:{donor:Donor, donations:Donation[], boardMember:{name:string} | null}[]
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

function selectAll(){
    const checkAll = !allSelected.value
    props.data.forEach((row,index) =>{
        if(row.donor.email !== ''){
            isChecked.value[index] = checkAll;
        }
    })
}


const isEnabled  = computed(() => selectedCount.value > 0);
const allSelected = computed(() => selectedCount.value == props.data.filter((row) =>{
    return row.donor.email !== ''
}).length)



const activeSearch = ref<'name' | 'organization' | 'boardMember' | 'firstDonoDate' | 'lastDonoDate' | 'email' | 'phone' |null>(null)
const searchInputs = ref({ name: '', organization: '', boardMember:'', firstDonoDate:'', lastDonoDate:'', email:'', phone:''})
const searchFields = ['name', 'organization', 'boardMember','firstDonoDate', 'lastDonoDate', 'email','phone'] as const
const earliestFirstDono = ref("");
const latestFirstDono= ref("");
const earliestLastDono = ref("");
const latestLastDono= ref("");

const toggleSearch = (field: 'name' | 'organization' | 'boardMember'|'firstDonoDate'| 'lastDonoDate' | 'email' | 'phone') => {
  activeSearch.value = activeSearch.value === field ? null : field
  searchInputs.value[field] = '';
  if(activeSearch.value == 'lastDonoDate' || activeSearch.value == 'firstDonoDate'){
    latestFirstDono.value = ""
    earliestFirstDono.value =""
    latestLastDono.value = ""
    earliestLastDono.value = ""
  }
}



const visibleIndices = computed(() => {
  return props.data.filter((row) =>
    searchFields.every((field) => {
        const search = searchInputs.value[field].toLowerCase().trim()
        if (activeSearch.value == null || (!search && !['firstDonoDate', 'lastDonoDate','email','phone'].includes(activeSearch.value) )) return true
        const value = ref("");
        switch(field){
            case 'boardMember' : value.value = row?.boardMember? row?.boardMember['name']?.toString().toLowerCase() ?? "" : ''; break;

            case 'firstDonoDate' : if(row.donations.length > 0){
                value.value = row?.donations[0].receivedDate?.toString().toLowerCase() ?? "";
                if(earliestFirstDono.value && latestFirstDono.value && earliestFirstDono.value < latestFirstDono.value){
                    const donationDate = new Date(value.value).toISOString().split('T')[0];
                    return (earliestFirstDono.value <= donationDate && donationDate <= latestFirstDono.value)
                }
                else{
                    return true;
                }
                }else if(activeSearch.value == 'firstDonoDate'){
                    return false;
                } 
                break;
            case 'lastDonoDate' : if(row.donations.length > 0){
                value.value = row?.donations[0].receivedDate?.toString().toLowerCase() ?? "";
                if(earliestLastDono.value && latestLastDono.value && earliestLastDono.value < latestLastDono.value){
                    const donationDate = new Date(value.value).toISOString().split('T')[0];
                    return (earliestLastDono.value <= donationDate && donationDate <= latestLastDono.value)
                }
                else{
                    return true;
                }
                }else if(activeSearch.value == 'lastDonoDate'){
                    return false;
                } 
                break;
            case 'email' : value.value = row?.donor['email']?.toString().toLowerCase() ?? ""
                if(activeSearch.value == 'email'){
                    if(value.value == ""){
                        return false;
                    }
                } 
                break;
            case 'phone' : value.value = row?.donor['phone']?.toString().toLowerCase() ?? ""
                if(activeSearch.value == 'phone'){
                    if(value.value == ""){
                        return false;
                    }
                } 
                break;  
            default : value.value = row?.donor[field]?.toString().toLowerCase() ?? ""; break;
        }

      
      return value.value.includes(search)
    })
  )
})

</script>
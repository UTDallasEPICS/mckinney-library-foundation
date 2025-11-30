<template>
    <div class="flex-1 p-8 ">
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('donorName')" v-if="activeSearch !== 'donorName'">Donor ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.donorName" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Donors"/>
                                    <button class="text-lg" @click="toggleSearch('donorName')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('event')" v-if="activeSearch !== 'event'">Event ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.event" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search event"/>
                                    <button class="text-lg" @click="toggleSearch('event')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('monetaryAmount')" v-if="activeSearch !== 'monetaryAmount'">Monetary Amount ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="minMoney"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <input autocomplete="off" v-model="maxMoney" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch('monetaryAmount')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('nonMonetaryAmount')" v-if="activeSearch !== 'nonMonetaryAmount'">Non-Monetary Amount ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.nonMonetaryAmount" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search"/>
                                    <button class="text-lg" @click="toggleSearch('nonMonetaryAmount')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('method')" v-if="activeSearch !== 'method'">Payment Method ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.method" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search method"/>
                                    <button class="text-lg" @click="toggleSearch('method')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('status')" v-if="activeSearch !== 'status'">Status ↑↓</span>
                                <div  v-else>
                                    <select autocomplete="off" v-model="searchInputs.status" @click.stop class="mt-2 px-2 py-1 border rounded">
                                        <option value=0>Pending</option>
                                        <option value=1>Recieved</option>
                                    </select>
                                    <button class="text-lg" @click="toggleSearch('status')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('receivedDate')" v-if="activeSearch !== 'receivedDate'">Recieved Date ↑↓</span>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch('receivedDate')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('boardName')" v-if="activeSearch !== 'boardName'">Board Member ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.boardName" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Board Members"/>
                                    <button class="text-lg" @click="toggleSearch('boardName')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,idx) in visibleIndices" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor?.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donation.event }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donation.monetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donation.nonMonetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donation.method }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donation.status == 0? "pending" : "recieved" }}</td>             
                        <td v-if= "row.donation.receivedDate" class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{row.donation.receivedDate? row.donation.receivedDate.toISOString().split('T')[0] : ""}}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember?.name }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(props.data[idx],idx)"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"@click=deleteFunction(row.donation.id,idx) > Delete </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(props.data[idx],idx)" > View </button>
                            </div>
                        </td>     
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Donation } from '@prisma/client';

const props = defineProps<{
    data:{donation:Donation,boardMember:{name:string} | null, donor: {name: string} | null}[],
    editFunction: (donationData:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number) => Promise<void>,
    viewFunction: (donationData:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number) => Promise<void>,
    deleteFunction: (id:string,index:number) => Promise<void>,
    permissionLevel:number
}>();




const activeSearch = ref<'status' | 'event' | 'method' | 'nonMonetaryAmount' |'donorName' | 'boardName' |'monetaryAmount' | 'receivedDate' | null>(null)
const searchInputs = ref({ status:'', event: '', method:'', nonMonetaryAmount:'', donorName:'' , boardName:'', monetaryAmount:'', receivedDate:''})
const searchFields = ['status', 'event', 'method', 'nonMonetaryAmount', 'donorName', 'boardName', 'monetaryAmount', 'receivedDate'] as const


const maxMoney = ref(0);
const minMoney = ref(0);
const earliestDono = ref("");
const latestDono= ref("");
  
  const toggleSearch = (field: 'status' | 'event' | 'method' | 'nonMonetaryAmount'| 'monetaryAmount'| 'donorName' |'boardName'| 'receivedDate') => {
    activeSearch.value = activeSearch.value === field ? null : field
    searchInputs.value[field] = '';
    if(field == 'monetaryAmount'){
        maxMoney.value = 0;
        minMoney.value = 0;
    }
    if(field == 'receivedDate'){
        earliestDono.value = ('')
        latestDono.value=('')
    }
  }

const visibleIndices = computed(() => {
  return props.data.filter((row) =>
    searchFields.every((field) => {
        const search = searchInputs.value[field].toLowerCase().trim() 
        if (!search && (activeSearch.value != 'monetaryAmount' && activeSearch.value != 'receivedDate' )){
            return true
        } 
        const value = ref('');
        switch(field){
            case 'donorName' : value.value = row?.donor? row?.donor['name']?.toString().toLowerCase() ?? "" : ''; break;
            case 'boardName' : value.value = row?.boardMember? row?.boardMember['name']?.toString().toLowerCase() ?? "" : ''; break;
            case 'monetaryAmount' : value.value = row?.donation[field]?.toString().toLowerCase() ?? ""; 
                                    if(minMoney.value < maxMoney.value){
                                        return (minMoney.value < parseInt(value.value) && parseInt(value.value) < maxMoney.value);
                                    }else{
                                        return true;
                                    }      
            case 'receivedDate' : value.value = row?.donation[field]?.toString().toLowerCase() ?? "";                                    
                                    if(earliestDono.value && latestDono.value && earliestDono.value < latestDono.value){
                                        const donationDate = new Date(value.value).toISOString().split('T')[0];
                                        console.log(donationDate)
                                        return (earliestDono.value <= donationDate && donationDate <= latestDono.value)
                                    }
                                    else{
                                        return true;
                                    }
            default: value.value = row?.donation[field]?.toString().toLowerCase() ?? ""; break;
        }     
      return value.value.includes(search) 
    })
  )
})






















</script>
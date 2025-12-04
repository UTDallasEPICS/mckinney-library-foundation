<template>
    <div class="flex-1 p-8 ">
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[0].active">Grantor</span>
                                <button @click="toggleSearch(0)" v-if="!activeSearch[0].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.grantorName" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Grantors"/>
                                    <button class="text-lg" @click="toggleSearch(0)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[0].active" @click="toggleSort(0)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(0)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>  
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[1].active">Purpose</span>
                                <button @click="toggleSearch(1)" v-if="!activeSearch[1].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.purpose" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search purpose"/>
                                    <button class="text-lg" @click="toggleSearch(1)">&#x24E7;</button>                               
                                </div>
                                <button v-if="activeSorts[1].active" @click="toggleSort(1)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(1)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[2].active">Monetary Amount ↑↓</span>
                                <button @click="toggleSearch(2)" v-if="!activeSearch[2].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="minMoney"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <input autocomplete="off" v-model="maxMoney" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch(2)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[2].active" @click="toggleSort(2)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(2)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[3].active">Non-Monetary Amount</span>
                                <button @click="toggleSearch(3)" v-if="!activeSearch[3].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.nonMonetaryAmount" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search"/>
                                    <button class="text-lg" @click="toggleSearch(3)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[3].active" @click="toggleSort(3)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(3)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[4].active">Payment Method</span>
                                <button @click="toggleSearch(4)" v-if="!activeSearch[4].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.method" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search method"/>
                                    <button class="text-lg" @click="toggleSearch(4)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[4].active" @click="toggleSort(4)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(4)"><NumberedListIcon class="w-4 h-4"/></button>
                                
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[5].active">Status</span>
                                <button @click="toggleSearch(5)" v-if="!activeSearch[5].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <select autocomplete="off" v-model="searchInputs.status" @click.stop class="mt-2 px-2 py-1 border rounded">
                                        <option value=0>Pending</option>
                                        <option value=1>Recieved</option>
                                    </select>
                                    <button class="text-lg" @click="toggleSearch(5)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[5].active" @click="toggleSort(5)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(5)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(6)" v-if="!activeSearch[6].active">Recieved Date</span>
                                <button @click="toggleSearch(6)" v-if="!activeSearch[6].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch(6)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[6].active" @click="toggleSort(6)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(6)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(7)" v-if="!activeSearch[7].active">Last Editor</span>
                                <button @click="toggleSearch(7)" v-if="!activeSearch[7].active"><FunnelIcon class="w-4 h-4"/></button>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.boardName" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Board Members"/>
                                    <button class="text-lg" @click="toggleSearch(7)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[7].active" @click="toggleSort(7)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(7)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-center text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,idx) in sortedIndices" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grantor?.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grant.purpose }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grant.monetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grant.nonMonetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grant.method }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grant.status == 0? "pending" : "recieved" }}</td>             
                        <td v-if= "row.grant.receivedDate" class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{row.grant.receivedDate? row.grant.receivedDate.toISOString().split('T')[0] : ""}}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember?.name }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row,props.data.indexOf(row))"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"@click=deleteFunction(row.grant.id,props.data.indexOf(row)) > Delete </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row,props.data.indexOf(row))" > View </button>
                            </div>
                        </td>     
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Grant } from '@prisma/client';
import { FunnelIcon } from '@heroicons/vue/24/solid';
import { NumberedListIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    data:{grant:Grant,boardMember:{name:string} | null, grantor: {name: string} | null}[],
    editFunction: (grantData:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number) => Promise<void>,
    viewFunction: (grantData:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number) => Promise<void>,
    deleteFunction: (id:string,index:number) => Promise<void>,
    permissionLevel:number
}>();




const activeSearch:Ref<{name:'status' | 'purpose' | 'method' | 'nonMonetaryAmount' |'grantorName' | 'boardName' |'monetaryAmount' | 'receivedDate', active:boolean}[]> = ref([
    {name:'grantorName',active:false},
    {name:'purpose',active:false},
    {name:'monetaryAmount',active:false},
    {name:'nonMonetaryAmount',active:false},
    {name:'method',active:false},
    {name:'status',active:false},
    {name:'receivedDate',active:false},
    {name:'boardName',active:false},
])
const searchInputs = ref({ status:'', purpose: '', method:'', nonMonetaryAmount:'', grantorName:'' , boardName:'', monetaryAmount:'', receivedDate:''})
const searchFields = ['status', 'purpose', 'method', 'nonMonetaryAmount', 'grantorName', 'boardName', 'monetaryAmount', 'receivedDate'] as const


const maxMoney = ref(0);
const minMoney = ref(0);
const earliestDono = ref("");
const latestDono= ref("");
  
  const toggleSearch = (index:number) => {
    activeSearch.value[index].active = !activeSearch.value[index].active;

    searchInputs.value[activeSearch.value[index].name] = '';
    if(activeSearch.value[index].name == 'monetaryAmount'){
        maxMoney.value = 0;
        minMoney.value = 0;
    }
    if(activeSearch.value[index].name == 'receivedDate'){
        earliestDono.value = ('')
        latestDono.value=('')
    }
  }



const visibleIndices = computed(() => {
  return props.data.filter((row) =>
    searchFields.every((field) => {
        const search = searchInputs.value[field].toLowerCase().trim() 
        if (!search && (!activeSearch.value[2].active && !activeSearch.value[6].active)){
            return true
        } 
        const value = ref('');
        switch(field){
            case 'grantorName' : value.value = row?.grantor? row?.grantor['name']?.toString().toLowerCase() ?? "" : ''; break;
            case 'boardName' : value.value = row?.boardMember? row?.boardMember['name']?.toString().toLowerCase() ?? "" : ''; break;
            case 'monetaryAmount' : value.value = row?.grant[field]?.toString().toLowerCase() ?? ""; 
                                    if(minMoney.value <= maxMoney.value && maxMoney.value !== 0){
                                        return (minMoney.value <= parseInt(value.value) && parseInt(value.value) <= maxMoney.value);
                                    }else{
                                        return true;
                                    }      
            case 'receivedDate' : value.value = row?.grant[field]?.toString().toLowerCase() ?? "";                                    
                                    if(earliestDono.value && latestDono.value && earliestDono.value < latestDono.value){
                                        const grantDate = new Date(value.value).toISOString().split('T')[0];
                                        return (earliestDono.value <= grantDate && grantDate <= latestDono.value)
                                    }
                                    else{
                                        return true;
                                    }
            default: value.value = row?.grant[field]?.toString().toLowerCase() ?? ""; break;
        }     
      return value.value.includes(search) 
    })
  )
})

const activeSorts:Ref<{name: 'grantorName'| 'status' | 'purpose' | 'method' | 'nonMonetaryAmount' | 'boardName' |'monetaryAmount' | 'receivedDate',active:boolean}[]>=ref([
    {name: 'grantorName', active:false},
    {name: 'purpose',active: false},
    {name: 'monetaryAmount', active:false},
    {name: 'nonMonetaryAmount',active:false},
    {name: 'method',active:false}, 
    {name: 'status',active: false},
    {name: 'receivedDate', active:true},
    {name: 'boardName', active:false},
]) 

function toggleSort(index:number){
    activeSorts.value[index].active = !activeSorts.value[index].active;
}

const sortedIndices = computed(() => {
    const sortActive = ref(false);
    activeSorts.value.forEach((field) =>{
        if(field.active){
            sortActive.value = true;
        }
    })
    if(!sortActive.value){
        return visibleIndices.value
    }
    else{
      return visibleIndices.value.toSorted((a,b) =>{  
        for (const field of activeSorts.value) {
            if (field.active) {
                let comparison = 0;
                switch(field.name) {
                    case 'grantorName':
                        const aName = a.grantor?.name || '';
                        const bName = b.grantor?.name || '';
                        comparison = aName.localeCompare(bName);
                        break;
                    case 'purpose' : 
                        const aPurpose = a.grant.purpose || '';
                        const bPurpose = b.grant.purpose || '';
                        comparison = aPurpose.localeCompare(bPurpose);
                        break;
                    case 'monetaryAmount': 
                        const aMon = a.grant.monetaryAmount || "100000"
                        const bMon = b.grant.monetaryAmount || "100000"
                        comparison = parseInt(aMon) - parseInt(bMon)
                        break;
                    case 'nonMonetaryAmount':
                        const aNonMon = a.grant.nonMonetaryAmount || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bNonMon = b.grant.nonMonetaryAmount || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aNonMon.localeCompare(bNonMon);
                        break;
                    case 'method' :
                        const aMethod = a.grant.method || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bMethod = b.grant.method || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aMethod.localeCompare(bMethod); 
                        break;
                    case 'status':
                        const aStatus = a.grant.status || 100000;
                        const bStatus = b.grant.status || 100000;
                        comparison = aStatus - bStatus; 
                        break;
                    case 'receivedDate':
                        const aDate = a.grant.receivedDate?.toISOString().split('T')[0] || ''
                        const bDate = b.grant.receivedDate?.toISOString().split('T')[0] || ''
                        comparison = bDate.localeCompare(aDate);
                        break;
                    case 'boardName' :
                        const aBName = a.boardMember?.name || '';
                        const bBName = b.boardMember?.name || '';
                        comparison = aBName.localeCompare(bBName);
                        break;
                }
                if(comparison !== 0){
                    return comparison
                }
            }
        }
        return 0;
        })
    }
})

</script>
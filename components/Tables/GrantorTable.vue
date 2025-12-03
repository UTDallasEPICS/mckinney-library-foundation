<template>
    <div class="flex-1 p-8 ">
        <button v-if="permissionLevel>1" :disabled="!isEnabled" @click="emailFunction(isChecked)" class ="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6 my-3 ">Email Grantors</button>
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(0)" v-if="!activeSearch[0].active">Name ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.name" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search name"/>
                                    <button class="text-lg" @click="toggleSearch(0)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[0].active" @click="toggleSort(0)" class="bg-[#c8c9c9] outline-double outline-black">A-Z &#8595;</button>
                                <button v-else @click="toggleSort(0)">A-Z &#8595;</button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class="w-full flex gap-2">
                                <span @click="toggleSearch(1)" v-if="!activeSearch[1].active">Organization ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.organization" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Organization"/>
                                    <button class="text-lg" @click="toggleSearch(1)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[1].active" @click="toggleSort(1)" class="bg-[#c8c9c9] outline-double outline-black">A-Z &#8595;</button>
                                <button v-else @click="toggleSort(1)">A-Z &#8595;</button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class="w-full flex gap-2">
                                <span @click="toggleSearch(2)" v-if="!activeSearch[2].active">Email ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.email" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Emaiils"/>
                                    <button class="text-lg" @click="toggleSearch(2)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[2].active" @click="toggleSort(2)" class="bg-[#c8c9c9] outline-double outline-black">A-Z &#8595;</button>
                                <button v-else @click="toggleSort(2)">A-Z &#8595;</button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                             <div class="w-full flex gap-2">
                                <span @click="toggleSearch(3)" v-if="!activeSearch[3].active">Phone ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.phone" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Emaiils"/>
                                    <button class="text-lg" @click="toggleSearch(3)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[3].active" @click="toggleSort(3)" class="bg-[#c8c9c9] outline-double outline-black">#&#8595;</button>
                                <button v-else @click="toggleSort(3)">#&#8595;</button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(4)" v-if="!activeSearch[4].active">First Grant ↑↓</span>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestFirstDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestFirstDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch(4)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[4].active" @click="toggleSort(4)" class="bg-[#c8c9c9] outline-double outline-black">#&#8595;</button>
                                <button v-else @click="toggleSort(4)">#&#8595;</button>
                            </div>
                        </th>
                         <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(5)" v-if="!activeSearch[5].active">Last Grant ↑↓</span>
                                <div  v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestLastDono" type="date"  @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestLastDono" type="date" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch(5)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[5].active" @click="toggleSort(5)" class="bg-[#c8c9c9] outline-double outline-black">#&#8595;</button>
                                <button v-else @click="toggleSort(5)">#&#8595;</button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span @click="toggleSearch(6)" v-if="!activeSearch[6].active">Last Editor ↑↓</span>
                                <div  v-else>
                                    <input autocomplete="off" v-model="searchInputs.boardMember" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search Board Members"/>
                                    <button class="text-lg" @click="toggleSearch(6)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[6].active" @click="toggleSort(6)" class="bg-[#c8c9c9] outline-double outline-black">#&#8595;</button>
                                <button v-else @click="toggleSort(6)">#&#8595;</button>
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
                    <tr v-for="(row,idx) in sortedIndices" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grantor.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grantor.organization }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grantor.email }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.grantor.phone }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row?.grants?.[0]?.receivedDate?  row?.grants?.[0]?.receivedDate.toString().split('T')[0] : "" }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row?.grants?.[row.grants.length-1]?.receivedDate?  row?.grants?.[row.grants.length-1]?.receivedDate?.toString().split('T')[0] : "" }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember? row.boardMember.name : "" }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row.grantor,props.data.indexOf(row))"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="deleteFunction(row.grantor,props.data.indexOf(row))"> Delete </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click ="viewFunction(row.grantor,props.data.indexOf(row))"> View </button>
                            </div>
                        </td>
                        <td v-if="permissionLevel>1">
                            <div class="flex justify-center">
                                <input autocomplete="off" v-if="row.grantor.email" v-model="isChecked[idx]" type="checkbox"></input>
                            </div>     
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Grant, Grantor } from '@prisma/client';

const props = defineProps<{
    data:{grantor:Grantor, grants:Grant[], boardMember:{name:string} | null}[]
    emailFunction: (selected:boolean[]) => Promise<void>
    editFunction: (grantor:Grantor,idx:number) => Promise<void>
    deleteFunction: (grantor:Grantor,idx:number) => Promise<void>
    viewFunction: (grantor:Grantor,idx:number) => Promise<void>
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
        if(row.grantor.email !== ''){
            isChecked.value[index] = checkAll;
        }
    })
}


const isEnabled  = computed(() => selectedCount.value > 0);
const allSelected = computed(() => selectedCount.value == props.data.filter((row) =>{
    return row.grantor.email !== ''
}).length)



const activeSearch:Ref<{name:'name' | 'organization' | 'boardMember' | 'firstDonoDate' | 'lastDonoDate' | 'email' | 'phone', active:boolean}[]> = ref([
    {name:'name',active:false},
    {name:'organization',active:false},
    {name:'email',active:false},
    {name:'phone',active:false},
    {name:'firstDonoDate',active:false},
    {name:'lastDonoDate',active:false},
    {name:'boardMember',active:false},
])
const searchInputs = ref({ name: '', organization: '', boardMember:'', firstDonoDate:'', lastDonoDate:'', email:'', phone:''})
const searchFields = ['name', 'organization', 'boardMember','firstDonoDate', 'lastDonoDate', 'email','phone'] as const
const earliestFirstDono = ref("");
const latestFirstDono= ref("");
const earliestLastDono = ref("");
const latestLastDono= ref("");

const toggleSearch = (index:number) => {
  activeSearch.value[index].active = !activeSearch.value[index].active;

    searchInputs.value[activeSearch.value[index].name] = '';
  if(activeSearch.value[index].name == 'lastDonoDate'){ 
    latestFirstDono.value = ""
    earliestFirstDono.value =""
  }
  if(activeSearch.value[index].name == 'lastDonoDate'){
    latestLastDono.value = ""
    earliestLastDono.value = ""
  }
  
}



const visibleIndices = computed(() => {
  return props.data.filter((row) =>
    searchFields.every((field) => {
        const search = searchInputs.value[field].toLowerCase().trim()
        if (activeSearch.value == null || (!search && !activeSearch.value[2].active && !activeSearch.value[3].active && !activeSearch.value[4].active && !activeSearch.value[5].active )){
            return true
        } 
        const value = ref("");
        switch(field){
            case 'boardMember' : value.value = row?.boardMember? row?.boardMember['name']?.toString().toLowerCase() ?? "" : ''; break;

            case 'firstDonoDate' : if(row.grants.length > 0){
                value.value = row?.grants[0].receivedDate?.toString().toLowerCase() ?? "";
                if(earliestFirstDono.value && latestFirstDono.value && earliestFirstDono.value < latestFirstDono.value){
                    const grantDate = new Date(value.value).toISOString().split('T')[0];
                    return (earliestFirstDono.value <= grantDate && grantDate <= latestFirstDono.value)
                }
                else{
                    return true;
                }
                }else if(activeSearch.value[4].active){
                    return false;
                } 
                break;
            case 'lastDonoDate' : if(row.grants.length > 0){
                value.value = row?.grants[row.grants.length-1].receivedDate?.toString().toLowerCase() ?? "";
                if(earliestLastDono.value && latestLastDono.value && earliestLastDono.value < latestLastDono.value){
                    const grantDate = new Date(value.value).toISOString().split('T')[0];
                    return (earliestLastDono.value <= grantDate && grantDate <= latestLastDono.value)
                }
                else{
                    return true;
                }
                }else if(activeSearch.value[5].active){
                    return false;
                } 
                break;
            case 'email' : value.value = row?.grantor['email']?.toString().toLowerCase() ?? ""
                if(activeSearch.value[2].active){
                    if(value.value == ""){
                        return false;
                    }
                } 
                break;
            case 'phone' : value.value = row?.grantor['phone']?.toString().toLowerCase() ?? ""
                if(activeSearch.value[3].active){
                    if(value.value == ""){
                        return false;
                    }
                } 
                break;  
            default : value.value = row?.grantor[field]?.toString().toLowerCase() ?? ""; break;
        }
      return value.value.includes(search)
    })
  )
})
const activeSorts:Ref<{name:'name' | 'organization' | 'boardMember' | 'firstDonoDate' | 'lastDonoDate' | 'email' | 'phone', active:boolean}[]>=ref([
    {name: 'name', active:false},
    {name: 'organization',active: false},
    {name: 'email', active:false},
    {name: 'phone',active:false},
    {name: 'firstDonoDate',active:false}, 
    {name: 'lastDonoDate',active: false},
    {name: 'boardMember', active:false},
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
                    case 'name':
                        const aName = a.grantor.name || '';
                        const bName = b.grantor.name || '';
                        comparison = aName.localeCompare(bName);
                        break;
                    case 'organization' : 
                        const aPurpose = a.grantor.organization || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bPurpose = b.grantor.organization || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aPurpose.localeCompare(bPurpose);
                        break;
                    case 'email': 
                        const aMon = a.grantor.email || 'ZZZZZZZZZZZZZZZZZZZZZZZ'
                        const bMon = b.grantor.email || 'ZZZZZZZZZZZZZZZZZZZZZZZ'
                        comparison = aMon.localeCompare(bMon);
                        break;
                    case 'phone':
                        const aPhone = a.grantor.phone || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bPhone = b.grantor.phone || 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aPhone.localeCompare(bPhone);
                        break;
                    case 'firstDonoDate' : 
                        const aFDate = a.grants.length > 0 ? (a.grants[0].receivedDate?.toString().split('T')[0] || 'ZZZZZZZZZZZZZZZZZZZZZZZ'): 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bFDate = b.grants.length > 0 ? (b.grants[0].receivedDate?.toString().split('T')[0] || 'ZZZZZZZZZZZZZZZZZZZZZZZ'): 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aFDate.localeCompare(bFDate);
                        break;
                    case 'lastDonoDate':
                        const aLDate = a.grants.length > 0 ? (a.grants[a.grants.length-1].receivedDate?.toString().split('T')[0] || 'ZZZZZZZZZZZZZZZZZZZZZZZ'): 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        const bLDate = b.grants.length > 0 ? (b.grants[b.grants.length-1].receivedDate?.toString().split('T')[0] || 'ZZZZZZZZZZZZZZZZZZZZZZZ'): 'ZZZZZZZZZZZZZZZZZZZZZZZ';
                        comparison = aLDate.localeCompare(bLDate);
                        break;
                    case 'boardMember':
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
<template>
    <div class="flex-1 p-8 ">
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Donor</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('event')" v-if="activeSearch !== 'event'">Event ↑↓</span>
                                <div  v-else>
                                    <input v-model="searchInputs.event" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search name"/>
                                    <button class="text-lg" @click="toggleSearch('event')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Monetary Amount</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Non-Monetary Amount</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class = w-full>
                                <span @click="toggleSearch('status')" v-if="activeSearch !== 'status'">Status ↑↓</span>
                                <div  v-else>
                                    <input v-model="searchInputs.status" @click.stop class="mt-2 px-2 py-1 border rounded"placeholder="Search name"/>
                                    <button class="text-lg" @click="toggleSearch('status')">&#x24E7;</button>
                                </div>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Date Recieved</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Board Member</th>
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="idx in visibleIndices" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].donor?.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].event }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].monetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].nonMonetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].status == 0? "pending" : "recieved" }}</td>             
                        <td v-if="props.data[idx].receivedDate" class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{props.data[idx].receivedDate? props.data[idx].receivedDate.toDateString() : ""}}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ props.data[idx].boardMember?.name }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(props.data[idx],idx)"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"@click=deleteFunction(props.data[idx].id,idx) > Delete </button>
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
import type { promises } from 'nodemailer/lib/xoauth2';

const props = defineProps<{
    data:{
        id: string,
        boardMemberId: string | null, 
        donorId: string | null,
        event: string | null, 
        method: string | null, 
        monetaryAmount: string | null, 
        nonMonetaryAmount: string | null, 
        status: number, notes: string | null, 
        receivedDate: Date | null,
        lastEditDate: Date | null
        boardMember:{name:string}| null, 
        donor: {name: string | null} | null,
    }[],
    editFunction: (donation:{id: string, boardMemberId: string | null, donorId: string | null,event: string | null, method: string | null, monetaryAmount: string | null, 
    nonMonetaryAmount: string | null, status: number, notes: string | null, receivedDate: Date | null,lastEditDate: Date | null, boardMember:{name:string | null}| null, donor: {name: string | null} | null},
    index:number) => Promise<void>,
    viewFunction: (donation:{id: string, boardMemberId: string | null, donorId: string | null,event: string | null, method: string | null, monetaryAmount: string | null, 
    nonMonetaryAmount: string | null, status: number, notes: string | null, receivedDate: Date | null,lastEditDate: Date | null, boardMember:{name:string | null}| null, donor: {name: string | null} | null},
    index:number) => Promise<void>,
    deleteFunction: (id:string,index:number) => Promise<void>,
    permissionLevel:number
}>();

const activeSearch = ref<'status' | 'event' | null>(null)
const searchInputs = ref({ status: '', event: ''})
const searchFields = ['status', 'event'] as const
  
  const toggleSearch = (field: 'status' | 'event') => {
    activeSearch.value = activeSearch.value === field ? null : field
    searchInputs.value = {status:'',event:''};
  }

const visibleIndices = computed(() => {
    return props.data
      .map((row, idx) => ({ row, idx }))
      .filter(({ row }) =>
        searchFields.every((field) => {
          const search = searchInputs.value[field].toLowerCase().trim()
          if (!search){
            return true
          } 
          const value = (row[field] || '').toString().toLowerCase()
          return value.includes(search)
        })
      )
      .map(({ idx }) => idx)
  })

</script>
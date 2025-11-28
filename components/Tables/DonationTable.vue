<template>
    <div class="flex-1 p-8 ">
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">       
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Donor</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Event</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Monetary Amount</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Non-Monetary Amount</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Status</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Date Recieved</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Board Member</th>
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,idx) in data" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.donor?.name }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.event }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.monetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.nonMonetaryAmount }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.status == 0? "pending" : "recieved" }}</td>             
                        <td v-if="row.receivedDate" class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{row.receivedDate?.getMonth() +1}}/{{row.receivedDate?.getDate() +1 }}/{{ row.receivedDate?.getFullYear() }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember?.name }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row,idx)"> Edit </button>
                                <button v-if="permissionLevel > 0" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"@click=deleteFunction(row.id,idx) > Delete </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row,idx)" > View </button>
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


</script>
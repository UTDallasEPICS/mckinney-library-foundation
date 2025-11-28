<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4" @submit="submitDonation">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Donation Information</h1>
            </div>
            <VeeField hidden name="boardMember"></VeeField>
            <VeeField hidden name="donor"></VeeField>
            <VeeField hidden name="id"></VeeField>
            <VeeField hidden name="index"></VeeField> 
            <div  class="grid grid-cols-2 gap-4">
                <h2 class="form-field-label">donor (name) <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">event <span class = "text-red-500">*</span></h2>            
                <VeeField v-slot="{field}" :disabled="viewOnly" name="donorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input v-bind="field" list="donor-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="donor-list">
                            <option></option>
                            <option v-for="donor in donors" :value="donor.name"></option>
                        </datalist>
                    </input>
                </VeeField>  
                <VeeField :disabled="viewOnly" name="event" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"/>                       
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <h2 class="form-field-label">monetary amount</h2>
                <h2 class="form-field-label">non monetary amount</h2>
                <VeeField :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="monetaryAmount"/>
                <VeeField :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="nonMonetaryAmount"/>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <h2 class="form-field-label">method <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">status</h2>
                <h2 class="form-field-label">Received Date</h2>
                <VeeField :disabled="viewOnly"name="method" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"/>
                <VeeField :disabled="viewOnly" v-slot="{field}" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="status">
                    <select v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option value = 0> Pending </option>
                        <option value = 1> Recieved </option>
                    </select>
                </VeeField>
                <VeeField v-slot="{field}" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="receivedDate">
                    <input :disabled="viewOnly" v-bind="field" type="date"></input>
                </VeeField>
            </div>

            <h2 class="form-field-label">Notes</h2>
            <VeeField :disabled="viewOnly" v-slot="{field}" name="notes">
                <textarea v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
            </VeeField>
            <div class="flex justify-center gap-4 my-2">
                <button class="form-button bg-gray-600 hover:bg-gray-700" @click="cancelSubmisison">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit </button>
            </div>           
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
import type { methods } from 'better-auth/vue';

const props = defineProps<{
    cancelSubmisison:() => void,
    submitDonation: (values: Record<string,any>) => Promise<void>         
    viewOnly: boolean
    index?:number
    donors:{id:string, name:string}[]
    donation?: { id: string, boardMemberId: string | null, donorId: string | null,event: string | null, 
                method: string | null, monetaryAmount: string | null, nonMonetaryAmount: string | null, 
                status: number, notes: string | null, receivedDate: Date | null, lastEditDate: Date | null, boardMember:{name:string| null}| null, donor: {name: string | null} | null}
}>();

const initValues = props.donation?{
    index:props.index, 
    id: props.donation.id,
    donorName: props.donation.donor? props.donation.donor.name : null,
    event: props.donation.event,
    monetaryAmount: props.donation.monetaryAmount,
    nonMonetaryAmount:props.donation.nonMonetaryAmount,
    method:props.donation.method,
    status:props.donation.status,
    notes:props.donation.notes,
    receivedDate: props.donation.receivedDate? props.donation.receivedDate.toISOString().split('T')[0] : '',
}: undefined

</script>
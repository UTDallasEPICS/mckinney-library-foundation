<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" :validation-schema="schema" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4" @submit="submitDonation">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Donation Information</h1>
            </div>
            <VeeField hidden name="id"></VeeField>
            <VeeField  hidden name="index"></VeeField> 
            <div  class="grid grid-cols-2 gap-4">
                <h2 class="form-field-label">donor (name) <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">event <span class = "text-red-500">*</span></h2>      
                <div>
                    <VeeErrorMessage class="text-red-500"  name="donorName" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="event" />
                </div>      
                <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="donorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="donor-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="donor-list">
                            <option></option>
                            <option v-if="donors.length > 0" v-for="donor in donors" :value="donor.donor.name"></option>
                        </datalist>
                    </input>
                </VeeField>  
                <VeeField autocomplete="off" :disabled="viewOnly" name="event" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"/>                       
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <h2 class="form-field-label">monetary amount</h2>
                <h2 class="form-field-label">non monetary amount</h2>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="monetaryAmount" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="nonMonetaryAmount" />
                </div>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="monetaryAmount"/>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="nonMonetaryAmount"/>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <h2 class="form-field-label">method <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">status<span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">Received Date<span class = "text-red-500">*</span></h2>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="method" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="status" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500" name="recievedDate" />
                </div>
                <VeeField autocomplete="off" :disabled="viewOnly"name="method" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"/>
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="status">
                    <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option :disabled="viewOnly" value = 0> Pending </option>
                        <option :disabled="viewOnly" value = 1> Recieved </option>
                    </select>
                </VeeField>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="receivedDate">
                    <input id="reqDate"  autocomplete="off" :disabled="viewOnly" v-model="recievedDateRef" v-bind="field" type="date"></input>
                </VeeField>
                </div>

            <h2 class="form-field-label">Notes</h2>
            <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="notes">
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
import type { Donation, Donor } from '@prisma/client';
import * as yup from 'yup';

const props = defineProps<{
    cancelSubmisison:() => void,
    submitDonation: (values: Record<string,any>) => Promise<void>         
    viewOnly: boolean
    index?:number
    donors:{donor:Donor, donations:Donation[]}[]
    data?:{donation:Donation,boardMember:{name:string}| null, donor: {name: string | null} | null}
}>();
const recievedDateRef = ref('');
const initValues = props.data?{
    index:props.index, 
    id: props.data.donation.id,
    donorName: props.data.donor? props.data.donor.name : null,
    event: props.data.donation.event,
    monetaryAmount: props.data.donation.monetaryAmount,
    nonMonetaryAmount:props.data.donation.nonMonetaryAmount,
    method:props.data.donation.method,
    status:props.data.donation.status,
    notes:props.data.donation.notes,
    receivedDate: props.data.donation.receivedDate? props.data.donation.receivedDate.toISOString().split('T')[0] : '',
}: undefined

if(initValues && initValues.receivedDate != ''){
    recievedDateRef.value = initValues.receivedDate;
}

const schema = yup.object({
    donorName: yup.string().required('Enter anonymous if donor unknown'),
    event: yup.string().required('Enter "none" if not associated with an event'),
    monetaryAmount: yup.number().nullable().min(0.01,"minimum is at least 0.01").typeError('must be a number'),
    nonMonetaryAmount: yup.string().nullable().test(
    'amount-not-empty',
    'donation must include either monetary or non-monetary amount',
    function (value) {
        const {monetaryAmount} = this.parent
        return (value != null && value !== '') || (monetaryAmount != null && monetaryAmount !== '')
    }),
    method: yup.string().required('Must enter payment method'),
    status: yup.string().required('Must enter status'),
    recievedDate: yup.string().test('date-not-empty', 'Date must be entered', ()=>{
        return recievedDateRef.value !== ''
    }),
})

</script>
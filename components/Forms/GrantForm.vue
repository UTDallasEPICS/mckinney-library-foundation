<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" :validation-schema="schema" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4" @submit="submitGrant">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Grant Information</h1>
            </div>
            <VeeField hidden name="id"></VeeField>
            <VeeField  hidden name="index"></VeeField> 
            <div  class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">grantor (name) <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">purpose <span class = "text-red-500">*</span></h2>                     
                <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="grantorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="grantor-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="grantor-list">
                            <option></option>
                            <option v-if="grantors.length > 0" v-for="grantor in grantors" :value="grantor.grantor.name"></option>
                        </datalist>
                    </input>
                </VeeField>  
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="purpose" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="purpose-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="purpose-list">
                            <option></option>
                            <option v-if="purposes.length > 0" v-for="purpose in purposes" :value="purpose"></option>
                        </datalist> 
                    </input>
                </VeeField>  
                <div>
                    <VeeErrorMessage class="text-red-500"  name="grantorName" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="purpose" />
                </div>                     
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">monetary amount</h2>
                <h2 class="form-field-label">non monetary amount</h2>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="monetaryAmount"/>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="nonMonetaryAmount"/>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="monetaryAmount" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="nonMonetaryAmount" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">method <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">status<span class = "text-red-500">*</span></h2>          
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly"name="method" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="method-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="method-list">
                            <option></option>
                            <option v-if="methods.length > 0" v-for="method in methods" :value="method"></option>
                        </datalist>
                    </input>
                </VeeField>
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="status">
                    <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option :disabled="viewOnly" value = 0> Pending </option>
                        <option :disabled="viewOnly" value = 1> Recieved </option>
                    </select>
                </VeeField>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="method" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="status" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">Proposed Date<span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">Received Date<span class = "text-red-500">*</span></h2>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="proposedDate">
                    <input id="propDate"  autocomplete="off" :disabled="viewOnly" v-model="proposedDateRef" v-bind="field" type="date"></input>
                </VeeField>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="receivedDate">
                    <input id="reqDate"  autocomplete="off" :disabled="viewOnly" v-model="recievedDateRef" v-bind="field" type="date"></input>
                </VeeField>
                <div>
                    <VeeErrorMessage class="text-red-500" name="proposedDate" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500" name="recievedDate" />
                </div>
            </div>
            <h2 class="form-field-label mb-2">Notes</h2>
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
import type { Grant, Grantor } from '~~/server/utils/generated/prisma/browser';
import * as yup from 'yup';

const props = defineProps<{
    cancelSubmisison:() => void,
    submitGrant: (values: Record<string,any>) => Promise<void>         
    viewOnly: boolean
    index?:number,
    purposes: string[],
    methods: string[],
    grantors:{grantor:Grantor, grants:Grant[]}[]
    data?:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string | null} | null}
}>();

const recievedDateRef = ref(new Date().toISOString());
const proposedDateRef = ref('');
const initValues = props.data?{
    index:props.index, 
    id: props.data.grant.id,
    grantorName: props.data.grantor? props.data.grantor.name : null,
    purpose: props.data.grant.purpose,
    monetaryAmount: props.data.grant.monetaryAmount,
    nonMonetaryAmount:props.data.grant.nonMonetaryAmount,
    method:props.data.grant.method,
    status:props.data.grant.status,
    notes:props.data.grant.notes,
    receivedDate: props.data.grant.receivedDate? props.data.grant.receivedDate.toISOString().split('T')[0] : '',
    proposedDate: props.data.grant.proposedDate? props.data.grant.proposedDate.toISOString().split('T')[0] : '',
}: undefined

if(initValues && initValues.receivedDate != ''){
    recievedDateRef.value = initValues.receivedDate;
}

const schema = yup.object({
    grantorName: yup.string().required('Enter anonymous if grantor unknown'),
    purpose: yup.string().required('Enter "none" if not associated with an purpose'),
    monetaryAmount: yup.number().nullable().min(0.01,"minimum is at least 0.01").typeError('must be a number'),
    nonMonetaryAmount: yup.string().nullable().test(
    'amount-not-empty',
    'grant must include either monetary or non-monetary amount',
    function (value) {
        const {monetaryAmount} = this.parent
        return (value != null && value !== '') || (monetaryAmount != null && monetaryAmount !== '')
    }),
    method: yup.string().required('Must enter payment method'),
    status: yup.string().required('Must enter status'),
    recievedDate: yup.string().test('date-not-empty', 'Recieved Date must be entered', ()=>{
        return recievedDateRef.value !== ''
    }),
    proposedDate: yup.string().test('date-not-empty', 'Proposed Date must be entered', ()=>{
        return proposedDateRef.value !== ''
    }),
})

</script>
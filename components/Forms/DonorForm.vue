<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" :validation-schema="schema" va @submit="submitDonor" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Donor Information</h1>
            </div>     
            <VeeField autocomplete="off" hidden name="id"></VeeField>
            <VeeField autocomplete="off" hidden name="index"></VeeField>  
            <div class="grid grid-cols-2 gap-4 mb-2">
                <h2 class = "form-field-label"> First Name </h2>        
                <h2 class = "form-field-label"> Last Name </h2>
                <VeeField autocomplete="off" :disabled="viewOnly" name="fName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField autocomplete="off" :disabled="viewOnly" name="lName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <div>
                    <VeeErrorMessage class="text-red-500" name= "fName" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500" name= "lName" />
                </div>
            </div>
            <div class = "gap-4 mb-5">
                <VeeField v-slot="{field}" name="isAuthor" type="checkbox" :value="true" :unchecked-value="false">
                        <div class="flex items-center gap-2">
                            <input
                                v-bind="field"
                                type="checkbox"
                                id="isAuthor"
                                :disabled="viewOnly"
                                class="accent-[#64748b] w-4 h-4 mt-[10px]"
                            />
                            <label for="isAuthor" class="form-field-label">Is the donor an author?</label>
                        </div>
                </VeeField>
            </div>
            <div class = "grid grid-cols-3 gap-4 mb-5">
                <h2 class = "form-field-label"> Phone </h2>
                <h2 class = "form-field-label"> Email </h2>
                <h2 class = "form-field-label"> Communication Preference </h2> 
                <VeeErrorMessage class="text-red-500 col-span-1" name="phone" />
                <VeeErrorMessage class="text-red-500 col-span-1" name="email" />
                <VeeField autocomplete="off" :disabled="viewOnly" name="phone" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField autocomplete="off" :disabled="viewOnly" name="email" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" name="preferredCommunication"class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option :value="null">None</option>
                        <option value = 0> Phone </option>
                        <option value = 1> Email </option> 
                    </select>
                </VeeField>
            </div>
            <div class = "mt-5 grid grid-cols-3 gap-4 my-8">
                <h2 class = "form-field-label"> Organization </h2>
                <h2 class = "form-field-label"> Address </h2>
                <h2 class = "form-field-label"> Web Link </h2>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" name="organization" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="method-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="method-list">
                            <option></option>
                            <option v-if="organizations.length > 0" v-for="organization in organizations" :value="organization"></option>
                        </datalist>
                    </input>
                </VeeField> 
                <VeeField autocomplete="off" :disabled="viewOnly" name="address" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField> 
                <VeeField autocomplete="off" :disabled="viewOnly" name="webLink"class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
            </div>
                <h2 class = "form-field-label mb-3"> Notes </h2>
                <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="notes">
                    <textarea :disabled="viewOnly" v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
                </VeeField>  
            <div class="flex justify-center gap-4 my-3">
                <button @click="cancelSubmisison()" class ="form-button bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit</button>
            </div>         
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
import type { Donor } from '@prisma/client';
import * as yup from 'yup';

    const props = defineProps<{
        donor?:Donor,
        cancelSubmisison:() => void,
        submitDonor: (values: Record<string,any>) => Promise<void>
        organizations:string[],
        viewOnly: boolean
        index?:number
}>();


const initValues = props.donor ?{
    index:props.index, 
    id: props.donor.id,
    fName: props.donor.name.split(' ')[0],
    lName: props.donor.name.split(' ')[1],
    organization: props.donor.organization,
    email: props.donor.email,
    phone:props.donor.phone,
    address:props.donor.address,
    preferredCommunication:props.donor.preferredCommunication,
    isAuthor: Boolean(props.donor.isAuthor),
    notes:props.donor.notes,
    webLink:props.donor.webLink
} : undefined

const schema = yup.object({
    fName: yup.string().required("first name is required"),
    lName: yup.string().required("last name is required"),
    isAuthor: yup.boolean(),

})
</script>
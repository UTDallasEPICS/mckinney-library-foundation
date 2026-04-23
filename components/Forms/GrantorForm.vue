<template>
    <div class="bg-[#e5e9ec] rounded-md p-6">
        <VeeForm :initial-values="initValues" :validation-schema="schema" va @submit="submitGrantor" class= "w-full max-w-3xl max-h-[80vh] overflow-y-auto mx-auto">
            <div class = "px-6 pt-6 pb-5">
              <h1 class = "form-title"> Grantor Information</h1>
            </div>     
            <VeeField autocomplete="off" hidden name="id"></VeeField>
            <VeeField autocomplete="off" hidden name="index"></VeeField>  
            <div class="grid gap-6 px-6 mb-4">
                <h2 class="form-field-label">Grantor <span class = "text-red-500">*</span></h2>
                <VeeField autocomplete="off" :disabled="viewOnly" name="grantorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeErrorMessage class="text-red-500" name= "grantorName" />
            </div>

            <div class = "grid grid-cols-3 gap-4 px-6 mb-5">
                <h2 class = "form-field-label"> Phone </h2>
                <h2 class = "form-field-label"> Email </h2>
                <h2 class = "form-field-label"> Communication Preference </h2>        
                <VeeField autocomplete="off" :disabled="viewOnly" name="phone" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField autocomplete="off" :disabled="viewOnly" name="email" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" name="preferredCommunication"class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option :value="null">None</option>
                        <option value = 0> Phone </option>
                        <option value = 1> Email </option> 
                    </select>
                </VeeField>
                <VeeErrorMessage class="text-red-500" name="phone" />
                <VeeErrorMessage class="text-red-500" name="email" />
            </div>
            <div class = "grid grid-cols-3 gap-4 px-6 mb-5">
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
            <div class="px-6 pb-6">
            <h2 class = "form-field-label mb-3"> Notes </h2>
                <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="notes">
                    <textarea :disabled="viewOnly" v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
                </VeeField>
            </div>
            <div class="flex justify-center gap-4 pb-6">
                <button @click="cancelSubmisison()" class ="form-button bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit</button>
            </div>         
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
import type { Grantor } from '~~/server/utils/generated/prisma/browser';
import * as yup from 'yup';

    const props = defineProps<{
        grantor?:Grantor,
        cancelSubmisison:() => void,
        submitGrantor: (values: Record<string,any>) => Promise<void>
        organizations:string[],
        viewOnly: boolean
        index?:number
}>();

const initValues = props.grantor?{
    index:props.index, 
    id: props.grantor.id,
    grantorName: props.grantor.name,
    organization: props.grantor.organization,
    email: props.grantor.email,
    phone:props.grantor.phone,
    address:props.grantor.address,
    preferredCommunication:props.grantor.preferredCommunication,
    notes:props.grantor.notes,
    webLink:props.grantor.webLink
}: undefined

const schema = yup.object({
    grantorName: yup.string().required("Enter anonymous if grantor unknown'"),
})
</script>
<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" @submit="submitDonor" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Donor Information</h1>
            </div>     
            <VeeField hidden name="id"></VeeField>
            <VeeField hidden name="index"></VeeField>  
            <div class="grid grid-cols-2 gap-4">
                <h2 class = "form-field-label"> first name </h2>
                <h2 class = "form-field-label"> last name </h2>
                <VeeField :disabled="viewOnly" name="fName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField :disabled="viewOnly" name="lName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
            </div>

            <div class = "grid grid-cols-3 gap-4">
                <h2 class = "form-field-label"> phone </h2>
                <h2 class = "form-field-label"> email </h2>
                <h2 class = "form-field-label"> Communication Prefrence </h2> 
                <VeeField :disabled="viewOnly" name="phone" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField :disabled="viewOnly" name="email" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
                <VeeField :disabled="viewOnly" name="preferredCommunication"class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
            </div>
            <div class = "grid grid-cols-3 gap-4">
                <h2 class = "form-field-label"> organization </h2>
                <h2 class = "form-field-label"> address </h2>
                <h2 class = "form-field-label"> web link </h2>
                <VeeField :disabled="viewOnly" name="organization"></VeeField> 
                <VeeField :disabled="viewOnly" name="address" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField> 
                <VeeField :disabled="viewOnly" name="webLink"class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></VeeField>
            </div>
            <h2 class = "form-field-label"> notes </h2>
            <VeeField v-slot="{field}" :disabled="viewOnly" name="notes">
                <textarea v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
            </VeeField>
            
            
            <div class="flex justify-center gap-4 my-2">
                <button @click="cancelSubmisison()" class ="form-button bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit</button>
            </div>         
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        donor?:{id:string, name:string, organization:string, email:string, phone:string,address:string, preferredCommunication:string, notes:string,webLink:string},
        cancelSubmisison:() => void,
        submitDonor: (values: Record<string,any>) => Promise<void>
        viewOnly: boolean
        index?:number
}>();

const initValues = props.donor?{
    index:props.index, 
    id: props.donor.id,
    fName: props.donor.name.split(' ')[0],
    lName: props.donor.name.split(' ')[1],
    organization: props.donor.organization,
    email: props.donor.email,
    phone:props.donor.phone,
    address:props.donor.address,
    preferredCommunication:props.donor.preferredCommunication,
    notes:props.donor.notes,
    webLink:props.donor.webLink
}: undefined
</script>
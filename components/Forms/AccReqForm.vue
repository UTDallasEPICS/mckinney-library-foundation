<template>
    <VeeForm :initial-values="initalVals" :validation-schema="AccReqFormSchema" @submit="submit">
        <h3 class="form-field-label">First Name</h3>
        <VeeErrorMessage class="text-red-500" name= "fName"/>
        <VeeField name="fName" placeholder="First" 
        class ="form-input bg-[#f5f6f8]"/>
        <h3 class="form-field-label">Last Name</h3>
        <VeeErrorMessage class="text-red-500" name= "lName"/>
        <VeeField name="lName" placeholder="Last"
        class ="form-input bg-[#f5f6f8]"/>
        <h3 class="form-field-label">Email</h3>
        <VeeErrorMessage class="text-red-500" name= "email"/>
        <VeeField name="email" placeholder="Email"
        class ="form-input bg-[#f5f6f8]"/>
        <h3 v-if="type" class="form-field-label">Role</h3>
        <VeeField v-if="type" v-slot="{field}" name="permission">
            <select v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                <option value="0">Viewer</option>
                <option value="1">Editor</option>
                <option value="2">Admin</option>
                <option value="3">Main Admin</option>
            </select>
        </VeeField>
        <button class ="account-btn bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] hover:shadow-xl"> {{ buttonText }}</button> 
        <button v-if="account" @click="cancelFunciton" class="account-btn bg-gradient-to-r from-[#606263] to-[#7d7e7f] hover:shadow-xl mb-4"> Cancel </button>
    </VeeForm>
</template>

<script setup lang="ts">
    import * as yup from "yup";

    const props = defineProps<{
        function: (values: Record<string, any>) => Promise<void>,
        type:  boolean, 
        buttonText: string,
        account?: {id:string, name:string, email:string, permission:number}
        cancelFunciton?: () => void
    }>();

    const AccReqFormSchema = yup.object({
        email: yup.string().required("Email is required").email("Please enter a valid email address (example@domain.com)"),
        fName: yup.string().required("First name required"),
        lName: yup.string().required("Last name required"),
});
    const submit = props.function;

const initalVals: Ref<{fName:string, lName:string, email:string, permission:number}> = ref(
    {fName:"",lName:"",email:"",permission:0});
    
if(props.account){
    initalVals.value = {
        fName: props.account.name.split(' ')[0],
        lName: props.account.name.split(' ')[1] || "",
        email: props.account.email,
        permission: props.account.permission
    }
}

</script>



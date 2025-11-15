<template>
    <VeeForm :validation-schema="AccReqFormSchema" @submit="submit">
        <h3>First Name</h3>
        <VeeErrorMessage class="text-red-500" name= "fName"/>
        <VeeField name="fName" placeholder="First" 
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Last Name</h3>
        <VeeErrorMessage class="text-red-500" name= "lName"/>
        <VeeField name="lName" placeholder="Last"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Email</h3>
        <VeeErrorMessage class="text-red-500" name= "email"/>
        <VeeField name="email" placeholder="Email"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3 v-if="!req">Role</h3>
        <VeeField v-if="!req" v-slot="{field}" name = "permission" value="0" placeholder="Viewer">
            <select v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                <option value="0">Viewer</option>
                <option value="1">Editor</option>
                <option value="2">Admin</option>
                <option value="3">Main Admin</option>
            </select>
        </VeeField>
        <button v-if="req" class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl"> Send Request 
        </button> 
        <button v-if="!req" class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl"> Create Account 
        </button>
    </VeeForm>
</template>

<script setup lang="ts">
    import * as yup from "yup";

    const props = defineProps<{
        function: (values: Record<string, any>) => Promise<void>,
        request:  boolean
    }>();

    const AccReqFormSchema = yup.object({
        email: yup.string().required("Email is required").email("Please enter a valid email address (example@domain.com)"),
        fName: yup.string().required("First name required"),
        lName: yup.string().required("Last name required"),
});

    const req = ref(props.request)
    const submit = props.function;
</script>
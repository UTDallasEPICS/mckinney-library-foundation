<template>
    <VeeForm :validation-schema="validation" @submit="submit">
        <h3>First Name</h3>
        <VeeField name="fName" placeholder="First" 
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Last Name</h3>
        <VeeField name="lName" placeholder="Last"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Email</h3>
        <VeeErrorMessage class="text-red-500" name= "email"/>
        <VeeField name="email" placeholder="Email"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl"> Send Request 
        </button> 
    </VeeForm>
</template>

<script setup lang="ts">
    import * as yup from "yup";

    const props = defineProps<{
        validation:  yup.AnySchema,
    }>();
    const submit = requestAccount

    async function requestAccount(values:Record<string,any>){
        alert("account requested");
        console.log(values);
        const info = await $fetch("/api/auth/request",{
            method: "POST",
            body:{
                name: values.fName + " " + values.lName,
                email: values.email
            }
        });
        reloadNuxtApp();
    }
</script>
<template>
   <div class = "flex items-center basis-1/2">
      <div class = "bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 w-2/5 mx-auto my">
        <AccReqForm
        key="AdminAccCreate"
        :function="AccReqFormProps.function"
        :request="AccReqFormProps.request"
        />
      </div>
    </div>
  
</template>

<script setup lang="ts">
import AccReqForm from '~/components/Login/AccReqForm.vue';
import * as yup from "yup";


const AccReqFormSchema = yup.object({
  email: 
    yup.string()
    .required("Email is required")
    .email("Please enter a valid email address (example@domain.com)"),
  fName: yup.string().required(),
  lName: yup.string().required(),
});

const AccReqFormProps ={
  function: createAccount,
  request: false,
}

async function createAccount(values:Record<string,any>){
    alert("account created");
    const info = await $fetch("/api/user",{
        method: "POST",
        body:{
            name: values.fName + " " + values.lName,
            email: values.email,
            permission: parseInt(values.permission),
            isRequest: false
        }
    });
    navigateTo("/settings/accounts");
}

</script>
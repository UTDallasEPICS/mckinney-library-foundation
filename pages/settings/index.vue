<template>
   <div class = "flex items-center basis-1/2">
      <div class = "bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 w-2/5 mx-auto my-8 my">
        <AccReqForm
        key="AdminAccCreate"
        :function="AccReqFormProps.function"
        :type="AccReqFormProps.type"
        button-text="Create Account"
        />
      </div>
    </div>
  
</template>

<script setup lang="ts">
import AccReqForm from '~/components/Forms/AccReqForm.vue';
import * as yup from "yup";
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();

const permissionLevel = ref(0);

if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
  if(permissionLevel.value < 3){
    navigateTo("/dashboard");
  }
}
else{
  navigateTo("/");
}

const AccReqFormProps ={
  function: createAccount,
  type: true,
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
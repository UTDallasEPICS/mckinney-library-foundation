<template>
   <div class = "flex items-center basis-1/2">
      <div class = "bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 w-2/5 mx-auto my-8 my">
        <AccountForm
        key="AdminAccCreate"
        :function="AccountFormProps.function"
        :type="AccountFormProps.type"
        button-text="Create Account"
        />
      </div>
    </div>
  
</template>

<script setup lang="ts">
import AccountForm from '~/components/Forms/AccountForm.vue';
import * as yup from "yup";
import { useAuth } from '~/composables/useAuth';

const { data: session } = await useAuth();

const permissionLevel = ref(0);
const toasts = useToast()

if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
  if(permissionLevel.value < 3){
    navigateTo("/dashboard");
  }
}
else{
  navigateTo("/");
}

const AccountFormProps ={
  function: createAccount,
  type: false,
}

async function createAccount(values:Record<string,any>){
    toasts.add({
      title: "Account created!"
    });
    const info = await $fetch("/api/user",{
        method: "POST",
        body:{
            name: values.fName + " " + values.lName,
            email: values.email.toLowerCase(),
            permission: parseInt(values.permission),
            permissionLevel:permissionLevel.value,
            firstLogin: true
        }
    });
    navigateTo("/settings/accounts");
}

</script>
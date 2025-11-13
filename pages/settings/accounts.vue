<template>
<h1 class="text-[36px] text-[#2c3e50] text-center py-5 mb-2"> Manage Accounts </h1>
 <AccountTable 
  key= "ExistingAccounts"
  :accounts="ExistingAccountsProps.users"
  :accept-function="ExistingAccountsProps.acceptFunction"
  :deny-function="ExistingAccountsProps.denyfunciton"
  :accept-name="ExistingAccountsProps.acceptName"
  :deny-name="ExistingAccountsProps.denyName"
  :request="ExistingAccountsProps.request"
/>

<h1 v-if="requests && requests.length > 0" class="text-[36px] text-[#2c3e50] text-center py-5 mb-2">Account Requests </h1>
<AccountTable v-if="requests && requests.length > 0"
  key= "RequestTable"
  :accounts="requestTableProps.requests"
  :accept-function="requestTableProps.acceptFunction"
  :deny-function="requestTableProps.denyfunciton"
  :accept-name="requestTableProps.acceptName"
  :deny-name="requestTableProps.denyName"
  :request="requestTableProps.request"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountTable from '~/components/accounts/AccountTable.vue';


const requestOBJ = await useFetch("/api/request");
const requests = requestOBJ.data.value;
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
}

const usersOBJ = await useFetch("/api/user");
const vUsers = usersOBJ.data.value;


const requestTableProps ={
  requests: requests,
  acceptName: "Accept",
  denyName: "Deny",
  acceptFunction: createAccount,
  denyfunciton: removeRequest,
  request: true
}

const ExistingAccountsProps ={
  users: vUsers,
  acceptName: "Freeze",
  denyName: "Delete",
  acceptFunction: freezeAccount,
  denyfunciton: deleteAccount,
  request: false
}




async function freezeAccount(account: {id: string, name: string, email: string, permission: number, status: boolean}){
  account.status = !account.status;
  const id = account.id;
  await $fetch(`/api/user/${id}`,{
      method: "PATCH",
      body:{
        status: account.status,
        permission:account.permission
      }
    }
  )
  refreshNuxtData();
}

async function deleteAccount(id:string){
  await $fetch(`/api/user/${id}`,{
    method:"DELETE",
  })
  reloadNuxtApp();
}


async function createAccount(account: {id: string, name: string, email: string, permission: number, status: boolean}){
  alert("account created for : " + account.email);
  await $fetch("/api/user",{
    method: "POST",
    body:{
      name:account.name,
      email:account.email,
      permision: 0,
      id:account.id,
      isRequest: true,
    }
  });
  reloadNuxtApp();
}

async function removeRequest(id:string){
  await $fetch(`/api/request/${id}`, {
    method: 'DELETE',
  });
  reloadNuxtApp();
}
</script>
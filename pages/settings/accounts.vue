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


const requestOBJ = await useFetch("/api/auth/request");
const requests = requestOBJ.data.value;
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
}

const usersOBJ = await useFetch("/api/users/user");
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
  //alert("freezing/unfreezing");
  account.status = !account.status;
  await $fetch("/api/users/status",{
      method: "PATCH",
      body:{
        id:account.id,
        status: account.status
      }
    }
  )
  refreshNuxtData();
}

async function deleteAccount(id:string){
  await $fetch("/api/users/user",{
    method:"DELETE",
    body:{
      id:id
    }
  })
  reloadNuxtApp();
}


async function createAccount(account: {id: string, name: string, email: string, permission: number, status: boolean}){
  alert("account created for : " + account.email);
  await $fetch("/api/auth/user",{
    method: "POST",
    body:{
      name:account.name,
      email:account.email,
      permision: 0,
      id:account.id,
      isRequest: true,
    }
  })
  reloadNuxtApp();
}

async function removeRequest(id:string){
  await $fetch("/api/auth/request", {
    method: 'DELETE',
    body:{
      id:id,
    }
  })
  reloadNuxtApp();
}

const users = ref([
  { firstName: "John", lastName: "Doe", role: "Admin", email: "johndoe@gmail.com", status: "Active" },
  { firstName: "Jane", lastName: "Doe", role: "Editor", email: "janedoe@gmail.com", status: "Frozen" },
  { firstName: "Main", lastName: "Admin", role: "Main Admin", email: "MPLFBoard@gmail.com", status: "Active" }
]);
//logic to check session permission level here
//

const roles = ref(["Admin", "Editor", "Main Admin"]);
</script>
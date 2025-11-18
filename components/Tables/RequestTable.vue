<template>
    <div class="flex-1 p-8 ">
      <div class= "bg-white rounded-lg shadow-lg overflow-hidden max-w-7xl mx-auto">
        <table class="w-full">
          <thead class="bg-[#5a6a77] text-white">
            <tr>
              <th class="px-6 py-4 text-center text-sm">Name</th>
              <th class="px-6 py-4 text-center text-sm"> Email</th>
              <th class="px-6 py-4 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(request,index) in requests" :key=index class="bg-[#e5e9ec]">
            <td class="px-6 py-4 text-[#2d3e4d] text-center"> {{ request.name }}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-center">{{ request.email }} </td> 
            <td class="px-6 py-4">
              <div class="flex justify-evenly">
                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="createAccount(request,index)"> Accept</button>
                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="removeRequest(request.id,index)"> Deny  </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>     
    </div>     
  </template>

<script setup lang="ts">

const props = defineProps<{
        requests: {id: string;name: string;email: string;}[] | null
}>();
async function createAccount(account: {id:string, name: string, email: string},index:number){
  alert("account created for : " + account.email);
  const {success} = await $fetch("/api/user",{
    method: "POST",
    body:{
      name:account.name,
      email:account.email,
      permision: 0,
    }
  });
  if(success){
    await removeRequest(account.id,index);
  }
  
}

async function removeRequest(id:string,index:number){
  const {success} = await $fetch(`/api/request/${id}`, {
    method: 'DELETE',
  });
  if(success){
    props.requests?.splice(index,1);
  }
  
}

</script>
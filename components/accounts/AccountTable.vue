<template>
    <div class="flex-1 p-8 ">
      <div class= "bg-white rounded-lg shadow-lg overflow-hidden max-w-7xl mx-auto">
        <table class="w-full">
          <thead class="bg-[#5a6a77] text-white">
            <tr>
              <th class="px-6 py-4 text-center text-sm">Name</th>
              <th class="px-6 py-4 text-center text-sm"> Email</th>
              <th class="px-6 py-4 text-center text-sm"> Role</th>
              <th class="px-6 py-4 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(account,index) in accounts" :key="index" class="bg-[#e5e9ec]">
            <td class="px-6 py-4 text-[#2d3e4d] text-center"> {{ account.name }}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-center">{{ account.email }} </td> 
            <td class="px-6 py-4">
                <select v-if="!req" v-model="permissions[index]" @change="updatePermission(account.id,permissions[index])" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] cursor-pointer">
                    <option value="0">Viewer</option>
                    <option value="1">Editor</option>
                    <option value="2">Admin</option>
                    <option value="3">Main Admin</option>
                </select>
                <p v-else class="w-full px-3 py-2 text-center border-gray-300 rounded text-[#2d3e4d] cursor-pointer"> Viewer </p>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-evenly">
                <button v-if="!account.status" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="acceptFunction(account)"> {{ props.acceptName }} </button>
                <button v-else class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6" @click="acceptFunction(account)"> Unfreeze </button>
                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="denyFunction(account.id)"> {{ props.denyName }}  </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      
    </div>
      
  </template>

<script setup lang="ts">

async function updatePermission(id:string,permission:string){
    await $fetch("/api/users/permission",{
        method:"PATCH",
        body:{
            id:id,
            permission:Number(permission)
        }
    }
    )
}

const props = defineProps<{
        accounts: {id: string;name: string;email: string; permission:number; status:boolean}[] | null
        acceptName: string
        denyName: string
        request: boolean
        acceptFunction: (account: {id: string, name: string, email: string, permission: number, status: boolean}) => Promise<void>
        denyFunction: (id: string) => Promise<void>
}>();
const req = ref(props.request);

const permissions = ref(["1"]);
if(props.accounts){
    for(let i = 0; i < props.accounts.length; i++){
        permissions.value[i] = props.accounts[i].permission.toString();
    }
}


</script>
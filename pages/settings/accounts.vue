<template>
    <div class="flex-1 p-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-7xl mx-auto">
        <table class="w-full">
          <thead class="bg-[#5a6a77] text-white">
            <tr>
              <th class="px-6 py-4 text-left text-sm">First Name</th>
              <th class="px-6 py-4 text-left text-sm">Last Name</th>
              <th class="px-6 py-4 text-left text-sm">Role</th>
              <th class="px-6 py-4 text-left text-sm">Email</th>
              <th class="px-6 py-4 text-left text-sm">Manage Account</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-[#e5e9ec]">
              <td class="px-6 py-4 text-[#2d3e4d]">John</td>
              <td class="px-6 py-4 text-[#2d3e4d]">Doe</td>
              <td class="px-6 py-4">
                <select class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Main Admin">Main Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
            </td>
            <td class="px-6 py-4 text-[#2d3e4d]">JohnDoe@gmail.com</td>
            <td class="px-6 py-4">
              <div class="flex space-x-3">
                <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white px-6">Freeze</button>
                <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white px-6">Delete</button>
              </div>
            </td>
          </tr>
          <tr class="bg-white">
            <td class="px-6 py-4 text-[#2d3e4d]">Jane</td>
            <td class="px-6 py-4 text-[#2d3e4d]">Doe</td>
            <td class="px-6 py-4"><select class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Main Admin">Main Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </td>
          <td class="px-6 py-4 text-[#2d3e4d]">JaneDoe@gmail.com</td>
          <td class="px-6 py-4"><div class="flex space-x-3">
            <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white px-6">Freeze</button>
            <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white px-6">Delete</button>
          </div>
        </td>
      </tr>
      <tr class="bg-[#e5e9ec]">
        <td class="px-6 py-4 text-[#2d3e4d]">Main</td>
        <td class="px-6 py-4 text-[#2d3e4d]">Admin</td>
        <td class="px-6 py-4">
          <select class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
            <option value="Admin">Admin</option><option value="Editor">Editor</option>
            <option value="Main Admin">Main Admin</option><option value="Viewer">Viewer</option>
          </select>
        </td>
        <td class="px-6 py-4 text-[#2d3e4d]">MPLFBoard@gmail.com</td>
        <td class="px-6 py-4">
          <div class="flex space-x-3">
            <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white px-6">Freeze</button>
            <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 py-2 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white px-6">Delete</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    
    <!-- <div v-else class="no-data-message"> -->
      <!-- No accounts found. Add your first account. -->
    <!-- </div> -->
    <!-- please, please do not keep this in the final page - this is ONLY for testing -->
     <template v-if="requests && requests.length > 0">
        <h1> Account Requests</h1>
        <table >
        <thead>
           <tr>
          <th>Name</th>
          <th>Email</th>
          <th colspan="2">Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests">
            <td> {{ request.name }}</td>
            <td>{{ request.email }} </td> 
            <td><button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl" @click="createAccount(request.id,request.email,request.name)"> Accept </button></td>
            <td><button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#964240] to-[#c62929] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl" @click ="removeRequest(request.id)"> Deny </button></td>
          </tr>
        </tbody>
     </table>
     </template>
      
     
        
  </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';

async function createAccount(id:string,email:string, name:string){
  alert("account created for : " + email);
  await $fetch("/api/auth/user",{
    method: "POST",
    body:{
      name:name,
      email:email,
      permision: 0,
      id:id,
      isRequest: true,
    }
  })
  reloadNuxtApp();
}

async function removeRequest(id:string){
  await $fetch("/api/auth/request", {
    method: 'DELETE',
    query:{
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
const requestOBJ = await useFetch("/api/auth/request");
const requests = requestOBJ.data.value;
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
}


const roles = ref(["Admin", "Editor", "Main Admin"]);
</script>
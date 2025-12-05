<template>
  <div class="flex-1 p-8 ">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
      <table class="w-full">
        <thead  class="bg-[#c5d0d8] sticky top-0 z-10"> 
          <tr>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Role Name</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">View "Donations" and "Grants" </th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors"> Edit "Donations" and "Grants"</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">View "Settings" </th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Edit "Manage Accounts"</th>
            <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Edit "Create Accounts"</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm"> Main Admin </td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg">✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg">✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg">✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg">✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg">✓</td>
          </tr>
          <tr class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
            <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm"> Admin </td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
            <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
            <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
        </tr>
        <tr class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
          <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm"> Editor </td>
          <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
          <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
          <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg">X</td>
        </tr>
        <tr class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
          <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm"> Viewer </td>
          <td class="px-6 py-4 text-green-600 text-left font-extrabold text-lg" >✓</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
          <td class="px-6 py-4 text-red-600 text-left font-bold text-lg" >X</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();

const permissionLevel = ref(0);
if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
  if(permissionLevel.value < 1){
    navigateTo("/dashboard");
  }
}
else{
  navigateTo("/");
}

</script>
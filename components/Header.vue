<template> 
 <header v-if="signedIn" class="bg-[#34495e] text-white">
      <div class="mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class = " px-4 py-4 bg-slate-500 rounded border-[0.5px]">
            logo
          </div>
          <div>  
            <h1 class="text-lg font-semibold">MPLF Donor & Grant Tracker</h1>
            <p class=" text-sm ">McKinney Public Library Foundation</p>
          </div>
        </div>
        <div class="flex  items-center gap-3">
         <div class = "w-6 h-6 ">
          <NuxtLink to = "/dashboard">
            <arrow-left-icon/>
          </NuxtLink>
        </div>
          <a href="https://www.mckinneyplf.org/" target = "__blank"class="inline-flex  border-[0.5px] items-center gap-2 rounded-lg  px-4 py-2 text-sm hover:bg-slate-600">          
            MPLF Website
          </a>
          <button @click = "signOut()" class="rounded-lg border-[0.5px] px-4 py-2 text-sm hover:bg-slate-600">Log Out</button>
        </div>
      </div>
    </header>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from "@heroicons/vue/24/outline"; 
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();
const signedIn = ref(false);
if(session.value?.session){
  signedIn.value = true;
}

async function signOut(){
  const result = await $fetch(`/api/session/${session.value?.session.id}`,{
    method: "DELETE"
  });
  if(result.success){
    alert("signed out");
    reloadNuxtApp();
  }
}
</script>
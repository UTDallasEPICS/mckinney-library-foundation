<template> 
 <header  class="bg-[#406080] text-white">
    <div class="mx-auto px-3 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div>
          <img src="/book.png" alt="MPLF Logo" class="w-14 h-14 object-cover" style="background-color: whitesmoke; padding: 4px; border-radius: 8px;">
        </div>
        <div>  
          <h1 class="header">MPLF Donor & Grant Tracker</h1>
          <!--<p class=" text-sm ">McKinney Public Library Foundation</p>-->
        </div>
      </div>
      <template v-if="signedIn">
        <div class="flex items-center gap-3">
        <div v-if="showDashboardBackArrow" class = "w-7 h-7">
          <NuxtLink :to = backArrowDestination>
            <arrow-left-icon/>
          </NuxtLink>
        </div>
        <a href="https://www.mckinneyplf.org/" target = "__blank"class="w-34 h-11 text-12px inline-flex border-[2px] items-center gap-2 rounded-lg px-4 py-2 hover:bg-[#305070]">
          MPLF Website
        </a>
        <button @click = "signOut()" class="w-22 h-11 rounded-lg border-[2px] px-2 py-2 text-12px hover:bg-[#305070] cursor-pointer">Log Out</button>
      </div>
      </template>
    </div>
  </header>
  
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from "@heroicons/vue/24/outline"; 
import { useAuth, authClient } from '~/composables/useAuth';

const { data: session } = await useAuth();
const route = useRoute();
const signedIn = computed(() => !!session.value?.session);
const showDashboardBackArrow = computed(() => route.path !== '/dashboard');
const backArrowDestination = computed(() => route.path.includes("/settings/roles") ? "/settings/accounts" : "/dashboard" )
const toasts = useToast();

async function signOut(){
  const { error } = await authClient.signOut();
  if(!error){
    reloadNuxtApp();
    toasts.add({
      title: "Signed out",
      duration: 5000
    });
  }
}
</script>
<template>
  <div>
    <Header v-if="logedIn" />
    <NuxtPage />
  </div>
    <div id="rectangle" style="width:120px; height:50px; background-color:blue">
      <p class=" text-sm text-white mt-2">Donation Created!</p>
    </div>
    
  <UAlert title="Heads up!" />
</template>
  
<script setup>
  import Header from '@/components/Header.vue'; 

const session = await useFetch("/api/session");
  const logedIn = ref(false);
  if(session.data.value?.user){
    logedIn.value = true;
  }
  </script>
  
  
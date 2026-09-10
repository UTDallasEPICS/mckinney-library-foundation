<template>
  <div>
    <Header v-if="loggedIn" />
    <NuxtPage />
  </div>
</template>
  
<script setup>
  import Header from '@/components/Header.vue'; 

const session = await useFetch("/api/session");
  const loggedIn = ref(false);
  if(session.data.value?.user){
    loggedIn.value = true;
  }
  </script>
  
  
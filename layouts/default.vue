<template>
  <div>
    <Header v-if="logedIn" />
    <NuxtPage />
  </div>
</template>
  
<script setup>
  import Header from '@/components/Header.vue'; 

const session = await useFetch("/api/auth/session");
  const logedIn = ref(false);
  if(session.data.value?.user){
    logedIn.value = true;
  }
  </script>
  
  
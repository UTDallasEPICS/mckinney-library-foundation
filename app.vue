<template>
  <UApp :toaster="toaster">
  <Header/>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  </UApp>
</template>

<script setup>
import Header from '~/components/Header.vue';

const toaster = { duration: 10000, progress: false, max: 5 };
</script>

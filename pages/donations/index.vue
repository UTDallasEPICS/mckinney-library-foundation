

<template>
<button @click = "showMenu = true">please open this page</button>

<div v-if = "showMenu">

  <DonationsForm @close="showMenu = false"/>


</div>



</template>
<script setup>

import DonationsForm from '~/components/Forms/DonationsForm.vue';
import { ref } from 'vue';

const showMenu = ref(false)


</script>




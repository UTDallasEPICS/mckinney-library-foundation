<!-- testing purposes probably gonna delete later -->

<template>
<button @click = "showMenu = true">please open this page</button>

<div v-if = "showMenu">

  <DonationsAdd @close="showMenu = false"/>


</div>



</template>
<script setup>

import DonationsAdd from './add.vue';
import { ref } from 'vue';

const showMenu = ref(false)


</script>




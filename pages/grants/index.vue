<template>

  <button @click = "showMenu = true">click this button</button>



  <div v-if = "showMenu"> 



<GrantForm @close = "showMenu = false"/>

</div>




</template>

<script setup> 
import GrantForm from '~/components/Forms/GrantForm.vue';

import { ref } from 'vue';


const showMenu = ref(false)

 





</script>
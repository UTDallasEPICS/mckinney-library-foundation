<template>


<grantsBar/>


<GrantsTable :grants = "grants" />



</template>

<script setup> 

import grantsBar from '~/components/grantsBar.vue';
import GrantsTable from '~/components/Tables/GrantsTable.vue';
import {onMounted,ref} from 'vue';  

const grants = ref()


onMounted(() => { 
  const getGrants = async () => { 

try { 

const response = await $fetch('/api/grants',{
  method:"GET",})

console.log("response",response)

grants.value = response


}
catch(err) { 

  console.log("error",err)  
}

}

getGrants()
})








</script>
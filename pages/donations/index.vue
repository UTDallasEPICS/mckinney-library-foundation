
<template> 

  <donationBar/>
   <DonationsTable/>

  
  
  
  
  </template>
  
  <script setup lang="ts">
import DonationsTable from '~/components/Tables/DonationsTable.vue';


  import donationBar from '~/components/donationBar.vue';
  import { ref,onMounted } from 'vue';


onMounted(() => { 

  const getDonations = async () => {
    
    try { 


      const response = await $fetch('/api/donations',{
        method:"GET",
      })


      console.log("response",response)


    }catch(err) { 

      console.log("error",err)
    }
  };

getDonations()

})




  






  


  

  </script>



<template> 

  <donationBar   @add-donation = "addDonation"/>
   
  <DonationsTable :donation-info = "donations" @delete-donation="handleDeleteDonation" @update-donation = "updateDonation"
  
  

  />

  
  
  
  
  </template>
  
  <script setup lang="ts">
import DonationsTable from '~/components/Tables/DonationsTable.vue';


  import donationBar from '~/components/donationBar.vue';
  import { ref,onMounted } from 'vue';

  const donations = ref()



onMounted(() => { 

  const getDonations = async () => {
    
    try { 


      const response = await $fetch('/api/donations',{
        method:"GET",
      })


      donations.value = response


      console.log("response",response)


    }catch(err) { 

      console.log("error",err)
    }
  };

getDonations()

})

const handleDeleteDonation = (id) => {   
  if (!donations.value || !donations.value.donations) return;

  donations.value.donations = donations.value.donations.filter(
    donation => donation.id !== id
  );
};

const updateDonation = (data) => {
  
  console.log("data in index.vue",data) 
donations.value.donations = donations.value.donations.map(donation => {
    if (donation.id === data.id) {
      return { ...donation, ...data };
    }

    console.log("donation please fucking work",donation)
    return donation;


  });



}


const addDonation = (data) => {
  donations.value.donations = [
    ...donations.value.donations,
    data
  ];
  
}
  </script>
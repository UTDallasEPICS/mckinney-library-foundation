<template>

  <grantsBar :permission-level="permissionLevel"/>
  <GrantsTable :grants = "grants" />
  <GrantForm 
      v-if = "showMenu"
      @close = "showMenu = false"
      @created = "getGrants()"
    />

</template>

<script setup lang="ts">

  import GrantsTable from '~/components/Tables/GrantsTable.vue';
  import GrantForm from '~/components/Forms/GrantForm.vue';
  import grantsBar from '~/components/grantsBar.vue';
  import {onMounted,ref} from 'vue';  
  import { useAuth } from '~/composables/useAuth';

  const {session, getSession} = useAuth();
  session.value = await getSession();
  const permissionLevel = ref(0);
  if(session.value?.user){
      permissionLevel.value = session.value.user.permission;
  }
  const { grants, getGrants} = useGrants();
  const showMenu = ref(false);

  onMounted (() => getGrants())

</script>
<!-- <template>


<grantsBar v-if="permissionLevel > 0"/>


<GrantsTable :grants = "grants" />



</template>

<script setup> 



import grantsBar from '~/components/grantsBar.vue';
import GrantsTable from '~/components/Tables/GrantsTable.vue';
import {onMounted,ref} from 'vue';  
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();
const permissionLevel = ref(0);
if(session.value?.user){
    permissionLevel.value = session.value.user.permission;
}
else{
  navigateTo("/");
}

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








</script> -->
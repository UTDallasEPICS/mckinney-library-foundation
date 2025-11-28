<template>
  <div>
    <h1> grant table </h1>
  </div>
</template>

<script setup lang="ts">
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

</script>
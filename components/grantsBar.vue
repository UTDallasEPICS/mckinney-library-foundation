<template>

<div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
    <div class = "w-[70vw] flex justify-between">      
      <button v-if="permissionLevel>0" @click="showMenu = true"
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        Add Grant
      </button>
      <NuxtLink to = '/grants'>
      <button 
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        View Grants
      </button>
    </NuxtLink>


    </div>
    </div>
   
    

    
      <div v-if = "showMenu"> 
    
    
    
    
    
    
    </div>
    
    
    
    
    </template>
    
    <script setup> 
    import GrantForm from '~/components/Forms/GrantForm.vue';
    
    import { ref } from 'vue';

const props = defineProps({
      permissionLevel: {
        type: Number
      }
    });    
    
    const showMenu = ref(false)
    
    </script>
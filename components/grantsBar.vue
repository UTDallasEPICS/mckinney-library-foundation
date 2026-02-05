<template>

<div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
    <div class = "w-[70vw] flex justify-between">
      
      <button class="px-3 py-1 rounded hover:bg-slate-600 transition"  @click = "showMenu = true">add grant</button>
    
      <NuxtLink to = '/grants'>
      <button 
        class="px-3 py-1 rounded hover:bg-slate-600 transition">
        view grants
      </button>
    </NuxtLink>


    </div>
    </div>
   
    

    
      <div v-if = "showMenu"> 
    
    
    
    <GrantForm @close = "showMenu = false"/>
    
    
    </div>
    
    
    
    
    </template>
    
    <script setup> 
    import GrantForm from '~/components/Forms/GrantForm.vue';
    
    import { ref } from 'vue';
    
    
    const showMenu = ref(false)
    
     
    
    
    
    
    
    </script>
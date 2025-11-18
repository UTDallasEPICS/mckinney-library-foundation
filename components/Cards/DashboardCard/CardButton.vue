<template>
    <a :href="link">
        <button class="w-full bg-[#4a5f6d] hover:bg-[#3d4f5c] text-white py-2 my-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4" aria-hidden="true">
                <path v-for="path in paths" :d=path ></path>
                <circle v-if="circles" v-for="circle in circles" :cx=circle[0] :cy=circle[1] :r=circle[2]></circle>
            </svg>
            <span>{{ name }}</span>
        </button>
    </a>
    
</template>

<script setup lang="ts">

const props = defineProps<{
    name:string
    link:string
    paths:string[]
    circles?:string[][]
}>();

</script>
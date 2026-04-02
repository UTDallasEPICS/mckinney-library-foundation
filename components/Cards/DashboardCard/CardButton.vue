<template>
    <a :href="link">
        <button class="w-full bg-[#4a5f6d] hover:bg-[#3d4f5c] text-white py-2 my-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md">
            <img :src="icon" class="w-4 h-4 brightness-0 invert" aria-hidden="true" />
            <span>{{ name }}</span>
        </button>
    </a>
    
</template>

<script setup lang="ts">

const props = defineProps<{
    name:string
    link?:string
    icon:string
}>();

</script>
<template>
    <a :href="link">
        <!--<button class="w-full hover:bg-[#3d4f5c] text-white py-2 px-2 flex items-center justify-center space-x-0 hover:shadow-md cursor-pointer">-->
        <button class="flex items-center justify-center gap-1 stroke-[#818181]">
            <img :src="icon" class="w-6 h-6 sidebar-svg" alt="" aria-hidden="true" />
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
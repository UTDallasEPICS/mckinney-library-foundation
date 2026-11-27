<template>
    <a :href="link">
        <button class="flex items-center gap-2">
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
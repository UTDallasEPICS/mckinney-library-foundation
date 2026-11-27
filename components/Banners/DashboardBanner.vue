<template>
    <div class="bg-[#406080] rounded-xl shadow-lg p-6 text-white w-120">
        <div class="flex items-center justify-between mb-2">
            <h3>{{title}}</h3>
        </div>
        <div class="text-3xl mb-1">{{ value }}</div>
        <p class="text-sm text-white/70">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string,
    value: string,
    description: string
}>()

</script>
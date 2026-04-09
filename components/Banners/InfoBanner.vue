<template>
    <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
        <div class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path :d= image></path>
            </svg>
        </div>
        <div class="text-left">
            <div class="text-[16px]" style="font-weight: 600;">
                {{ title }}
            </div>
            <div class="text-[13px] opacity-80">
                {{ description }}
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    const props = defineProps<{
        image: string,
        title: string,
        description: string,
    }>();
</script>
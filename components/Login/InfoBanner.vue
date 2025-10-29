<template>
    <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
        <div class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
            </svg>
        </div>
        <div class="text-left">
            <div class="text-[16px]" style="font-weight: 600;">
                {{ title }}
            </div>
            <div class="text-[13px] opacity-80">
                Comprehensive financial management
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    const props = defineProps<{
        image?: string,
        title: string,
        description: string,
    }>();
</script>
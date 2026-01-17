<template>
    <div class="bg-[#4a5f6d] rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between mb-2">
            
            <!-- Dynamic Title -->
            <h3>{{ title }}</h3>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-dollar-sign w-5 h-5 text-white/70"
                 aria-hidden="true">
                <line x1="12" x2="12" y1="2" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
        </div>
        
        <!-- Dynamic Value -->
        <div class="text-3xl mb-1">{{ value }}</div>

        <!-- Dynamic Description -->
        <p class="text-sm text-white/70">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string,
  value: string,
  description: string
}>();
</script>

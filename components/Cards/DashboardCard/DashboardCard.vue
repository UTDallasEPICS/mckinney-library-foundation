<template>
    <div v-if="activeButtons.length > 0" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-12 h-12 bg-[#4a5f6d] rounded-lg flex items-center justify-center">
          <img :src="icon" class="w-6 h-6 brightness-0 invert" aria-hidden="true" />
        </div>
        <h3 class="text-[#2d3e4d]">{{ title }}</h3>
      </div>
      <p class="text-sm text-gray-600 mb-6">{{ description }}</p>
      <div class="space-y-3">
        <CardButton
          v-for="button in activeButtons"
          :key="button.name"
          :name="button.name"
          :link="button.link"
          :icon="button.icon"  
          @click="handleClick(button)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import CardButton from './CardButton.vue'
  
  const props = defineProps<{
    icon: string
    title: string
    description: string
    buttons: { name: string; link?: string; icon: string; accessLevel: number }[]
    permissionLevel: number
  }>()
  
  const emit = defineEmits<{
    (e: 'button-click', button: { name: string; link?: string; icon: string; accessLevel: number }): void
  }>()
  
  const activeButtons = computed(() =>
    props.buttons.filter((button) => button.accessLevel <= props.permissionLevel)
  )
  
  const handleClick = (button: { name: string; link?: string; icon: string; accessLevel: number }) => {
    emit('button-click', button)
  }
  </script>
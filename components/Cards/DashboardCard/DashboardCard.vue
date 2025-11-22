<template>
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-12 h-12 bg-[#4a5f6d] rounded-lg flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-dollar-sign w-6 h-6 text-white"
            aria-hidden="true"
          >
            <line
              v-if="img.lines"
              v-for="line in img.lines"
              :key="line.join('-')"
              :x1="line[0]"
              :x2="line[1]"
              :y1="line[2]"
              :y2="line[3]"
            />
            <path
              v-for="path in img.paths"
              :key="path"
              :d="path"
            />
            <circle
              v-if="img.circles"
              v-for="circle in img.circles"
              :key="circle.join('-')"
              :cx="circle[0]"
              :cy="circle[1]"
              :r="circle[2]"
            />
          </svg>
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
          :paths="button.paths"
          :circles="button.circles"
          @click="handleClick(button)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import CardButton from './CardButton.vue'
  
  const props = defineProps<{
    img: { paths: string[]; circles?: string[][]; lines?: string[][] }
    title: string
    description: string
    buttons: { name: string; link?: string; paths: string[]; circles?: string[][]; accessLevel: number }[]
    permissionLevel: number
  }>()
  
  const emit = defineEmits<{
    (e: 'button-click', button: { name: string; link?: string; paths: string[]; circles?: string[][]; accessLevel: number }): void
  }>()
  
  const activeButtons = computed(() =>
    props.buttons.filter((button) => button.accessLevel <= props.permissionLevel)
  )
  
  const handleClick = (button: { name: string; link?: string; paths: string[]; circles?: string[][]; accessLevel: number }) => {
    emit('button-click', button)
  }
  </script>
  
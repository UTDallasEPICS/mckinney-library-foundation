<template>
    <div class="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm mb-6">
      <span class="font-semibold flex items-center text-gray-700">
        <i class="i-ph-funnel-duotone mr-1"></i> Filters:
      </span>
  
      <input
        v-model="localFilters.name"
        type="text"
        placeholder="Search by name..."
        class="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
      />
  
      <!--input
        v-model="localFilters.type"
        type="text"
        placeholder="Filter by type (Corp./Indiv.)..."
        class="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
      />
  
      <input
        v-model="localFilters.date"
        type="text"
        placeholder="Filter by date..."
        class="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
      /-->
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  // Props: the parent passes in filters
  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    }
  })
  
  // Emit changes to parent
  const emit = defineEmits(['update:modelValue'])
  
  // Local copy of filters (for two-way binding)
  const localFilters = ref({ ...props.modelValue })
  
  // Watch local changes and sync up
  watch(
    localFilters,
    (newVal) => {
      emit('update:modelValue', newVal)
    },
    { deep: true }
  )
  
  // Also watch parent updates (if reset from parent)
  watch(
    () => props.modelValue,
    (newVal) => {
      localFilters.value = { ...newVal }
    },
    { deep: true }
  )
  </script>
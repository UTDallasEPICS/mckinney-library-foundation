<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    
    <div v-if="$slots.filters" class="p-4 border-b">
      <slot name="filters" />
    </div>

    <UTable
      :rows="rows"
      :columns="columns"
      :ui="ui"
    >
      <template
        v-for="col in columns"
        :key="col.key"
        #[`${col.key}-data`]="{ row }"
      >
        <slot :name="`${col.key}-data`" :row="row">
          {{ row[col.key] }}
        </slot>
      </template>

      <template v-if="$slots.actions-data" #actions-data="{ row }">
        <slot name="actions-data" :row="row" />
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string; sortable?: boolean }[]
  rows: any[]
}>()

const ui = {
  th: 'bg-[#c5d0d8] text-[#2d3e4d] px-4 py-3',
  td: 'px-6 py-4 text-[#2d3e4d]',
  tr: 'hover:bg-[#e8f0f7] transition-colors border-b'
}
</script>
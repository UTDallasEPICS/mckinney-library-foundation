<template>
  <div>
    <h2 v-if="label" class="form-field-label mb-2">{{ label }}</h2>
    <UPopover v-model:open="open">
      <button
        type="button"
        class="w-full sm:w-72 px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] text-left focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer flex items-center justify-between gap-2"
      >
        <span class="truncate">{{ displayText }}</span>
        <span class="text-gray-400 shrink-0 text-xs">&#9662;</span>
      </button>

      <template #content>
        <div class="bg-white text-[#2d3e4d]">
          <ul class="py-1 w-56">
            <li v-for="preset in presets" :key="preset.key">
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                :class="mode === preset.key ? 'font-semibold bg-gray-100' : ''"
                @click="choosePreset(preset)"
              >
                {{ preset.label }}
              </button>
            </li>
            <li class="border-t border-gray-200">
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                :class="mode === 'custom' ? 'font-semibold bg-gray-100' : ''"
                @click="chooseCustom"
              >
                Custom range...
              </button>
            </li>
          </ul>

          <div v-if="mode === 'custom'" class="p-3 border-t border-gray-200">
            <UCalendar
              v-model="range"
              range
              :number-of-months="2"
              :ui="calendarUi"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DateFormatter,
  endOfMonth,
  endOfYear,
  getLocalTimeZone,
  startOfMonth,
  startOfYear,
  today,
  type DateValue,
} from '@internationalized/date'

export type DateRangeValue = { start: DateValue; end?: DateValue | null } | null

type Preset = { key: string; label: string; build?: () => { start: DateValue; end: DateValue } }

const props = defineProps<{
  modelValue: DateRangeValue
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DateRangeValue]
}>()

const formatter = new DateFormatter('en-US', { dateStyle: 'medium' })

const open = ref(false)
const mode = ref<string>('all')

const presets: Preset[] = [
  { key: 'all', label: props.placeholder ?? 'All time' },
  {
    key: 'last30',
    label: 'Last 30 days',
    build: () => {
      const end = today(getLocalTimeZone())
      return { start: end.subtract({ days: 29 }), end }
    },
  },
  {
    key: 'thisMonth',
    label: 'This month',
    build: () => {
      const now = today(getLocalTimeZone())
      return { start: startOfMonth(now), end: endOfMonth(now) }
    },
  },
  {
    key: 'lastMonth',
    label: 'Last month',
    build: () => {
      const prev = startOfMonth(today(getLocalTimeZone()).subtract({ months: 1 }))
      return { start: prev, end: endOfMonth(prev) }
    },
  },
  {
    key: 'thisYear',
    label: 'This year',
    build: () => {
      const now = today(getLocalTimeZone())
      return { start: startOfYear(now), end: endOfYear(now) }
    },
  },
  {
    key: 'lastYear',
    label: 'Last year',
    build: () => {
      const prev = startOfYear(today(getLocalTimeZone()).subtract({ years: 1 }))
      return { start: prev, end: endOfYear(prev) }
    },
  },
]

const calendarUi = {
  headCell: 'text-[#5a6a77]',
  cellTrigger:
    'data-[selected]:bg-[#4a5f6d] data-[highlighted]:bg-[#4a5f6d]/20 hover:not-data-[selected]:bg-[#4a5f6d]/20 data-today:not-data-[selected]:text-[#2d3e4d] focus-visible:ring-[#5a6a77]',
}

const range = computed<DateRangeValue>({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (value?.start && value?.end) {
      open.value = false
    }
  },
})

const displayText = computed(() => {
  const preset = presets.find((p) => p.key === mode.value)
  if (preset) return preset.label
  if (!props.modelValue?.start) return 'Custom range...'
  const start = formatter.format(props.modelValue.start.toDate(getLocalTimeZone()))
  if (!props.modelValue.end || props.modelValue.start.compare(props.modelValue.end) === 0) {
    return start
  }
  const end = formatter.format(props.modelValue.end.toDate(getLocalTimeZone()))
  return `${start} - ${end}`
})

function choosePreset(preset: Preset) {
  mode.value = preset.key
  emit('update:modelValue', preset.build ? preset.build() : null)
  open.value = false
}

function chooseCustom() {
  mode.value = 'custom'
  emit('update:modelValue', null)
}
</script>

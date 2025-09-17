<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">{{ ui.t('sortBy') }}</span>
    <select
      :value="modelValue"
      class="text-xs font-medium bg-gray-100 dark:bg-obsidian-3 border border-gray-200 dark:border-obsidian-2 text-obsidian dark:text-white rounded-xl px-3 h-9 outline-none cursor-pointer hover:border-brand focus:border-brand transition-colors"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="{ value, labelKey } in SORT_OPTIONS"
        :key="value"
        :value="value"
      >
        {{ ui.t(labelKey) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore'
defineProps({ modelValue: { type: String, default: 'nameAsc' } })
defineEmits(['update:modelValue'])
const ui = useUiStore()
const SORT_OPTIONS = [
  { value: 'nameAsc',    labelKey: 'sortNameAsc'   },
  { value: 'priceAsc',   labelKey: 'sortPriceAsc'  },
  { value: 'priceDesc',  labelKey: 'sortPriceDesc' },
  { value: 'ratingDesc', labelKey: 'sortRatingDesc' },
]
</script>

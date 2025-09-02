<template>
  <div class="flex items-center gap-2 overflow-x-auto pb-1 custom__scrollbar">
    <button
      v-for="cat in CATEGORIES"
      :key="cat"
      class="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors"
      :class="active === cat
        ? 'bg-brand text-white border-brand'
        : 'bg-white dark:bg-obsidian-2 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-obsidian-3 hover:border-brand hover:text-brand'"
      @click="$emit('select', cat)"
    >
      {{ cat === 'All' ? ui.t('allCategories') : cat }}
    </button>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore'
defineProps({ active: { type: String, default: 'All' } })
defineEmits(['select'])
const ui = useUiStore()
const CATEGORIES = ['All', 'Food', 'Drinks', 'Devices', 'Accessories', 'Games', 'Game Consoles', 'Lego', 'Books']
</script>

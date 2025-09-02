<template>
  <div
    class="flex items-center gap-2 bg-gray-100 dark:bg-obsidian-3 border border-gray-200 dark:border-obsidian-2 rounded-xl px-3 h-10 w-56 transition-colors focus-within:border-brand"
    data-testid="search-bar"
  >
    <span class="text-brand shrink-0">🔍</span>
    <input
      type="text"
      :value="modelValue"
      :placeholder="ui.t('search')"
      aria-label="Search products"
      data-testid="search-input"
      class="bg-transparent outline-none text-sm flex-1 text-obsidian dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore'
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
const ui = useUiStore()
</script>

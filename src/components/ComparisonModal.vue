<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
    data-testid="comparison-modal"
  >
    <div class="bg-white dark:bg-obsidian-2 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-gray-100 dark:border-obsidian-3">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-obsidian-3 shrink-0">
        <h2
          class="text-lg font-bold text-obsidian dark:text-white"
          data-testid="comparison-modal-title"
        >
          {{ ui.t('comparisonResult') }}
        </h2>
        <button
          class="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-obsidian-3 hover:text-obsidian dark:hover:text-white transition-colors"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto custom__scrollbar p-6 flex flex-col gap-4">
        <div
          v-for="(items, category) in grouped"
          :key="category"
          class="rounded-xl border border-gray-100 dark:border-obsidian-3 overflow-hidden"
        >
          <div class="px-4 py-2 bg-brand/10 dark:bg-brand/20">
            <h3 class="text-xs font-bold text-brand uppercase tracking-widest">
              {{ category }}
            </h3>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-obsidian-3">
            <div
              v-for="product in items"
              :key="product.id"
              class="flex items-center gap-3 px-4 py-3"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="h-10 w-10 rounded-lg object-cover shrink-0"
              >
              <p class="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                {{ product.name }}
              </p>
              <div class="text-right shrink-0">
                <p
                  class="text-sm font-bold"
                  :class="product.id === cheapestProduct.id ? 'text-green-500' : 'text-obsidian dark:text-white'"
                >
                  {{ ui.format(product.price) }}
                </p>
                <p
                  v-if="product.id === cheapestProduct.id"
                  class="text-xs text-green-500 font-medium"
                >
                  Best price
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-brand/10 dark:bg-brand/20 px-4 py-3">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ ui.t('savings') }}
            <span class="font-bold text-brand">{{ ui.format(Number(totalSavings)) }}</span>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 dark:border-obsidian-3 shrink-0 flex justify-end">
        <button
          class="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold transition-colors text-sm"
          @click="$emit('close')"
        >
          {{ ui.t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '../stores/uiStore'

const props = defineProps({
  selectedProducts: { type: Array, required: true },
  products: { type: Array, required: true },
  cheapestProduct: { type: Object, required: true },
})
defineEmits(['close'])

const ui = useUiStore()

const grouped = computed(() =>
  props.selectedProducts.reduce((acc, id) => {
    const product = props.products.find(p => p.id === id)
    if (!product) return acc
    if (!acc[product.category]) acc[product.category] = []
    acc[product.category].push(product)
    return acc
  }, {})
)

const totalSavings = computed(() =>
  props.selectedProducts
    .reduce((acc, id) => {
      const product = props.products.find(p => p.id === id)
      return acc + (product ? product.price - props.cheapestProduct.price : 0)
    }, 0)
    .toFixed(2)
)
</script>

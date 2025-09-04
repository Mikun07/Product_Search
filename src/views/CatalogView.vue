<template>
  <div class="flex flex-col h-full">
    <!-- Sticky toolbar -->
    <div class="sticky top-0 z-20 bg-gray-50 dark:bg-obsidian px-4 pt-4 pb-2 flex flex-col gap-3 transition-colors">
      <div class="flex items-center justify-between gap-3">
        <h1 class="font-bold text-lg text-obsidian dark:text-white shrink-0">
          {{ ui.t('products') }}
          <span class="ml-2 text-sm font-normal text-gray-400">({{ displayList.length }})</span>
        </h1>
        <div class="flex items-center gap-2">
          <SortControl v-model="sort" />
          <SearchBar v-model="search" />
        </div>
      </div>
      <CategoryFilter :active="category" @select="onSelectCategory" />
    </div>

    <!-- Scrollable grid -->
    <div id="catalog-grid" class="flex-1 overflow-y-auto custom__scrollbar px-4 relative">
      <!-- Watermark -->
      <div class="pointer-events-none fixed inset-0 flex flex-col items-center justify-center z-0 select-none" aria-hidden="true">
        <img src="/mikun-logo.svg" alt="" class="w-64 h-64 opacity-[0.04] dark:opacity-[0.06]" />
        <span class="text-6xl font-black tracking-tight opacity-[0.04] dark:opacity-[0.06] text-obsidian dark:text-white -mt-4">MikunStore</span>
      </div>

      <div v-if="displayList.length === 0" class="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        {{ ui.t('noResults') }}
      </div>

      <template v-else>
        <div class="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ProductCard
            v-for="product in paginated"
            :key="product.id"
            :product="product"
            :is-selected="selectedIds.includes(product.id)"
            @toggle-select="toggleSelect(product.id)"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 py-8">
          <button
            :disabled="safePage === 1"
            class="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:border-brand hover:text-brand transition-colors"
            @click="goToPage(safePage - 1)"
          >‹</button>

          <template v-for="p in totalPages" :key="p">
            <span v-if="p === safePage - 2 && safePage > 3" class="text-gray-400 text-sm px-1 select-none">…</span>
            <button
              v-if="p === 1 || p === totalPages || Math.abs(p - safePage) <= 1"
              class="h-9 min-w-[36px] px-2 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors"
              :class="p === safePage ? 'bg-brand text-white shadow-sm shadow-brand/30' : 'border border-gray-200 dark:border-obsidian-3 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand'"
              @click="goToPage(p)"
            >{{ p }}</button>
            <span v-if="p === safePage + 2 && safePage < totalPages - 2" class="text-gray-400 text-sm px-1 select-none">…</span>
          </template>

          <button
            :disabled="safePage === totalPages"
            class="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:border-brand hover:text-brand transition-colors"
            @click="goToPage(safePage + 1)"
          >›</button>
        </div>
      </template>
    </div>

    <!-- Floating compare button -->
    <div v-if="selectedIds.length >= 2" class="fixed bottom-6 right-6 z-40">
      <button
        class="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl shadow-lg font-semibold text-sm transition-colors"
        data-testid="compare-selected-button"
        @click="handleCompare"
      >{{ ui.t('compare') }} ({{ selectedIds.length }})</button>
    </div>

    <!-- Comparison modal -->
    <ComparisonModal
      v-if="showComparison && cheapestProduct"
      :selected-products="selectedIds"
      :products="allProducts"
      :cheapest-product="cheapestProduct"
      @close="showComparison = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import ProductCard from '../components/ProductCard.vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import SortControl from '../components/SortControl.vue'
import ComparisonModal from '../components/ComparisonModal.vue'
import { useProducts } from '../composables/useProducts'
import { useUiStore } from '../stores/uiStore'
import ProductData from '../data/product.json'

const ui = useUiStore()
const toast = useToast()

const search = ref('')
const category = ref('All')
const sort = ref('nameAsc')
const selectedIds = ref([])
const showComparison = ref(false)
const cheapestProduct = ref(null)
const page = ref(1)

const allProducts = ProductData.products
const displayList = useProducts(allProducts, search, category, sort)

const PAGE_SIZE = 20
const totalPages = computed(() => Math.max(1, Math.ceil(displayList.value.length / PAGE_SIZE)))
const safePage = computed(() => Math.min(page.value, totalPages.value))
const paginated = computed(() => displayList.value.slice((safePage.value - 1) * PAGE_SIZE, safePage.value * PAGE_SIZE))

watch([search, category, sort], () => { page.value = 1 })

function onSelectCategory(cat) { category.value = cat }

function toggleSelect(productId) {
  const idx = selectedIds.value.indexOf(productId)
  if (idx > -1) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(productId)
}

function handleCompare() {
  if (selectedIds.value.length < 2) { toast.error(ui.t('selectTwo')); return }
  const details = selectedIds.value.map(id => allProducts.find(p => p.id === id))
  cheapestProduct.value = [...details].sort((a, b) => a.price - b.price)[0]
  showComparison.value = true
}

function goToPage(p) {
  page.value = p
  document.getElementById('catalog-grid')?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

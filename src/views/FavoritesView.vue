<template>
  <div class="flex flex-col h-full overflow-y-auto custom__scrollbar">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-gray-50 dark:bg-obsidian px-4 lg:px-8 pt-4 pb-3 border-b border-gray-100 dark:border-obsidian-3 transition-colors">
      <div class="flex items-center gap-3">
        <span class="text-red-500 text-xl">♥</span>
        <h1 class="font-bold text-lg text-obsidian dark:text-white">
          {{ ui.t('favorites') }}
          <span class="ml-2 text-sm font-normal text-gray-400">({{ favoritesStore.favorites.length }})</span>
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-4 lg:px-8 py-6">
      <div v-if="favoritesStore.favorites.length === 0" class="flex flex-col items-center justify-center h-full gap-5">
        <div class="h-20 w-20 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <span class="text-4xl text-red-200">♥</span>
        </div>
        <p class="text-gray-400 dark:text-gray-500 text-sm font-medium text-center">{{ ui.t('noFavorites') }}</p>
        <RouterLink to="/shop" class="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors">
          {{ ui.t('continueShopping') }}
        </RouterLink>
      </div>

      <div v-else class="flex flex-col gap-3 max-w-2xl mx-auto lg:mx-0">
        <div
          v-for="product in favoritesStore.favorites"
          :key="product.id"
          class="group flex items-center gap-4 bg-white dark:bg-obsidian-2 rounded-2xl border border-gray-100 dark:border-obsidian-3 p-3 hover:border-brand/40 hover:shadow-md transition-all duration-200"
        >
          <RouterLink :to="`/product/${product.id}`" class="shrink-0">
            <div class="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-obsidian-3">
              <img :src="product.image" :alt="product.name" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
          </RouterLink>

          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-bold text-brand uppercase tracking-wider mb-0.5">{{ product.brand }}</p>
            <RouterLink :to="`/product/${product.id}`" class="text-sm font-semibold text-obsidian dark:text-white hover:text-brand line-clamp-2 leading-snug block">
              {{ product.name }}
            </RouterLink>
            <div class="flex items-center gap-1 mt-1">
              <span style="color:#f59e0b;font-size:11px">★</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ product.rating }}</span>
              <span class="text-xs text-gray-300 dark:text-gray-600 mx-1">·</span>
              <span class="text-xs text-gray-400">{{ product.category }}</span>
            </div>
            <div class="flex items-baseline gap-1.5 mt-1.5">
              <span class="text-sm font-bold text-brand">{{ ui.format(effectivePrice(product)) }}</span>
              <span v-if="product.discountPercentage > 0" class="text-xs text-gray-400 line-through">{{ ui.format(product.price) }}</span>
              <span v-if="product.discountPercentage > 0" class="text-[10px] font-bold text-white bg-brand px-1.5 py-0.5 rounded-full">
                -{{ product.discountPercentage }}%
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2 shrink-0">
            <button
              :aria-label="ui.t('addToCart')"
              class="h-9 w-9 flex items-center justify-center rounded-xl bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/30 transition-colors"
              @click="addToCart(product)"
            >🛒</button>
            <button
              :aria-label="ui.t('removeFromFavorites')"
              class="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              @click="removeFavorite(product.id)"
            >🗑</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'

const ui = useUiStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

function effectivePrice(product) {
  return product.discountPercentage > 0 ? product.price * (1 - product.discountPercentage / 100) : product.price
}

function addToCart(product) {
  cartStore.addItem(product)
  toast.success(ui.t('addedToCart'))
}

function removeFavorite(id) {
  favoritesStore.removeFavorite(id)
  toast.success(ui.t('removedFromFavorites'))
}
</script>

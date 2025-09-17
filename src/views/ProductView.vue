<template>
  <div class="flex flex-col lg:flex-row h-full overflow-y-auto custom__scrollbar">
    <template v-if="product">
      <!-- Image -->
      <div class="relative lg:w-1/2 lg:h-full h-72 bg-gray-100 dark:bg-obsidian-3 shrink-0">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover"
        >
        <button
          :aria-label="ui.t('back')"
          class="absolute top-4 left-4 h-10 w-10 flex items-center justify-center bg-white/90 dark:bg-obsidian-2/90 rounded-xl shadow text-obsidian dark:text-white hover:bg-brand hover:text-white transition-colors"
          @click="router.back()"
        >
          ←
        </button>
        <span
          v-if="product.discountPercentage > 0"
          class="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          -{{ product.discountPercentage }}% {{ ui.t('off') }}
        </span>
      </div>

      <!-- Details -->
      <div class="flex-1 flex flex-col gap-6 p-6 lg:p-10 overflow-y-auto custom__scrollbar">
        <p class="text-xs font-semibold text-brand uppercase tracking-widest">
          {{ product.brand }}
        </p>

        <div class="flex items-start justify-between gap-4">
          <h1 class="text-xl lg:text-2xl font-bold text-obsidian dark:text-white leading-tight">
            {{ product.name }}
          </h1>
          <button
            :aria-label="isFav ? ui.t('removeFromFavorites') : ui.t('addToFavorites')"
            class="shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-obsidian-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            @click="toggleFavorite"
          >
            <span :style="isFav ? 'color:#e11d48;font-size:22px' : 'color:#9ca3af;font-size:22px'">♥</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-0.5">
            <span
              v-for="i in 5"
              :key="i"
              :style="i <= Math.round(product.rating) ? 'color:#f59e0b' : 'color:#d1d5db'"
            >★</span>
          </div>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ product.rating }}</span>
          <span class="text-xs text-gray-400">· {{ product.category }}</span>
        </div>

        <div class="flex items-baseline gap-3">
          <span class="text-2xl font-bold text-brand">{{ ui.format(effectivePrice ?? product.price) }}</span>
          <span
            v-if="effectivePrice"
            class="text-base text-gray-400 line-through"
          >{{ ui.format(product.price) }}</span>
        </div>

        <hr class="border-gray-100 dark:border-obsidian-3">

        <div>
          <h2 class="text-sm font-bold text-obsidian dark:text-white mb-2">
            {{ ui.t('description') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="flex items-center gap-3 mt-auto">
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-obsidian-3 rounded-xl px-3 py-2">
            <button
              class="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              −
            </button>
            <span class="w-8 text-center text-sm font-semibold text-obsidian dark:text-white">{{ quantity }}</span>
            <button
              class="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
              @click="quantity++"
            >
              +
            </button>
          </div>
          <button
            class="flex-1 flex items-center justify-center gap-2 h-11 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-brand/30"
            @click="handleAddToCart"
          >
            🛒 {{ ui.t('addToCart') }}
            <span
              v-if="cartItem"
              class="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full"
            >
              {{ cartItem.quantity }} {{ ui.t('qty') }}
            </span>
          </button>
        </div>
      </div>
    </template>

    <div
      v-else
      class="flex flex-col items-center justify-center h-full gap-4 text-gray-400 dark:text-gray-500"
    >
      <p class="text-lg">
        {{ ui.t('notFound') }}
      </p>
      <RouterLink
        to="/shop"
        class="text-sm text-brand hover:underline font-semibold"
      >
        ← {{ ui.t('back') }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import ProductData from '../data/product.json'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const product = ProductData.products.find(p => p.id === Number(route.params.id))
const quantity = ref(1)

const effectivePrice = computed(() =>
  product?.discountPercentage > 0 ? product.price * (1 - product.discountPercentage / 100) : null
)
const cartItem = computed(() => cartStore.items.find(i => i.id === product?.id))
const isFav = computed(() => favoritesStore.isFavorite(product?.id))

function toggleFavorite() {
  if (!product) return
  if (isFav.value) { favoritesStore.removeFavorite(product.id); toast.success(ui.t('removedFromFavorites')) }
  else { favoritesStore.addFavorite(product); toast.success(ui.t('addedToFavorites')) }
}

function handleAddToCart() {
  if (!product) return
  if (cartItem.value) { cartStore.updateQuantity(product.id, quantity.value) }
  else { for (let i = 0; i < quantity.value; i++) cartStore.addItem(product) }
  toast.success(ui.t('addedToCart'))
}
</script>

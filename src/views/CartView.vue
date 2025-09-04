<template>
  <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full gap-5 px-4">
    <div class="h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-obsidian-3">
      <span class="text-4xl text-gray-300 dark:text-gray-600">🛍</span>
    </div>
    <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">{{ ui.t('emptyCart') }}</p>
    <RouterLink to="/shop" class="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors">
      {{ ui.t('continueShopping') }}
    </RouterLink>
  </div>

  <div v-else class="flex flex-col lg:flex-row h-full overflow-y-auto custom__scrollbar gap-0">
    <!-- Items list -->
    <div class="flex-1 overflow-y-auto custom__scrollbar px-4 lg:px-8 py-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-bold text-obsidian dark:text-white">
          {{ ui.t('cart') }}
          <span class="ml-2 text-sm font-normal text-gray-400">({{ cartStore.itemCount }})</span>
        </h1>
        <button class="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium" @click="cartStore.clearCart()">
          Clear all
        </button>
      </div>

      <div>
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-obsidian-3 last:border-0"
        >
          <RouterLink :to="`/product/${item.id}`" class="shrink-0">
            <img :src="item.image" :alt="item.name" class="h-16 w-16 rounded-xl object-cover bg-gray-100 dark:bg-obsidian-3" />
          </RouterLink>
          <div class="flex-1 min-w-0">
            <RouterLink :to="`/product/${item.id}`" class="text-sm font-semibold text-obsidian dark:text-white hover:text-brand line-clamp-2 leading-tight block">
              {{ item.name }}
            </RouterLink>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ item.brand }}</p>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="text-sm font-bold text-brand">{{ ui.format(effectivePrice(item)) }}</span>
              <span v-if="item.discountPercentage > 0" class="text-xs text-gray-400 line-through">{{ ui.format(item.price) }}</span>
            </div>
          </div>
          <!-- Quantity -->
          <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-obsidian-3 rounded-xl px-2 py-1.5 shrink-0">
            <button class="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors" aria-label="Decrease quantity" @click="cartStore.updateQuantity(item.id, -1)">−</button>
            <span class="w-6 text-center text-sm font-semibold text-obsidian dark:text-white">{{ item.quantity }}</span>
            <button class="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors" aria-label="Increase quantity" @click="cartStore.updateQuantity(item.id, 1)">+</button>
          </div>
          <!-- Line total -->
          <span class="text-sm font-bold text-obsidian dark:text-white w-20 text-right shrink-0">
            {{ ui.format(effectivePrice(item) * item.quantity) }}
          </span>
          <!-- Remove -->
          <button
            :aria-label="ui.t('removeFromCart')"
            class="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
            @click="cartStore.removeItem(item.id)"
          >🗑</button>
        </div>
      </div>
    </div>

    <!-- Order summary -->
    <div class="lg:w-80 lg:shrink-0 px-4 lg:px-6 py-6 bg-white dark:bg-obsidian-2 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-obsidian-3">
      <h2 class="text-sm font-bold text-obsidian dark:text-white mb-4">Order Summary</h2>
      <div class="flex flex-col gap-3 text-sm">
        <div class="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{{ ui.t('subtotal') }}</span>
          <span>{{ ui.format(cartStore.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Shipping</span>
          <span class="text-green-500 font-medium">Free</span>
        </div>
        <hr class="border-gray-100 dark:border-obsidian-3" />
        <div class="flex justify-between font-bold text-obsidian dark:text-white text-base">
          <span>{{ ui.t('total') }}</span>
          <span>{{ ui.format(cartStore.subtotal) }}</span>
        </div>
      </div>

      <button
        :disabled="downloading"
        class="mt-6 w-full h-11 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-brand/30"
        @click="handleCheckout"
      >
        ⬇ {{ downloading ? 'Generating…' : ui.t('checkout') }}
      </button>

      <RouterLink
        to="/shop"
        class="mt-3 w-full h-10 flex items-center justify-center border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 hover:border-brand hover:text-brand rounded-xl text-sm font-medium transition-colors"
      >{{ ui.t('continueShopping') }}</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'

const ui = useUiStore()
const cartStore = useCartStore()
const toast = useToast()
const downloading = ref(false)

const RATES = { USD: 1, GBP: 0.79, EUR: 0.92, NGN: 1620 }

function effectivePrice(item) {
  return item.discountPercentage > 0 ? item.price * (1 - item.discountPercentage / 100) : item.price
}

async function handleCheckout() {
  downloading.value = true
  try {
    const { generateReceipt } = await import('../utils/generateReceipt.js')
    generateReceipt({ items: cartStore.items, subtotal: cartStore.subtotal, currency: ui.currency, rates: RATES })
    toast.success('Receipt downloaded!')
  } catch {
    toast.error('Could not generate receipt.')
  } finally {
    downloading.value = false
  }
}
</script>

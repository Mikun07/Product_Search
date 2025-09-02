<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white dark:bg-obsidian-2 border-b border-gray-100 dark:border-obsidian-3 transition-colors shrink-0">
    <!-- Left: logo -->
    <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <img src="/mikun-logo.svg" alt="Mikun Store logo" class="h-9 w-9 shrink-0" />
      <div>
        <p class="text-base font-extrabold text-obsidian dark:text-white leading-none tracking-tight">
          Mikun<span class="text-brand">Store</span>
        </p>
        <p class="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-0.5">
          {{ ui.t('welcome') }}
        </p>
      </div>
    </RouterLink>

    <!-- Center: date -->
    <span class="hidden md:block text-xs text-gray-400 dark:text-gray-500 font-medium">{{ date }}</span>

    <!-- Right: controls -->
    <div class="flex items-center gap-2">
      <!-- Theme toggle -->
      <button
        :aria-label="ui.isDark ? ui.t('lightMode') : ui.t('darkMode')"
        class="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors"
        @click="ui.isDark = !ui.isDark"
      >
        <span v-if="ui.isDark">☀</span>
        <span v-else>🌙</span>
      </button>

      <!-- Language switcher -->
      <div ref="langRef" class="relative">
        <button
          :aria-label="ui.t('language')"
          class="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors text-xs font-bold uppercase"
          @click="langOpen = !langOpen; currencyOpen = false"
        >
          🌐 {{ ui.lang }}
        </button>
        <div v-if="langOpen" class="absolute right-0 top-11 z-50 w-40 rounded-xl bg-white dark:bg-obsidian-2 border border-gray-100 dark:border-obsidian-3 shadow-xl overflow-hidden">
          <button
            v-for="{ code, label } in ui.LANGUAGES"
            :key="code"
            class="w-full text-left px-4 py-2.5 text-sm transition-colors"
            :class="ui.lang === code ? 'bg-brand text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-obsidian-3'"
            @click="ui.lang = code; langOpen = false"
          >{{ label }}</button>
        </div>
      </div>

      <!-- Currency switcher -->
      <div ref="currencyRef" class="relative">
        <button
          aria-label="Select currency"
          class="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors text-xs font-bold"
          @click="currencyOpen = !currencyOpen; langOpen = false"
        >
          <span>{{ activeCurrency?.symbol }}</span>
          <span>{{ ui.currency }}</span>
        </button>
        <div v-if="currencyOpen" class="absolute right-0 top-11 z-50 w-48 rounded-xl bg-white dark:bg-obsidian-2 border border-gray-100 dark:border-obsidian-3 shadow-xl overflow-hidden">
          <button
            v-for="{ code, symbol, label } in ui.CURRENCIES"
            :key="code"
            class="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3"
            :class="ui.currency === code ? 'bg-brand text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-obsidian-3'"
            @click="ui.currency = code; currencyOpen = false"
          >
            <span class="w-5 text-center font-bold">{{ symbol }}</span>
            <span>{{ label }}</span>
            <span class="ml-auto text-xs font-bold" :class="ui.currency === code ? 'text-white/70' : 'text-gray-400'">{{ code }}</span>
          </button>
        </div>
      </div>

      <!-- Favorites -->
      <RouterLink
        to="/favorites"
        :aria-label="ui.t('favorites')"
        class="relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors"
        :class="route.path === '/favorites' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white'"
      >
        ♥
        <span v-if="favoritesStore.favorites.length > 0" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none border-2 border-white dark:border-obsidian-2">
          {{ favoritesStore.favorites.length > 99 ? '99+' : favoritesStore.favorites.length }}
        </span>
      </RouterLink>

      <!-- Cart -->
      <RouterLink
        to="/cart"
        :aria-label="ui.t('cart')"
        class="relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors"
        :class="route.path === '/cart' ? 'bg-brand text-white' : 'bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white'"
      >
        🛒
        <span v-if="cartStore.itemCount > 0" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand text-white text-[10px] font-bold rounded-full px-1 leading-none border-2 border-white dark:border-obsidian-2">
          {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
        </span>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'

const ui = useUiStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()

const langOpen = ref(false)
const currencyOpen = ref(false)
const langRef = ref(null)
const currencyRef = ref(null)

const date = computed(() =>
  new Date().toLocaleDateString(ui.lang, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
)

const activeCurrency = computed(() => ui.CURRENCIES.find(c => c.code === ui.currency))

function handleClickOutside(e) {
  if (langRef.value && !langRef.value.contains(e.target)) langOpen.value = false
  if (currencyRef.value && !currencyRef.value.contains(e.target)) currencyOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

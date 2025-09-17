<template>
  <RouterLink
    :to="`/product/${product.id}`"
    class="group relative flex flex-col bg-white dark:bg-obsidian-2 rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
    :class="isSelected ? 'border-brand shadow-brand/20 shadow-md' : 'border-gray-100 dark:border-obsidian-3 shadow-sm dark:shadow-none'"
    :data-category="product.category"
    data-testid="product-card"
  >
    <!-- Image -->
    <div class="relative w-full aspect-[4/3] bg-gray-50 dark:bg-obsidian-3 overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      <span
        v-if="product.discountPercentage > 0"
        class="absolute top-2.5 left-2.5 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
      >
        -{{ product.discountPercentage }}% {{ ui.t('off') }}
      </span>

      <button
        :aria-label="isFav ? ui.t('removeFromFavorites') : ui.t('addToFavorites')"
        class="absolute top-2.5 right-2.5 h-8 w-8 flex items-center justify-center bg-white/90 dark:bg-obsidian-2/90 backdrop-blur-sm rounded-xl shadow hover:scale-110 transition-transform"
        data-testid="favorite-button"
        @click.prevent="toggleFavorite"
      >
        <span :style="isFav ? 'color:#e11d48' : 'color:#9ca3af'">♥</span>
      </button>

      <button
        :aria-label="'Toggle select for comparison'"
        class="absolute bottom-2.5 left-2.5 h-7 w-7 flex items-center justify-center rounded-lg border-2 backdrop-blur-sm transition-all"
        :class="isSelected ? 'border-brand bg-brand text-white shadow-lg' : 'border-white/70 bg-white/60 text-gray-500 hover:border-brand hover:text-brand'"
        data-testid="toggle-select-button"
        @click.prevent="$emit('toggle-select')"
      >
        ✓
      </button>

      <span class="absolute bottom-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-sm px-2 py-0.5 rounded-full">
        {{ product.category }}
      </span>
    </div>

    <!-- Info -->
    <div class="flex flex-col flex-1 p-3.5 gap-2">
      <p class="text-[10px] font-semibold text-brand uppercase tracking-wider">
        {{ product.brand }}
      </p>
      <p class="font-semibold text-sm text-obsidian dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">
        {{ product.name }}
      </p>
      <div class="flex items-center gap-1">
        <span style="color:#f59e0b">★</span>
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">{{ product.rating }}</span>
      </div>
      <div class="flex items-center justify-between mt-auto pt-1 border-t border-gray-50 dark:border-obsidian-3">
        <div class="flex flex-col">
          <span class="font-bold text-brand text-sm">{{ ui.format(effectivePrice ?? product.price) }}</span>
          <span
            v-if="effectivePrice"
            class="text-[11px] text-gray-400 line-through leading-none"
          >{{ ui.format(product.price) }}</span>
        </div>
        <button
          :aria-label="ui.t('addToCart')"
          class="h-8 w-8 flex items-center justify-center rounded-xl bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/30 transition-colors"
          @click.prevent="handleAddToCart"
        >
          🛒
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'

const props = defineProps({
  product: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})
defineEmits(['toggle-select'])

const ui = useUiStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const isFav = computed(() => favoritesStore.isFavorite(props.product.id))
const effectivePrice = computed(() =>
  props.product.discountPercentage > 0
    ? props.product.price * (1 - props.product.discountPercentage / 100)
    : null
)

function toggleFavorite() {
  if (isFav.value) {
    favoritesStore.removeFavorite(props.product.id)
    toast.success(ui.t('removedFromFavorites'))
  } else {
    favoritesStore.addFavorite(props.product)
    toast.success(ui.t('addedToFavorites'))
  }
}

function handleAddToCart() {
  cartStore.addItem(props.product)
  toast.success(ui.t('addedToCart'))
}
</script>

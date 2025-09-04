<template>
  <div class="overflow-y-auto custom__scrollbar h-full">

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand/10 via-white to-blue-50 dark:from-brand/20 dark:via-obsidian dark:to-obsidian-2 px-6 py-20 lg:py-32 flex flex-col items-center text-center gap-6">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
      </div>

      <span class="relative z-10 inline-flex items-center gap-2 bg-brand/10 dark:bg-brand/20 text-brand font-semibold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
        {{ ui.t('landingBadge') }}
      </span>

      <h1 class="relative z-10 text-4xl lg:text-6xl font-extrabold text-obsidian dark:text-white leading-tight max-w-3xl">
        {{ ui.t('landingHeadline') }}
        <span class="text-brand"> MikunStore</span>
      </h1>

      <p class="relative z-10 text-base lg:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
        {{ ui.t('landingSubheadline') }}
      </p>

      <div class="relative z-10 flex flex-col sm:flex-row gap-3 mt-2">
        <RouterLink
          to="/shop"
          class="px-8 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-sm shadow-lg shadow-brand/30 transition-colors"
        >
          {{ ui.t('landingCta') }} →
        </RouterLink>
        <RouterLink
          to="/favorites"
          class="px-8 py-3 border border-gray-200 dark:border-obsidian-3 text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand font-semibold rounded-xl text-sm transition-colors"
        >
          {{ ui.t('landingSecondary') }}
        </RouterLink>
      </div>

      <div class="relative z-10 flex items-center gap-8 mt-6 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-2xl font-extrabold text-obsidian dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="px-6 lg:px-16 py-14 bg-white dark:bg-obsidian-2">
      <h2 class="text-xl font-bold text-obsidian dark:text-white mb-2">{{ ui.t('landingCategoriesTitle') }}</h2>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-8">{{ ui.t('landingCategoriesSub') }}</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.name"
          to="/shop"
          class="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-gray-100 dark:border-obsidian-3 bg-gray-50 dark:bg-obsidian-3 hover:border-brand hover:bg-brand/5 dark:hover:bg-brand/10 transition-all"
        >
          <span class="text-3xl group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
          <span class="text-sm font-semibold text-obsidian dark:text-white group-hover:text-brand transition-colors">{{ cat.name }}</span>
          <span class="text-xs text-gray-400 dark:text-gray-500">{{ cat.count }} {{ ui.t('products') }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Featured products -->
    <section class="px-6 lg:px-16 py-14 bg-gray-50 dark:bg-obsidian">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl font-bold text-obsidian dark:text-white">{{ ui.t('landingFeaturedTitle') }}</h2>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">{{ ui.t('landingFeaturedSub') }}</p>
        </div>
        <RouterLink to="/shop" class="text-sm font-semibold text-brand hover:underline hidden sm:block">
          {{ ui.t('landingViewAll') }} →
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <RouterLink
          v-for="product in featured"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="group bg-white dark:bg-obsidian-2 rounded-2xl border border-gray-100 dark:border-obsidian-3 overflow-hidden hover:border-brand hover:shadow-lg hover:shadow-brand/10 transition-all"
        >
          <div class="relative h-44 bg-gray-100 dark:bg-obsidian-3 overflow-hidden">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span v-if="product.discountPercentage > 0" class="absolute top-2 right-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{{ product.discountPercentage }}%
            </span>
          </div>
          <div class="p-4">
            <p class="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{{ product.brand }}</p>
            <p class="text-sm font-semibold text-obsidian dark:text-white line-clamp-2 leading-tight mb-2">{{ product.name }}</p>
            <div class="flex items-center justify-between">
              <span class="text-base font-extrabold text-brand">{{ ui.format(effectivePrice(product)) }}</span>
              <div class="flex items-center gap-0.5">
                <span class="text-yellow-400 text-xs">★</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="mt-6 text-center sm:hidden">
        <RouterLink to="/shop" class="text-sm font-semibold text-brand hover:underline">{{ ui.t('landingViewAll') }} →</RouterLink>
      </div>
    </section>

    <!-- Features / USPs -->
    <section class="px-6 lg:px-16 py-14 bg-white dark:bg-obsidian-2">
      <h2 class="text-xl font-bold text-obsidian dark:text-white mb-2 text-center">{{ ui.t('landingWhyTitle') }}</h2>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-10 text-center">{{ ui.t('landingWhySub') }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-obsidian-3 border border-gray-100 dark:border-obsidian-3"
        >
          <span class="text-3xl">{{ feature.icon }}</span>
          <p class="font-bold text-obsidian dark:text-white text-sm">{{ feature.title }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="px-6 lg:px-16 py-16 bg-brand">
      <div class="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
        <h2 class="text-2xl lg:text-3xl font-extrabold text-white leading-tight">{{ ui.t('landingBannerTitle') }}</h2>
        <p class="text-sm text-white/80 leading-relaxed">{{ ui.t('landingBannerSub') }}</p>
        <RouterLink
          to="/shop"
          class="px-8 py-3 bg-white text-brand font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-lg"
        >
          {{ ui.t('landingCta') }} →
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '../stores/uiStore'
import ProductData from '../data/product.json'

const ui = useUiStore()

function effectivePrice(p) {
  return p.discountPercentage > 0 ? p.price * (1 - p.discountPercentage / 100) : p.price
}

const featured = ProductData.products
  .slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4)

const categoryMap = ProductData.products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1
  return acc
}, {})

const categoryIcons = { Food: '🥗', Devices: '💻', Accessories: '🎒', 'Game Consoles': '🎮' }

const categories = Object.entries(categoryMap).map(([name, count]) => ({
  name,
  count,
  icon: categoryIcons[name] ?? '📦',
}))

const stats = computed(() => [
  { value: `${ProductData.products.length}+`, label: ui.t('landingStatProducts') },
  { value: `${ui.CURRENCIES.length}`, label: ui.t('landingStatCurrencies') },
  { value: `${ui.LANGUAGES.length}`, label: ui.t('landingStatLanguages') },
  { value: '5★', label: ui.t('landingStatRating') },
])

const features = computed(() => [
  { icon: '🌍', title: ui.t('featureMultiLang'), desc: ui.t('featureMultiLangDesc') },
  { icon: '💱', title: ui.t('featureMultiCurrency'), desc: ui.t('featureMultiCurrencyDesc') },
  { icon: '🌙', title: ui.t('featureDarkMode'), desc: ui.t('featureDarkModeDesc') },
  { icon: '🧾', title: ui.t('featureReceipt'), desc: ui.t('featureReceiptDesc') },
])
</script>

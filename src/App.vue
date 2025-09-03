<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-obsidian transition-colors duration-300">
    <AppHeader />
    <main class="flex-1 overflow-hidden">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

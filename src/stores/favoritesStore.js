import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') }
    catch { return [] }
  })

  // initialize from localStorage
  favorites.value = (() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') }
    catch { return [] }
  })()

  function persist() {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function addFavorite(product) {
    if (!favorites.value.some(p => p.id === product.id)) {
      favorites.value.push(product)
      persist()
    }
  }

  function removeFavorite(productId) {
    favorites.value = favorites.value.filter(p => p.id !== productId)
    persist()
  }

  function isFavorite(productId) {
    return favorites.value.some(p => p.id === productId)
  }

  return { favorites, addFavorite, removeFavorite, isFavorite }
})

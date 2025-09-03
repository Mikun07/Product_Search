import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((s, i) => {
      const effective = i.discountPercentage > 0
        ? i.price * (1 - i.discountPercentage / 100)
        : i.price
      return s + effective * i.quantity
    }, 0)
  )

  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function updateQuantity(productId, delta) {
    const item = items.value.find(i => i.id === productId)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) removeItem(productId)
  }

  function clearCart() {
    items.value = []
  }

  return { items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }
})

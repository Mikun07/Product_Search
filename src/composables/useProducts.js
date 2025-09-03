import { computed } from 'vue'

const SORT_FNS = {
  nameAsc:    (a, b) => a.name.localeCompare(b.name),
  priceAsc:   (a, b) => a.price - b.price,
  priceDesc:  (a, b) => b.price - a.price,
  ratingDesc: (a, b) => b.rating - a.rating,
}

export function useProducts(products, search, category, sort) {
  return computed(() => {
    const q = search.value.toLowerCase().trim()
    return [...products]
      .filter(p => {
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        const matchesCategory = category.value === 'All' || p.category === category.value
        return matchesSearch && matchesCategory
      })
      .sort(SORT_FNS[sort.value] ?? SORT_FNS.nameAsc)
  })
}

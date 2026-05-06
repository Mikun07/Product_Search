import { useMemo } from "react";

const SORT_FNS = {
  nameAsc: (a, b) => a.name.localeCompare(b.name),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  ratingDesc: (a, b) => b.rating - a.rating,
};

export const useProducts = (products, { search = "", category = "All", sort = "nameAsc" } = {}) => {
  return useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...products]
      .filter((p) => {
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q);
        const matchesCategory = category === "All" || p.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort(SORT_FNS[sort] ?? SORT_FNS.nameAsc);
  }, [products, search, category, sort]);
};

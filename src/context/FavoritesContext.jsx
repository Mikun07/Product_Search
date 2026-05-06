import { createContext, useCallback, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const addFavorite = useCallback((product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      const next = [...prev, product];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = (productId) => favorites.some((p) => p.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

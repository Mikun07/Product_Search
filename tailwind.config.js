/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#2079c9",
        "brand-dark": "#1a63a8",
        obsidian: "#0B0C10",
        "obsidian-2": "#1a1b23",
        "obsidian-3": "#23242f",
      },
    },
  },
  plugins: [],
};

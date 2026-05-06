import { useLanguage } from "../../context/LanguageContext";

const CATEGORIES = ["All", "Food", "Drinks", "Devices", "Accessories", "Games", "Game Consoles", "Lego", "Books"];

const CategoryFilter = ({ active, onSelect }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom__scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors
            ${active === cat
              ? "bg-brand text-white border-brand"
              : "bg-white dark:bg-obsidian-2 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-obsidian-3 hover:border-brand hover:text-brand"
            }`}
        >
          {cat === "All" ? t("allCategories") : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

import { useLanguage } from "../../context/LanguageContext";

const SORT_OPTIONS = [
  { value: "nameAsc", labelKey: "sortNameAsc" },
  { value: "priceAsc", labelKey: "sortPriceAsc" },
  { value: "priceDesc", labelKey: "sortPriceDesc" },
  { value: "ratingDesc", labelKey: "sortRatingDesc" },
];

const SortControl = ({ value, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">
        {t("sortBy")}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-medium bg-gray-100 dark:bg-obsidian-3 border border-gray-200 dark:border-obsidian-2 text-obsidian dark:text-white rounded-xl px-3 h-9 outline-none cursor-pointer hover:border-brand focus:border-brand transition-colors"
      >
        {SORT_OPTIONS.map(({ value: v, labelKey }) => (
          <option key={v} value={v}>{t(labelKey)}</option>
        ))}
      </select>
    </div>
  );
};

export default SortControl;

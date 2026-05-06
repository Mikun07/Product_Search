import { AiOutlineSearch } from "react-icons/ai";
import { useLanguage } from "../../context/LanguageContext";

const SearchBar = ({ value, onChange }) => {
  const { t } = useLanguage();

  return (
    <div
      className="flex items-center gap-2 bg-gray-100 dark:bg-obsidian-3 border border-gray-200 dark:border-obsidian-2 rounded-xl px-3 h-10 w-56 transition-colors focus-within:border-brand"
      data-testid="search-bar"
    >
      <AiOutlineSearch className="text-brand shrink-0" size={17} />
      <input
        type="text"
        value={value}
        placeholder={t("search")}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm flex-1 text-obsidian dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        aria-label="Search products"
        data-testid="search-input"
      />
    </div>
  );
};

export default SearchBar;

import { useLanguage } from "../../context/LanguageContext";

const currentYear = 2024;

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full px-6 lg:px-10 py-4 border-t border-gray-100 dark:border-obsidian-3 bg-white dark:bg-obsidian-2 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors duration-300 shrink-0">
      <span className="text-xs text-gray-400 dark:text-gray-500">
        &copy; {currentYear} Mikun Store.{" "}
        {t("footerRights")}
      </span>

      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
        {t("footerBuiltWith")}
        <span className="text-brand font-semibold">React</span>
        &amp;
        <span className="text-brand font-semibold">Tailwind CSS</span>
      </span>
    </footer>
  );
};

export default Footer;

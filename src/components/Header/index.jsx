import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsSun, BsMoon, BsGlobe } from "react-icons/bs";
import { BiCartAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Logo from "/mikun-logo.svg";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage, LANGUAGES } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";

const Header = () => {
  const [date, setDate] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();
  const { lang, setLanguage, t } = useLanguage();
  const { currency, setCurrency, CURRENCIES } = useCurrency();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const { pathname } = useLocation();
  const langRef = useRef(null);
  const currencyRef = useRef(null);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString(lang, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCurrency = CURRENCIES.find((c) => c.code === currency);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-obsidian-2 border-b border-gray-100 dark:border-obsidian-3 transition-colors shrink-0">
      {/* Left — avatar + name */}
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <img
          src={Logo}
          alt="Mikun Store logo"
          className="h-9 w-9 shrink-0"
        />
        <div>
          <p className="text-base font-extrabold text-obsidian dark:text-white leading-none tracking-tight">
            Mikun<span className="text-brand">Store</span>
          </p>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-0.5">
            {t("welcome")}
          </p>
        </div>
      </Link>

      {/* Center — date */}
      <span className="hidden md:block text-xs text-gray-400 dark:text-gray-500 font-medium">
        {date}
      </span>

      {/* Right — controls */}
      <div className="flex items-center gap-2">
        {/* Dark / Light toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? t("lightMode") : t("darkMode")}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors"
        >
          {isDark ? <BsSun size={16} /> : <BsMoon size={16} />}
        </button>

        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => { setLangOpen((o) => !o); setCurrencyOpen(false); }}
            aria-label={t("language")}
            className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors text-xs font-bold uppercase"
          >
            <BsGlobe size={14} />
            {lang}
          </button>

          {langOpen && (
            <div className="absolute right-0 top-11 z-50 w-40 rounded-xl bg-white dark:bg-obsidian-2 border border-gray-100 dark:border-obsidian-3 shadow-xl overflow-hidden">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${lang === code
                      ? "bg-brand text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-obsidian-3"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency switcher */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => { setCurrencyOpen((o) => !o); setLangOpen(false); }}
            aria-label="Select currency"
            className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand transition-colors text-xs font-bold"
          >
            <span>{activeCurrency?.symbol}</span>
            <span>{currency}</span>
          </button>

          {currencyOpen && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl bg-white dark:bg-obsidian-2 border border-gray-100 dark:border-obsidian-3 shadow-xl overflow-hidden">
              {CURRENCIES.map(({ code, symbol, label }) => (
                <button
                  key={code}
                  onClick={() => { setCurrency(code); setCurrencyOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3
                    ${currency === code
                      ? "bg-brand text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-obsidian-3"
                    }`}
                >
                  <span className="w-5 text-center font-bold">{symbol}</span>
                  <span>{label}</span>
                  <span className={`ml-auto text-xs font-bold ${currency === code ? "text-white/70" : "text-gray-400"}`}>
                    {code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Favorites icon with badge */}
        <Link
          to="/favorites"
          aria-label={t("favorites") ?? "Favorites"}
          className={`relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors
            ${pathname === "/favorites"
              ? "bg-red-500 text-white"
              : "bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500"
            }`}
        >
          {pathname === "/favorites"
            ? <AiFillHeart size={18} />
            : <AiOutlineHeart size={18} />
          }
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none border-2 border-white dark:border-obsidian-2">
              {favorites.length > 99 ? "99+" : favorites.length}
            </span>
          )}
        </Link>

        {/* Cart icon with badge */}
        <Link
          to="/cart"
          aria-label={t("cart")}
          className={`relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors
            ${pathname === "/cart"
              ? "bg-brand text-white"
              : "bg-gray-100 dark:bg-obsidian-3 text-gray-500 dark:text-gray-400 hover:bg-brand hover:text-white dark:hover:bg-brand"
            }`}
        >
          <BiCartAlt size={18} />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand text-white text-[10px] font-bold rounded-full px-1 leading-none border-2 border-white dark:border-obsidian-2">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;

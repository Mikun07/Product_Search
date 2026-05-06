import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineDelete, AiFillStar } from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { useFavorites } from "../../hooks/useFavorites";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

const FavoriteItem = ({ product }) => {
  const { removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const { format } = useCurrency();

  const effectiveUsdPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="group flex items-center gap-4 bg-white dark:bg-obsidian-2 rounded-2xl border border-gray-100 dark:border-obsidian-3 p-3 hover:border-brand/40 hover:shadow-md transition-all duration-200">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="shrink-0">
        <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-obsidian-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-0.5">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-semibold text-obsidian dark:text-white hover:text-brand line-clamp-2 leading-snug block"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <AiFillStar size={11} color="#f59e0b" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{product.rating}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600 mx-1">·</span>
          <span className="text-xs text-gray-400">{product.category}</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-sm font-bold text-brand">
            {format(effectiveUsdPrice ?? product.price)}
          </span>
          {effectiveUsdPrice && (
            <span className="text-xs text-gray-400 line-through">{format(product.price)}</span>
          )}
          {product.discountPercentage > 0 && (
            <span className="text-[10px] font-bold text-white bg-brand px-1.5 py-0.5 rounded-full">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => {
            addItem(product);
            toast.success(t("addedToCart"));
          }}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/30 transition-colors"
          aria-label={t("addToCart")}
        >
          <BiCartAlt size={16} />
        </button>
        <button
          onClick={() => {
            removeFavorite(product.id);
            toast.success(t("removedFromFavorites"));
          }}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label={t("removeFromFavorites")}
        >
          <AiOutlineDelete size={16} />
        </button>
      </div>
    </div>
  );
};

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full overflow-y-auto custom__scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-obsidian px-4 lg:px-8 pt-4 pb-3 border-b border-gray-100 dark:border-obsidian-3 transition-colors">
        <div className="flex items-center gap-3">
          <AiFillHeart size={20} color="#e11d48" />
          <h1 className="font-bold text-lg text-obsidian dark:text-white">
            {t("favorites") ?? "Favorites"}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({favorites.length})
            </span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 lg:px-8 py-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
              <AiFillHeart size={36} color="#fca5a5" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium text-center">
              {t("noFavorites") ?? "No favorites yet. Heart a product to save it here."}
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-2xl mx-auto lg:mx-0">
            {favorites.map((product) => (
              <FavoriteItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

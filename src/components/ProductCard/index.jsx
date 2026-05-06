import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart, AiFillStar, AiOutlineCheck } from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

const ProductCard = ({ product, onToggleSelect, isSelected }) => {
  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { t } = useLanguage();
  const { format } = useCurrency();

  const fav = isFavorite(product.id);

  const effectiveUsdPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  const toggleFavorite = (e) => {
    e.preventDefault();
    if (fav) {
      removeFavorite(product.id);
      toast.success(t("removedFromFavorites"));
    } else {
      addFavorite(product);
      toast.success(t("addedToFavorites"));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(t("addedToCart"));
  };

  const handleToggleSelect = (e) => {
    e.preventDefault();
    onToggleSelect();
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group relative flex flex-col bg-white dark:bg-obsidian-2 rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
        ${isSelected
          ? "border-brand shadow-brand/20 shadow-md"
          : "border-gray-100 dark:border-obsidian-3 shadow-sm dark:shadow-none"
        }`}
      data-category={product.category}
      data-testid="product-card"
    >
      {/* Image area */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-obsidian-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            -{product.discountPercentage}% {t("off")}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2.5 right-2.5 h-8 w-8 flex items-center justify-center bg-white/90 dark:bg-obsidian-2/90 backdrop-blur-sm rounded-xl shadow hover:scale-110 transition-transform"
          aria-label={fav ? t("removeFromFavorites") : t("addToFavorites")}
          data-testid="favorite-button"
        >
          {fav
            ? <AiFillHeart size={16} color="#e11d48" />
            : <AiOutlineHeart size={16} className="text-gray-400" />
          }
        </button>

        {/* Compare toggle — bottom-left on image */}
        <button
          onClick={handleToggleSelect}
          className={`absolute bottom-2.5 left-2.5 h-7 w-7 flex items-center justify-center rounded-lg border-2 backdrop-blur-sm transition-all
            ${isSelected
              ? "border-brand bg-brand text-white shadow-lg"
              : "border-white/70 bg-white/60 text-gray-500 hover:border-brand hover:text-brand"
            }`}
          aria-label="Toggle select for comparison"
          data-testid="toggle-select-button"
        >
          <AiOutlineCheck size={13} />
        </button>

        {/* Category pill */}
        <span className="absolute bottom-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-sm px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Brand */}
        <p className="text-[10px] font-semibold text-brand uppercase tracking-wider">
          {product.brand}
        </p>

        {/* Name */}
        <p className="font-semibold text-sm text-obsidian dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <AiFillStar size={12} color="#f59e0b" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {product.rating}
          </span>
        </div>

        {/* Price + cart */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50 dark:border-obsidian-3">
          <div className="flex flex-col">
            <span className="font-bold text-brand text-sm">
              {format(effectiveUsdPrice ?? product.price)}
            </span>
            {effectiveUsdPrice && (
              <span className="text-[11px] text-gray-400 line-through leading-none">
                {format(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/30 transition-colors"
            aria-label={t("addToCart")}
          >
            <BiCartAlt size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

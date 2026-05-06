import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineHeart,
  AiFillHeart,
  AiFillStar,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";
import ProductData from "../../data/product.json";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { format } = useCurrency();
  const { addItem, updateQuantity, items } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const product = ProductData.products.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 dark:text-gray-500">
        <p className="text-lg">{t("notFound")}</p>
        <Link to="/" className="text-sm text-brand hover:underline font-semibold">
          ← {t("back")}
        </Link>
      </div>
    );
  }

  const effectiveUsdPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  const cartItem = items.find((i) => i.id === product.id);
  const fav = isFavorite(product.id);

  const toggleFavorite = () => {
    if (fav) {
      removeFavorite(product.id);
      toast.success(t("removedFromFavorites"));
    } else {
      addFavorite(product);
      toast.success(t("addedToFavorites"));
    }
  };

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(product.id, quantity);
    } else {
      for (let i = 0; i < quantity; i++) addItem(product);
    }
    toast.success(t("addedToCart"));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto custom__scrollbar">
      {/* Left — image */}
      <div className="relative lg:w-1/2 lg:h-full h-72 bg-gray-100 dark:bg-obsidian-3 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center bg-white/90 dark:bg-obsidian-2/90 rounded-xl shadow text-obsidian dark:text-white hover:bg-brand hover:text-white transition-colors"
          aria-label={t("back")}
        >
          <AiOutlineArrowLeft size={20} />
        </button>

        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
            -{product.discountPercentage}% {t("off")}
          </span>
        )}
      </div>

      {/* Right — details */}
      <div className="flex-1 flex flex-col gap-6 p-6 lg:p-10 overflow-y-auto custom__scrollbar">
        {/* Brand */}
        <p className="text-xs font-semibold text-brand uppercase tracking-widest">
          {product.brand}
        </p>

        {/* Name + favorite */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl lg:text-2xl font-bold text-obsidian dark:text-white leading-tight">
            {product.name}
          </h1>
          <button
            onClick={toggleFavorite}
            className="shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-obsidian-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label={fav ? t("removeFromFavorites") : t("addToFavorites")}
          >
            {fav
              ? <AiFillHeart size={22} color="#e11d48" />
              : <AiOutlineHeart size={22} className="text-gray-400" />
            }
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <AiFillStar
                key={i}
                size={18}
                color={i < Math.round(product.rating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {product.rating}
          </span>
          <span className="text-xs text-gray-400">· {product.category}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-brand">
            {format(effectiveUsdPrice ?? product.price)}
          </span>
          {!!effectiveUsdPrice && (
            <span className="text-base text-gray-400 line-through">
              {format(product.price)}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-100 dark:border-obsidian-3" />

        {/* Description */}
        <div>
          <h2 className="text-sm font-bold text-obsidian dark:text-white mb-2">
            {t("description")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-obsidian-3 rounded-xl px-3 py-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
            >
              <AiOutlineMinus size={15} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-obsidian dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
            >
              <AiOutlinePlus size={15} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 h-11 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-brand/30"
          >
            <BiCartAlt size={18} />
            {t("addToCart")}
            {cartItem && (
              <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItem.quantity} {t("qty")}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

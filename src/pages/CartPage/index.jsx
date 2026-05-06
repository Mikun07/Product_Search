import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete, AiOutlineShopping, AiOutlineDownload } from "react-icons/ai";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

const CartItem = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();
  const { t } = useLanguage();
  const { format } = useCurrency();

  const effectiveUsdPrice =
    item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-obsidian-3 last:border-0">
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 rounded-xl object-cover bg-gray-100 dark:bg-obsidian-3"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.id}`}
          className="text-sm font-semibold text-obsidian dark:text-white hover:text-brand line-clamp-2 leading-tight block"
        >
          {item.name}
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.brand}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-bold text-brand">
            {format(effectiveUsdPrice)}
          </span>
          {item.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {format(item.price)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-obsidian-3 rounded-xl px-2 py-1.5 shrink-0">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
          aria-label="Decrease quantity"
        >
          <AiOutlineMinus size={13} />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-obsidian dark:text-white">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-obsidian-2 text-obsidian dark:text-white transition-colors"
          aria-label="Increase quantity"
        >
          <AiOutlinePlus size={13} />
        </button>
      </div>

      {/* Line total */}
      <span className="text-sm font-bold text-obsidian dark:text-white w-20 text-right shrink-0">
        {format(effectiveUsdPrice * item.quantity)}
      </span>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
        aria-label={t("removeFromCart")}
      >
        <AiOutlineDelete size={17} />
      </button>
    </div>
  );
};

const RATES = { USD: 1, GBP: 0.79, EUR: 0.92, NGN: 1620 };

const CartPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLanguage();
  const { format, currency } = useCurrency();
  const [downloading, setDownloading] = useState(false);

  const handleCheckout = async () => {
    setDownloading(true);
    try {
      const { generateReceipt } = await import("../../utils/generateReceipt");
      generateReceipt({ items, subtotal, currency, rates: RATES });
      toast.success("Receipt downloaded!");
    } catch (e) {
      toast.error("Could not generate receipt.");
    } finally {
      setDownloading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-4">
        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-obsidian-3">
          <AiOutlineShopping size={36} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{t("emptyCart")}</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto custom__scrollbar gap-0">
      {/* Items list */}
      <div className="flex-1 overflow-y-auto custom__scrollbar px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-obsidian dark:text-white">
            {t("cart")}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            Clear all
          </button>
        </div>

        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="lg:w-80 lg:shrink-0 px-4 lg:px-6 py-6 lg:py-6 bg-white dark:bg-obsidian-2 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-obsidian-3">
        <h2 className="text-sm font-bold text-obsidian dark:text-white mb-4">
          Order Summary
        </h2>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>{t("subtotal")}</span>
            <span>{format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Shipping</span>
            <span className="text-green-500 font-medium">Free</span>
          </div>
          <hr className="border-gray-100 dark:border-obsidian-3" />
          <div className="flex justify-between font-bold text-obsidian dark:text-white text-base">
            <span>{t("total")}</span>
            <span>{format(subtotal)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={downloading}
          className="mt-6 w-full h-11 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-brand/30"
        >
          <AiOutlineDownload size={16} />
          {downloading ? "Generating…" : t("checkout")}
        </button>

        <Link
          to="/"
          className="mt-3 w-full h-10 flex items-center justify-center border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 hover:border-brand hover:text-brand rounded-xl text-sm font-medium transition-colors"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
};

export default CartPage;

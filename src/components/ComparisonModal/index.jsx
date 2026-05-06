import { AiOutlineClose } from "react-icons/ai";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../context/CurrencyContext";

const ComparisonModal = ({ onClose, cheapestProduct, selectedProducts, products }) => {
  const { t } = useLanguage();
  const { format } = useCurrency();

  const grouped = selectedProducts.reduce((acc, id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return acc;
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const totalSavings = selectedProducts
    .reduce((acc, id) => {
      const product = products.find((p) => p.id === id);
      return acc + (product ? product.price - cheapestProduct.price : 0);
    }, 0)
    .toFixed(2);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      data-testid="comparison-modal"
    >
      <div className="bg-white dark:bg-obsidian-2 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-gray-100 dark:border-obsidian-3">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-obsidian-3 shrink-0">
          <h2
            className="text-lg font-bold text-obsidian dark:text-white"
            data-testid="comparison-modal-title"
          >
            {t("comparisonResult")}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-obsidian-3 hover:text-obsidian dark:hover:text-white transition-colors"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto custom__scrollbar p-6 flex flex-col gap-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="rounded-xl border border-gray-100 dark:border-obsidian-3 overflow-hidden">
              <div className="px-4 py-2 bg-brand/10 dark:bg-brand/20">
                <h3 className="text-xs font-bold text-brand uppercase tracking-widest">{category}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-obsidian-3">
                {items.map((product) => {
                  const isCheapest = product.id === cheapestProduct.id;
                  return (
                    <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                        {product.name}
                      </p>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${isCheapest ? "text-green-500" : "text-obsidian dark:text-white"}`}>
                          {format(product.price)}
                        </p>
                        {isCheapest && (
                          <p className="text-xs text-green-500 font-medium">Best price</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Savings banner */}
          <div className="rounded-xl bg-brand/10 dark:bg-brand/20 px-4 py-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t("savings")}{" "}
              <span className="font-bold text-brand">{format(Number(totalSavings))}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-obsidian-3 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold transition-colors text-sm"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;

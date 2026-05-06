import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import CategoryFilter from "../../components/CategoryFilter";
import SortControl from "../../components/SortControl";
import ComparisonModal from "../../components/ComparisonModal";
import { useProducts } from "../../hooks/useProducts";
import { useLanguage } from "../../context/LanguageContext";
import ProductData from "../../data/product.json";

const PAGE_SIZE = 20;

const CatalogPage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("nameAsc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [cheapestProduct, setCheapestProduct] = useState(null);
  const [page, setPage] = useState(1);

  const displayList = useProducts(ProductData.products, { search, category, sort });

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const totalPages = Math.max(1, Math.ceil(displayList.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = displayList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) {
      toast.error(t("selectTwo"));
      return;
    }
    const details = selectedIds.map((id) =>
      ProductData.products.find((p) => p.id === id)
    );
    const sorted = [...details].sort((a, b) => a.price - b.price);
    setCheapestProduct(sorted[0]);
    setShowComparison(true);
  };

  const goToPage = (p) => {
    setPage(p);
    // Scroll catalog grid back to top
    document.getElementById("catalog-grid")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 bg-gray-50 dark:bg-obsidian px-4 pt-4 pb-2 flex flex-col gap-3 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-bold text-lg text-obsidian dark:text-white shrink-0">
            {t("products")}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({displayList.length})
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <SortControl value={sort} onChange={setSort} />
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
        <CategoryFilter active={category} onSelect={setCategory} />
      </div>

      {/* Scrollable grid */}
      <div id="catalog-grid" className="flex-1 overflow-y-auto custom__scrollbar px-4 relative">
        {/* Watermark */}
        <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center z-0 select-none" aria-hidden>
          <img
            src="/mikun-logo.svg"
            alt=""
            className="w-64 h-64 opacity-[0.04] dark:opacity-[0.06]"
          />
          <span className="text-6xl font-black tracking-tight opacity-[0.04] dark:opacity-[0.06] text-obsidian dark:text-white -mt-4">
            MikunStore
          </span>
        </div>

        {displayList.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
            {t("noResults")}
          </div>
        ) : (
          <>
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleSelect={() => toggleSelect(product.id)}
                  isSelected={selectedIds.includes(product.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-8">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:border-brand hover:text-brand transition-colors"
                >
                  <AiOutlineLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === safePage;
                  // Show first, last, active, and neighbours; replace gaps with ellipsis
                  const show =
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 1;
                  const showEllipsisBefore = p === safePage - 2 && safePage > 3;
                  const showEllipsisAfter = p === safePage + 2 && safePage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={p} className="text-gray-400 text-sm px-1 select-none">
                        …
                      </span>
                    );
                  }
                  if (!show) return null;

                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`h-9 min-w-[36px] px-2 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors
                        ${isActive
                          ? "bg-brand text-white shadow-sm shadow-brand/30"
                          : "border border-gray-200 dark:border-obsidian-3 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand"
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-obsidian-3 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:border-brand hover:text-brand transition-colors"
                >
                  <AiOutlineRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating compare button */}
      {selectedIds.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleCompare}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl shadow-lg font-semibold text-sm transition-colors"
            data-testid="compare-selected-button"
          >
            {t("compare")} ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Comparison modal */}
      {showComparison && cheapestProduct && (
        <ComparisonModal
          onClose={() => setShowComparison(false)}
          cheapestProduct={cheapestProduct}
          selectedProducts={selectedIds}
          products={ProductData.products}
        />
      )}
    </div>
  );
};

export default CatalogPage;

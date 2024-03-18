import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import SearchBar from "./components/Search/SearchBar";
import ProductCard from "./components/card/ProductCard";
import Modal from "./components/modal/Modal";
import ProductData from "./data/product.json";
import PreviewData from "./components/modal/PreviewData";
import ComparisonModal from "./components/modal/ComparisonModal ";

function App() {
  const [activeSearch, setActiveSearch] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cheapestProduct, setCheapestProduct] = useState(null);
  const [savings, setSavings] = useState(0);

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery === "") {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(
      ProductData?.products?.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
      )
    );
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleOnClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleToggleSelect = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      toast.error("Please select at least 2 products to compare.");
      return;
    }

    const selectedProductDetails = selectedProducts.map((productId) =>
      ProductData.products.find((product) => product.id === productId)
    );

    const sortedProducts = selectedProductDetails.sort(
      (a, b) => a.price - b.price
    );

    const cheapestProduct = sortedProducts[0];
    const mostExpensiveProduct = sortedProducts[sortedProducts.length - 1];
    const savings = mostExpensiveProduct.price - cheapestProduct.price;

    setCheapestProduct(cheapestProduct); // Assuming you have a state for cheapestProduct
    setSavings(savings); // Assuming you have a state for savings
    setShowComparisonModal(true);
  };

  const handleCloseComparisonModal = () => {
    setShowComparisonModal(false);
  };

  return (
    <>
      <div className="w-full h-screen p-4 overflow-hidden">
        <Header />
        <div className="mt-6 w-full h-screen overflow-y-auto custom__scrollbar">
          <div className="w-full flex justify-between items-center px-2 sticky top-0 bg-white z-20">
            <h1 className="font-bold text-lg">Product</h1>
            <SearchBar handleSearch={handleSearch} />
          </div>
          <div className="pt-5 pb-28 lg:pl-10 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
            {activeSearch.length === 0
              ? ProductData?.products?.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onProductClick={() => handleProductClick(product)}
                    onToggleSelect={() => handleToggleSelect(product.id)}
                    isSelected={selectedProducts.includes(product.id)}
                  />
                ))
              : activeSearch.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onProductClick={() => handleProductClick(product)}
                    onToggleSelect={() => handleToggleSelect(product.id)}
                    isSelected={selectedProducts.includes(product.id)}
                  />
                ))}
          </div>
        </div>
        <Modal
          className="bg-white absolute right-0 lg:w-[500px] w-full h-full flex flex-col gap-2 overflow-hidden"
          onClose={handleOnClose}
          visible={showModal}
          body={<PreviewData data={selectedProduct} />}
        />
      </div>
      {selectedProducts.length >= 2 && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleCompare}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Compare Selected Products
          </button>
        </div>
      )}
      {showComparisonModal && (
        <ComparisonModal
          onClose={handleCloseComparisonModal}
          cheapestProduct={cheapestProduct}
          savings={savings}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;

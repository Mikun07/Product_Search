import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import SearchBar from "./components/Search/SearchBar";
import ProductCard from "./components/card/ProductCard";
import Modal from "./components/modal/Modal";
import ProductData from "./data/product.json";
import PreviewData from "./components/modal/PreviewData";

function App() {
  const [activeSearch, setActiveSearch] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
  return (
    <>
      <div className="w-full h-screen p-4 overflow-hidden">
        <Header />
        <div className="mt-6 w-full h-screen overflow-y-auto custom__scrollbar">
          <div className="w-full flex justify-between items-center px-2 sticky top-0 bg-white z-20">
            <h1 className="font-bold text-lg">Product</h1>
            <SearchBar handleSearch={handleSearch} />
          </div>
          <div className="pt-5 pb-28 lg:pl-10 grid xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
            {activeSearch.length === 0
              ? ProductData?.products?.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onProductClick={() => handleProductClick(product)}
                  />
                ))
              : activeSearch.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onProductClick={() => handleProductClick(product)}
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
      <Toaster />
    </>
  );
}

export default App;

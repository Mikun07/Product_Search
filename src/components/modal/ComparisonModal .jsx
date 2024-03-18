import React from "react";

const ComparisonModal = ({
  onClose,
  cheapestProduct,
  savings,
  selectedProducts,
  ProductData,
}) => {
  const groupProductsByCategory = () => {
    const groupedProducts = {};
    selectedProducts.forEach((productId) => {
      const product = ProductData.products.find((p) => p.id === productId);
      if (product) {
        if (!groupedProducts[product.category]) {
          groupedProducts[product.category] = [];
        }
        groupedProducts[product.category].push(product);
      }
    });
    return groupedProducts;
  };

  const renderProductDetails = (category, products) => (
    <div key={category}>
      <h3 className="text-lg font-semibold mb-2">{category}</h3>
      <ul className="mb-4">
        {products.map((product) => (
          <li key={product.id} className="flex justify-between">
            <span>{product.name}</span>
            <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const totalSavings = selectedProducts.reduce((acc, productId) => {
    const product = ProductData.products.find((p) => p.id === productId);
    return acc + product.price - cheapestProduct.price;
  }, 0);

  const roundedTotalSavings = totalSavings.toFixed(2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white h-[500px] custom__scrollbar overflow-y-auto mx-2 p-4 md:p-8 rounded-lg shadow-xl lg:w-[600px] w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Comparison Result
        </h2>
        <div className="mb-4">
          {Object.entries(groupProductsByCategory()).map(
            ([category, products]) => (
              <div key={category} className="mb-4">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {category}
                </h3>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row justify-between items-center"
                  >
                    <p className="mb-2 md:mb-0">{product.name}</p>
                    <p className="md:ml-4">
                      <span>&#36;</span> {product.price}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <p className="mb-4">
          If you buy the cheapest product, you would save <span>&#36;</span>{" "}
          {roundedTotalSavings}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;

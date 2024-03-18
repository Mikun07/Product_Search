import React from "react";

const ComparisonModal = ({ onClose, cheapestProduct, savings, }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Comparison Result</h2>
        <p className="mb-4">
          If you buy the cheapest product, you would save ${savings}.
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

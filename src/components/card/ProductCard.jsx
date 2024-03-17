import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlus, AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductCard = ({ product, onProductClick, }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = () => toast.success("Added to cart");
  const addToFavorite = () => {
    setIsFavorite(true);
    toast.success("Added to favorites");
  };
  const removeFavorite = () => {
    setIsFavorite(false);
    toast.success("Removed from favorites");
  };
  const toggleFavorite = (event) => {
    event.stopPropagation();
    if (isFavorite) {
      removeFavorite();
    } else {
      addToFavorite();
    }
  };

  return (
    <>
      <div className="h-52 bg-gray-100 lg:w-48 md:w-44 w-44 rounded-lg shadow-sm shadow-gray-400 flex flex-col justify-between">
        <div onClick={onProductClick} className="relative cursor-pointer">
          <img
            src={`src/${product.image}`}
            alt={product.name}
            className="w-full h-32 rounded-t-lg object-center"
          />

          <button
            className="absolute flex justify-center items-center h-[35px] w-[35px] bg-gray-100 top-2 right-2 rounded-lg shadow-sm shadow-gray-400"
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <AiFillHeart size={20} color="red" />
            ) : (
              <AiOutlineHeart size={20} />
            )}
          </button>
        </div>

        <div className="p-2">
          <p className="font-semibold lg:text-base text-sm w-full truncate">
            {product.name}
          </p>
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm capitalize">
              <span>&#36;</span> <span>{product.price}</span>
            </p>
            <button
              onClick={addToCart}
              className="h-[35px] w-[35px] flex justify-center items-center rounded-full border-2 border-gray-400"
              aria-label="Add to cart"
            >
              <AiOutlinePlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

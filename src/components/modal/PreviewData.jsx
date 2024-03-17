import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineHeart,
  AiFillHeart,
  AiFillStar,
} from "react-icons/ai";

const PreviewData = ({ data }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);

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

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <>
      <div className="flex flex-col relative w-full h-full">
        <div className="flex w-full h-[60%] absolute">
          <img
            src={`src/${data.image}`}
            alt={data.name}
            className="w-full h-full object-center"
          />
        </div>
        <div className="bg-gray-200 flex w-full h-[60%] absolute bottom-0 z-20 p-2 rounded-t-[40px]">
          <div className="h-full w-full flex flex-col rounded-t-[40px] px-2">
            <div className="flex flex-col gap-2 border-b-2 pb-4">
              <div className="flex w-full items-center mt-2">
                <p className="font-semibold lg:text-base text-sm w-full truncate leading-4 lg:tracking-tight">
                  {data.name}
                </p>
                <button
                  className="flex justify-center items-center h-[35px] w-[35px] bg-gray-100 top-2 right-2 rounded-lg shadow-sm shadow-gray-400"
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

              <div className="flex items-center gap-1">
                <AiFillStar size={25} color="#e3c100" />
                <p className="font-semibold text-sm capitalize">
                  {" "}
                  {data.rating}
                </p>
              </div>

              <div className="flex w-full items-center justify-between">
                <p className="font-semibold text-sm capitalize">
                  <span>&#36;</span> <span>{data.price}</span>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="flex justify-center items-center h-[35px] w-[35px] bg-gray-100 rounded-lg shadow-sm shadow-gray-400"
                    onClick={decreaseQuantity}
                  >
                    <AiOutlineMinus size={25} />
                  </button>
                  <p className="font-medium text-sm capitalize">{quantity}</p>
                  <button
                    className="flex justify-center items-center h-[35px] w-[35px] bg-gray-100 rounded-lg shadow-sm shadow-gray-400"
                    onClick={increaseQuantity}
                  >
                    <AiOutlinePlus size={25} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <h1 className="font-bold">Description</h1>
              <p className="text-justify tracking-tight leading-6">
                {data.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewData;

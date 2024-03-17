import { BiLeftArrowAlt, BiCartAlt } from "react-icons/bi";
import toast from "react-hot-toast"; 

const Modal = ({ visible, onClose, body, className }) => {
  if (!visible) return null;

  const addToCart = () => {
    toast.success("Added to cart");
  };

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-70 backdrop-blur-sm h-full overflow-hidden flex justify-center items-center">
      <div className={className}>
        <div className="absolute z-50 flex w-full justify-between px-7 top-4 font-semibold text-black">
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] bg-white opacity-80 rounded-lg shadow-sm shadow-gray-100 flex items-center justify-center"
          >
            <BiLeftArrowAlt size={25} />
          </button>

          <button
            onClick={addToCart}
            aria-label="Add to cart"
            className="w-[40px] h-[40px] bg-white opacity-80 rounded-lg shadow-sm shadow-gray-100 flex items-center justify-center"
          >
            <BiCartAlt size={25} />
          </button>
        </div>
        <div className="w-full h-full">{body}</div>
      </div>
    </div>
  );
};

export default Modal;

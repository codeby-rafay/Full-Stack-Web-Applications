import { X } from "lucide-react";

const CartHeader = ({handleClose, cartCount}) => {
  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">
          My Cart{" "}
          {cartCount > 0 && (
            <span className="text-orange-500">({cartCount})</span>
          )}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1 transition-colors hover:bg-gray-200 rounded-lg cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
};

export default CartHeader;

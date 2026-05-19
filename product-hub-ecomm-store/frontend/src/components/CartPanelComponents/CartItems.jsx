import { Trash2, Plus, Minus } from "lucide-react";

// Single cart item with + and - buttons
function CartItems({ item, onRemove, onIncrease, onDecrease }) {
  const stockLeft = item.originalStock - item.quantity;

  return (
    <div className="bg-gray-50 rounded-xl p-3 hover:border-orange-600 transition-colors border border-transparent">
      <div className="flex items-start gap-3">
        {/* Product image */}
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Product name */}
          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
            {item.title}
          </p>

          {/* Price per item */}
          <p className="text-xs text-gray-400 mt-0.5">${item.price} each</p>

          {/* Stock remaining */}
          <p className="text-xs text-gray-400 mt-0.5">
            {stockLeft} left in stock
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:bg-red-200 px-1 py-1 rounded-md transition-colors cursor-pointer shrink-0"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* + - buttons and subtotal */}
      <div className="flex items-center justify-between mt-3">
        {/* Quantity controls */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-2 py-1">
          {/* Minus button */}
          <button
            onClick={() => onDecrease(item.id)}
            className="text-gray-500 hover:text-orange-500 transition-colors bg-gray-100 rounded-md cursor-pointer w-5 h-5 flex items-center justify-center"
          >
            <Minus size={14} />
          </button>

          {/* Current quantity */}
          <span className="text-sm font-bold text-gray-800 w-5 text-center">
            {item.quantity}
          </span>

          {/* Plus button -- disabled if quantity = original stock */}
          <button
            onClick={() => onIncrease(item.id)}
            disabled={item.quantity >= item.originalStock}
            className={`transition-colors w-5 h-5 flex items-center justify-center bg-gray-100 cursor-pointer rounded-md ${
              item.quantity >= item.originalStock
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Subtotal for items */}
        <span className="text-orange-500 font-bold text-sm">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartItems;

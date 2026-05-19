const CartPanelFooter = ({cartCount, totalPrice, cartItems}) => {
  return (
    <div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </span>
            <span className="text-gray-400 text-xs">incl. taxes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-bold text-lg">Total</span>
            <span className="text-orange-500 font-bold text-2xl">
              ${totalPrice}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanelFooter;

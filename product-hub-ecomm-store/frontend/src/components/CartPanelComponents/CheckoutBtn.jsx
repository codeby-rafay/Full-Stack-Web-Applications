import { Loader } from "lucide-react";

const CheckoutBtn = ({ handleCheckout, cartItems, isProcessing = false }) => {
  return (
    <div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:bg-orange-700 text-white font-bold cursor-pointer py-3 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100 disabled:hover:shadow-md flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutBtn;

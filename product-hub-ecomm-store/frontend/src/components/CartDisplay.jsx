import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast, Slide } from "react-toastify";
import { useShop } from "../context/ShopContext";
import CheckoutBtn from "./CartPanelComponents/CheckoutBtn";
import CartItems from "./CartPanelComponents/CartItems";
import CartHeader from "./CartPanelComponents/CartHeader";
import CartPanelFooter from "./CartPanelComponents/CartPanelFooter";
import PaymentMethodModal from "../components/ModalComponents/PaymentMethodModal";
import axios from "axios";

function CartDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const {
    cartItems,
    cartCount,
    removeFromCart,
    increaseQty,
    decreaseQty,
    currentUser,
    setCartItems,
  } = useShop();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please login to checkout", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
      return;
    }

    handleClose();
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  const handlePaymentMethodSelect = async ({
    paymentMethod,
    shippingAddress,
    notes,
  }) => {
    try {
      setIsProcessing(true);
      setShowPaymentModal(false);

      const orderData = {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.fullName,
        products: cartItems.map((item) => ({
          id: item.id,
          name: item.title || item.name || "Product",
          price: item.price,
          quantity: item.quantity,
          category: item.category || "",
        })),
        totalAmount: parseFloat(totalPrice),
        totalItems: cartItems.length,
        paymentMethod,
        shippingAddress,
        notes,
      };

      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.order) {
        const successMsg =
          paymentMethod === "card"
            ? "Order placed! Payment completed. ✅"
            : "Order placed! Payment due on delivery. 📦";

        toast.success(successMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        });

        // Clear cart items
        setCartItems([]);
        localStorage.removeItem(`cart_${currentUser.id}`);

        // Close cart drawer
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Checkout failed. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate total price of all items in cart
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={handlePaymentMethodSelect}
        cartItems={cartItems}
        totalPrice={totalPrice}
      />

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-orange-500 hover:bg-orange-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
      >
        <ShoppingCart size={24} />
        {/* Notification badge if items are in cart */}
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Panel Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark background - click to close */}
          <div
            className={`flex-1 bg-black/40 ${
              isClosing ? "animate-fadeOut" : "animate-fadeIn"
            }`}
            onClick={handleClose}
          />

          {/* Cart Panel */}
          <div
            className={`w-80 bg-white h-full flex flex-col shadow-2xl ${
              isClosing ? "animate-slideOutRight" : "animate-slideInRight"
            }`}
          >
            {/* Header */}
            <CartHeader handleClose={handleClose} cartCount={cartCount} />

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <ShoppingCart size={48} className="text-gray-200" />
                  <p className="text-gray-400 font-medium">No items in cart</p>
                  <p className="text-gray-300 text-sm">
                    Go to a product and click Add to Cart
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <CartItems
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer-total price */}
            <CartPanelFooter
              cartCount={cartCount}
              totalPrice={totalPrice}
              cartItems={cartItems}
            />

            {/* Checkout Button */}
            <CheckoutBtn
              handleCheckout={handleCheckout}
              cartItems={cartItems}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CartDisplay;

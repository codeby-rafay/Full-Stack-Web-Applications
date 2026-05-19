import { ShoppingCart, Check } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { addtocartToast } from "../../utils/toastUtils";

const AddtoCartBtn = ({ product }) => {
  const { addToCart, isInCart, currentUser } = useShop();
  const navigate = useNavigate();

  const alreadyInCart = isInCart(product?.id);

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (product && !alreadyInCart) {
      addToCart(product);
      addtocartToast();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={alreadyInCart}
        className={`grow flex items-center justify-center gap-2 cursor-pointer py-3 px-6 rounded-xl font-semibold text-md transition-colors ${
          alreadyInCart
            ? "bg-green-500 text-white cursor-default"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        {alreadyInCart ? (
          <>
            Added to Cart <Check size={20} strokeWidth={3.75} />
          </>
        ) : (
          <>
            Add to Cart <ShoppingCart size={25} strokeWidth={1.75} />
          </>
        )}
      </button>
    </div>
  );
};

export default AddtoCartBtn;

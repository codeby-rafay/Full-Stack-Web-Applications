import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SeeAllProducts = () => {
  return (
    <div className="text-center mt-10 flex justify-center">
      <Link
        to="/products"
        className="relative overflow-hidden inline-flex active:scale-95 items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3 px-8 rounded-xl lg:bg-transparent lg:border-3 lg:border-orange-500 lg:text-orange-500 group"
      >
        {/* Animated background */}
        <span className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-in-out hidden lg:block"></span>

        <span className="relative z-10 flex items-center gap-2 lg:group-hover:text-white">
          See All Products <ArrowRight size={16} strokeWidth={2} />
        </span>
      </Link>
    </div>
  );
};

export default SeeAllProducts;

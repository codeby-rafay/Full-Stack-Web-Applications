import { Link } from "react-router-dom";

const ShopbyCategoryBtn = () => {
  return (
    <div>
      <Link
        to="/categories"
        className="relative overflow-hidden inline-flex items-center justify-center bg-black text-white px-4 sm:px-8 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap lg:bg-white lg:text-black lg:border lg:border-gray-200 group"
      >
        {/* Animated background */}
        <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out hidden lg:block"></span>

        <span className="relative z-10 lg:group-hover:text-white">
          Shop by Category
        </span>
      </Link>
    </div>
  );
};

export default ShopbyCategoryBtn;

import { Link } from "react-router-dom";

const BrowseProductBtn = () => {
  return (
    <div>
      <Link
        to="/products"
        className="bg-orange-500 hover:bg-orange-700 text-white px-4 sm:px-8 py-3.5 rounded-xl active:scale-95 font-semibold text-sm transition-all whitespace-nowrap"
      >
        Browse All Products
      </Link>
    </div>
  );
};

export default BrowseProductBtn;

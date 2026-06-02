import { Link } from "react-router-dom";
import { useSavedItems } from "../redux/hooks";
import { Heart } from "lucide-react";
import { unsaveToast } from "../utils/toastUtils";

function Saved() {
  const { savedItems, toggleSave } = useSavedItems();

  window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <h1
        className="text-4xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Saved <span className="text-orange-500">Items</span>
      </h1>
      <p className="text-gray-400 text-md mb-8">
        {savedItems.length} item{savedItems.length !== 1 ? "s" : ""} saved
      </p>

      {/* If page is empty the this code works */}
      {savedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Heart size={56} className="text-gray-200" />
          <p className="text-gray-400 text-lg font-medium">
            No saved items yet
          </p>
          <p className="text-gray-400 text-sm">
            Click the Save button on any product to save it here
          </p>
          <Link
            to="/products"
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Saved Items Grid */}
      {savedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border hover:-translate-y-3 group border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Image of product */}
              <Link to={`/products/${product.id}`}>
                <div className="bg-gray-200 h-48 overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Title of product */}
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-orange-500 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-orange-500 font-bold text-lg mt-1">
                  ${product.price}
                </p>

                {/* Remove button */}
                <button
                  onClick={() => {
                    toggleSave(product);
                    unsaveToast();
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl cursor-pointer text-sm font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Saved;

import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Star } from "lucide-react";

function ProductCard({ product }) {
  // star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      >
        <Star strokeWidth={3} fill="currentColor" size={14} />
      </span>
    ));
  };

  // Get how many of this product are already in the cart
  const { getQtyInCart } = useShop();

  // Stock remaining = original stock minus what's already in cart
  const qtyInCart = getQtyInCart(product.id);
  const stockRemaining = product.stock - qtyInCart;

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-50 h-52">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Discount badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-600 font-bold text-xs px-2 py-1 rounded-full capitalize">
            {product.category}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
            {product.title}
          </h3>

          <p className="text-gray-400 text-xs line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-xs">{renderStars(product.rating)}</div>
            <span className="text-gray-400 text-xs">({product.rating})</span>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-orange-500">
                ${product.price}
              </span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                stockRemaining > 10
                  ? "bg-green-100 text-green-700"
                  : stockRemaining > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {stockRemaining > 10
                ? "In Stock"
                : stockRemaining > 0
                  ? `${stockRemaining} left`
                  : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

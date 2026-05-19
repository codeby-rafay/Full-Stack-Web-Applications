import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleProduct } from "../api/products";
import { Loading, ErrorMessage } from "../components/LoadingError";
import { Star, ArrowLeft } from "lucide-react";
import { useShop } from "../context/ShopContext";
import AddtoCartBtn from "../components/SingleProductPageComponents/AddtoCartBtn";
import CustomerReview from "../components/SingleProductPageComponents/CustomerReview";
import SaveBtn from "../components/SingleProductPageComponents/SaveBtn";

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get how many of this product are already in the cart
  const { getQtyInCart } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSingleProduct(id);
        setProduct(data);
        setSelectedImage(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      >
        <Star strokeWidth={3} fill="currentColor" size={18} />
      </span>
    ));
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  if (!product) return null;

  const allImages = product.images || [product.thumbnail];

  // Stock remaining = original stock minus what's already in cart
  const qtyInCart = getQtyInCart(product.id);
  const stockRemaining = product.stock - qtyInCart;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-orange-500">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-500">
          Products
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-orange-500">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden h-80 md:h-96 mb-4">
            <img
              src={allImages[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>

          <h1
            className="mt-3 text-2xl md:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {product.title}
          </h1>

          {product.brand && (
            <p className="text-gray-400 text-sm mt-1">
              by{" "}
              <span className="text-gray-600 font-medium">{product.brand}</span>
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-600 text-sm font-medium">
              {product.rating} / 5
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-4xl font-bold text-orange-500">
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-full">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-4">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Stock box — shows reduced stock when item is in cart */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400">Stock</div>
              <div
                className={`font-semibold text-sm mt-1 ${
                  stockRemaining > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {stockRemaining > 0
                  ? `${stockRemaining} available`
                  : "Out of stock"}
              </div>
              {/* small note if item is in cart */}
              {qtyInCart > 0 && (
                <div className="text-xs text-orange-400 mt-0.5">
                  {qtyInCart} in your cart
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400">Warranty</div>
              <div className="font-semibold text-sm mt-1 text-gray-700">
                {product.warrantyInformation || "N/A"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400">Shipping</div>
              <div className="font-semibold text-sm mt-1 text-gray-700">
                {product.shippingInformation || "Standard"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400">Return Policy</div>
              <div className="font-semibold text-sm mt-1 text-gray-700">
                {product.returnPolicy || "N/A"}
              </div>
            </div>
          </div>

          {/* Add to cart & Save buttons */}
          <div className="flex gap-3 mt-6">
            <AddtoCartBtn product={product} />
            <SaveBtn product={product} />
          </div>

          {product.sku && (
            <p className="text-gray-400 text-xs mt-4">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      <CustomerReview product={product} />

      <div className="mt-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-700 font-bold text-lg hover:-translate-x-2 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={2} /> <span>Back to Products</span>
        </Link>
      </div>
    </div>
  );
}

export default SingleProduct;

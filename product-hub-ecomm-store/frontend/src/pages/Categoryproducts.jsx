import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../api/products";
import { Loading, ErrorMessage } from "../components/LoadingError";
import { ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";

function CategoryProducts() {
  const { slug } = useParams(); // get category slug from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products for this category
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(slug);
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]); // re-run when slug (category) changes

  // Format slug to readable name
  const formatName = (s) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-orange-500">
          Home
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-orange-500">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-700 capitalize">{formatName(slug)}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 capitalize"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {formatName(slug)}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {!loading && `${products.length} products found`}
        </p>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No products in this category.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-700 hover:underline font-bold text-lg hover:-translate-x-2 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={2} /> <span>Back to Categories</span>
        </Link>
      </div>
    </div>
  );
}

export default CategoryProducts;

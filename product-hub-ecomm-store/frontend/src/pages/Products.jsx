import { useEffect, useState } from "react";
import { getAllProducts, searchProducts } from "../api/products";
import { Loading, ErrorMessage, NoResults } from "../components/LoadingError";
import { ProductsSkeletonLoader } from "../components/SkeletonLoader";
import ProductSearchBar from "../components/SearchbarComponents/ProductSearchBar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/ProductsPageComponents/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const LIMIT = 12;

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Fetch products
  const fetchProducts = async (query = "", page = 0) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (query) {
        data = await searchProducts(query);
      } else {
        data = await getAllProducts(LIMIT, page * LIMIT);
      }

      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load products on page change
  useEffect(() => {
    fetchProducts(searchQuery, currentPage);
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(totalProducts / LIMIT);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          All <span className="text-orange-500">Products</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {searchQuery
            ? `Search results for "${searchQuery}" / ${totalProducts} found`
            : `Showing ${products.length} of ${totalProducts} products`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex items-center gap-4 flex-wrap">
        <ProductSearchBar
          onSearch={handleSearch}
          placeholder="Search products by name..."
        />
      </div>

      {/* Content */}
      {loading && <ProductsSkeletonLoader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && products.length === 0 && <NoResults />}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchQuery={searchQuery}
            setCurrentPage={setCurrentPage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";
import { Loading, ErrorMessage } from "../components/LoadingError";
import { Sparkle } from "lucide-react";
import { HomeSkeletonLoader } from "../components/SkeletonLoader";
import ProductCard from "../components/ProductCard";
import BrowseAllProductBtn from "../components/HomePageComponents/BrowseAllProductBtn";
import ShopbyCategoryBtn from "../components/HomePageComponents/ShopbyCategoryBtn";
import ViewAllLink from "../components/HomePageComponents/ViewAllLink";
import SeeAllProducts from "../components/HomePageComponents/SeeAllProducts";
import ThreeBackground from "../components/ThreeBackground";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    // Fetch products when the page loads
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts(20, 0); // get 20 products
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Main Section */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-orange-50 to-amber-50 py-16 px-4">
        <ThreeBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            New Arrivals 2026
          </span>
          <h1
            className="mt-4 text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Shop The Best
            <br />
            <span className="text-orange-500">Products Online</span>
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            Discover thousands of quality products across all categories,
            shipped fast and priced right.
          </p>
          <div className="mt-8 flex items-center gap-4 justify-center">
            <BrowseAllProductBtn />
            <ShopbyCategoryBtn />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-orange-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold">200+</div>
              <div className="text-orange-100 text-xs">Products</div>
            </div>
            <div>
              <div className="text-xl font-bold">20+</div>
              <div className="text-orange-100 text-xs">Categories</div>
            </div>
            <div>
              <div className="text-xl font-bold">Free</div>
              <div className="text-orange-100 text-xs">Shipping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Featured Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">Hand-picked for you</p>
          </div>
          <ViewAllLink />
        </div>

        {loading && <HomeSkeletonLoader />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Scrolling marquee of product titles */}
      {!loading && products.length > 0 && (
        <section className="bg-gray-900 py-4 overflow-hidden">
          <style>{`
            .marquee { --marquee-speed: 30s; }
            .marquee__inner { display: inline-flex; gap: 2rem; white-space: nowrap; animation: marquee var(--marquee-speed) linear infinite; }
            .marquee__inner:hover { animation-play-state: paused; }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          `}</style>

          <div className="max-w-7xl mx-auto px-4">
            <div className="marquee">
              <div className="marquee__inner" aria-hidden={false} role="list">
                {products.concat(products).map((product, i) => (
                  <span
                    key={i}
                    role="listitem"
                    className="text-gray-400 text-sm font-medium flex gap-1 items-center"
                  >
                    <Sparkle size={14} strokeWidth={1.75} fill="currentColor" />
                    <span className="ml-1">{product.title}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* More Products Section */}
      {!loading && !error && products.length > 8 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              More Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Keep exploring our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(8, 20).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <SeeAllProducts />
        </section>
      )}
    </div>
  );
}

export default Home;

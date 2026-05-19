import { Link } from "react-router-dom";
import { Home, ShoppingBag, HelpCircle, ArrowRight } from "lucide-react";

function NotFound404() {
  window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-bold bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-4 animate-bounce">
            404
          </div>
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for. It might have been
          moved or deleted.
        </p>

        <div className="mb-12 flex justify-center gap-8 text-gray-300">
          <div className="text-6xl animate-pulse">📦</div>
          <div className="text-6xl animate-pulse">❓</div>
          <div className="text-6xl animate-pulse">🛍️</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-2"
          >
            <Home size={20} />
            Go to Home
          </Link>

          <Link
            to="/products"
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-4 px-8 rounded-xl lg:bg-transparent lg:border-3 lg:border-orange-500 lg:text-orange-500 group"
          >
            {/* Animated background */}
            <span className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-in-out hidden lg:block"></span>

            <span className="relative z-10 flex items-center gap-2 lg:group-hover:text-white">
              <ShoppingBag size={20} />
              Continue Shopping
            </span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle size={20} className="text-orange-500" />
            <p className="text-gray-700 font-semibold">Need Help?</p>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            If you believe this is a mistake, please reach out to our support
            team
          </p>
          <Link
            to="/contact"
            className="text-orange-500 hover:text-orange-700 font-semibold text-sm flex gap-1 hover:translate-x-2 transition-all items-center justify-center"
          >
            Contact Us{" "}
            <span>
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-gray-400 text-sm mt-8">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  );
}

export default NotFound404;

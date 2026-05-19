import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                <span className="text-white font-bold text-sm">
                  <img
                    className="w-10 h-10 shrink-0"
                    src="https://media.licdn.com/dms/image/v2/D4E0BAQFq1CCkGzPR-w/company-logo_200_200/company-logo_200_200/0/1713840703024/product_hub_nyc_logo?e=2147483647&v=beta&t=hSAdtTSPN5ol9maUrYCrYLWfgfEvkPmHz90sKbUlKoI"
                    alt="Logo"
                    width="40"
                    height="40"
                    loading="eager"
                  />
                </span>
              </div>
              <span
                className="text-white text-xl font-bold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Product<span className="text-orange-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover amazing products at unbeatable prices. Quality you can
              trust, delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-400 transition-all hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-orange-400 transition-all hover:translate-x-1 inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-orange-400 transition-all hover:translate-x-1 inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-orange-400 transition-all hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-400 transition-all hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">About This App</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              ProductHub is a modern e-commerce web application where users can
              explore, search, and browse products across different categories.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2026 ProductHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

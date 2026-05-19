import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";
import DesktopNavLinks from "./NavbarComponents/DesktopNavLinks";
import MobileMenuLinks from "./NavbarComponents/MobileMenuLinks";
import MobileMenuBtn from "./NavbarComponents/MobileMenuBtn";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { savedItems, unreadNotificationCount } = useShop();

  // Note: "Saved" is no longer here - it moved to the user dropdown
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                <img
                  className="size-10 rounded-lg"
                  src="/src/assets/product_hub_logo.jpg"
                  alt="Logo"
                />
              </span>
            </div>
            <span
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Product<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <DesktopNavLinks navLinks={navLinks} isActive={isActive} />

          {/* Mobile Menu Button */}
          <MobileMenuBtn
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            savedItems={savedItems}
            unreadNotificationCount={unreadNotificationCount}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenuLinks
          navLinks={navLinks}
          isActive={isActive}
          savedItems={savedItems}
          unreadNotificationCount={unreadNotificationCount}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>
    </nav>
  );
}

export default Navbar;

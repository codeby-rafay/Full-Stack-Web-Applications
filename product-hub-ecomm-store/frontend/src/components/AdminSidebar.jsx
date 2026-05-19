import { useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import {
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Package,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useShop();

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Orders",
      path: "/admin/manage-orders",
      icon: Package,
    },
    {
      label: "Customer Feedback",
      path: "/admin/user-feedback",
      icon: FileText,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg z-40 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-md transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Admin <span className="text-orange-500">Panel</span>
            </h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-orange-50 border-r-4 border-orange-500 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar */}
          <div className="border-t border-gray-200">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 text-left text-white bg-red-500 hover:bg-red-700 font-semibold transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            <div className="p-4 text-xs text-gray-500 text-center">
              <p>Admin Portal v1.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;

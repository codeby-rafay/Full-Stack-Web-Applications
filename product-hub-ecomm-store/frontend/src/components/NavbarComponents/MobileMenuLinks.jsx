import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, Bell, Cuboid, UserPen } from "lucide-react";
import { useAuth, useSavedItems, useNotification } from "../../redux/hooks";
import { useAuthService } from "../../context/AuthServiceContext";
import { LogoutToast } from "../../utils/toastUtils";

const MobileMenuLinks = ({ navLinks, isActive, menuOpen, setMenuOpen }) => {
  const { logout } = useAuthService();
  const { currentUser } = useAuth();
  const { savedItems } = useSavedItems();
  const { unreadCount: unreadNotificationCount } = useNotification();
  const navigate = useNavigate();

  const hasSaved = savedItems.length > 0;
  const hasUnreadNotifications = unreadNotificationCount > 0;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    LogoutToast();
    navigate("/login");
  };

  return (
    <div>
      {menuOpen && (
        <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
          {/* Regular nav links (filter out "Saved" - it goes below) */}
          {navLinks
            .filter((link) => link.name !== "Saved")
            .map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive(link.path)
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

          {/* Auth section for mobile */}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {currentUser ? (
              <>
                {/* User info */}
                <div className="px-4 py-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>

                {/* Profile link */}
                <Link
                  to="/my-profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <UserPen
                    size={16}
                    className="text-orange-500"
                    fill="currentColor"
                  />
                  My Profile
                </Link>

                {/* Saved Items link */}
                <Link
                  to="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-1 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Heart size={16} fill="currentColor" />
                  Saved Items
                  {hasSaved && (
                    <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {savedItems.length}
                    </span>
                  )}
                </Link>

                {/* Notifications link */}
                <Link
                  to="/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-1 text-gray-700 hover:bg-orange-50 transition-colors"
                >
                  <Bell size={16} />
                  Notifications
                  {hasUnreadNotifications && (
                    <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                {/* My Orders link (mobile) */}
                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-1 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Cuboid size={16} className="text-orange-500" />
                  My Orders
                </Link>

                {/* Sign Out button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive("/login")
                    ? "bg-orange-500 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenuLinks;

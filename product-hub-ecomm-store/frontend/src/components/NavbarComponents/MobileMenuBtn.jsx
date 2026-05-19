const MobileMenuBtn = ({menuOpen, setMenuOpen, savedItems, unreadNotificationCount}) => {
  const hasSaved = savedItems && savedItems.length > 0;
  const hasUnreadNotifications = unreadNotificationCount > 0;
  
  return (
    <div>
      <button
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* Red dot - shows if user has saved items or unread notifications */}
            {(hasSaved || hasUnreadNotifications) && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default MobileMenuBtn;

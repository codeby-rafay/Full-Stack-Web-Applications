import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-999 backdrop-blur-2xl bg-linear-to-r from-slate-900/95 via-slate-900/92 to-slate-900/95 border-b-2 border-cyan-500/40 shadow-2xl shadow-purple-500/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 relative">
          {/* Logo - Left */}
          <Link
            to="/"
            className="text-3xl font-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
          >
            SnapShare
          </Link>

          {/* Navigation Links - Center */}
          <div className="flex gap-8">
            <Link
              to="/"
              className="px-8 py-3 rounded-xl font-bold text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/30 border-2 border-cyan-500/40 hover:border-cyan-300/80 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/40 flex items-center gap-2"
            >
              <span>Create</span>
            </Link>
            <Link
              to="/feed"
              className="px-8 py-3 rounded-xl font-bold text-pink-300 hover:text-pink-100 hover:bg-pink-500/30 border-2 border-pink-500/40 hover:border-pink-300/80 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-pink-500/40 flex items-center gap-2"
            >
              <span>Feed</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

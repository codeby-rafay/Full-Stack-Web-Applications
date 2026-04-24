import React from "react";
import { Routes, Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen bg-linear-to-br overflow-hidden from-slate-950 via-purple-950 to-slate-900">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10 pt-20">
        <Routes>
          <Route path="/" element={<CreatePost />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCaption = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      setError("Caption cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axios.patch(`http://localhost:3000/posts/${postId}`, {
        caption: caption,
      });

      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update caption");
      console.error("Error updating caption:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
      {/* Header */}
      <div className="text-center mb-16 mt-10">
        <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-3 animate-pulse">
          Update Caption
        </h1>
        <p className="text-purple-300/70 text-lg">Edit your post's caption</p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        {/* Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50"></div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-linear-to-br from-slate-900/80 to-slate-800/50 border border-purple-500/40 rounded-3xl p-8 shadow-2xl">
          {/* Top Gradient Border */}
          <div className="h-1 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-8 opacity-75"></div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 backdrop-blur-xl bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Caption Input */}
            <div>
              <label className="block text-cyan-300 font-bold mb-3 text-sm uppercase tracking-wider">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an amazing caption for your post..."
                maxLength={500}
                rows={8}
                className="w-full px-4 py-3 bg-slate-800/60 border border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
              />
              <div className="mt-2 text-xs text-purple-300/50">
                {caption.length}/500 characters
              </div>
            </div>

            {/* Button Group */}
            <div className="flex gap-4 pt-6 border-t border-purple-500/30">
              <button
                type="button"
                onClick={() => navigate("/feed")}
                className="flex-1 px-6 py-3 bg-linear-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/50 text-slate-300 rounded-xl text-sm font-bold hover:from-slate-600/70 hover:to-slate-500/70 hover:border-slate-400/70 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-linear-to-r from-cyan-500/80 to-pink-500/80 border border-cyan-400/60 text-white rounded-xl text-sm font-bold hover:from-cyan-500 hover:to-pink-500 hover:border-cyan-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Caption"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCaption;

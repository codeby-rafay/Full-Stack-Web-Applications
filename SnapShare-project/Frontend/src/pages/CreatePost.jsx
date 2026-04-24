import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    try {
      const res = await axios.post(
        "http://localhost:3000/post-create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-20 mt-8">
          <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-6 animate-pulse">
            Create Post
          </h1>
          <p className="text-cyan-200/70 text-xl">
            Share your creative moments with the world
          </p>
        </div>

        {/* Main Form Card */}
        <div className="backdrop-blur-3xl bg-linear-to-br from-slate-900/70 via-slate-800/50 to-slate-900/40 border-2 border-purple-500/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative Top Border */}
          <div className="h-2 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

          {/* Form Content with Extra Padding */}
          <div className="p-16 md:p-20">
            {error && (
              <div className="mb-12 p-8 backdrop-blur-sm bg-linear-to-r from-red-500/30 to-red-600/30 border-2 border-red-500/60 rounded-3xl text-red-200 flex items-start gap-5 animate-pulse">
                <span className="text-4xl shrink-0">⚠️</span>
                <span className="font-semibold text-lg pt-1">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-14">
              {/* Image Upload Section */}
              <div>
                <label className="flex items-center gap-4 text-base font-black text-cyan-300 mb-7 uppercase tracking-widest">
                  <span>Upload Image</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-10 py-8 border-3 border-dashed border-cyan-500/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-800/70 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/80 hover:bg-slate-800/90 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-linear-to-r file:from-cyan-500 file:to-cyan-600 file:text-white hover:file:from-cyan-400 hover:file:to-cyan-500 cursor-pointer text-lg"
                    required
                  />
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <p className="mt-4 text-cyan-300/50 text-sm">
                  Supported formats: JPG, PNG, GIF (Max 10MB)
                </p>
              </div>

              {/* Divider */}
              <div className="h-0.5 bg-linear-to-r from-purple-500/30 via-purple-500/50 to-purple-500/30 rounded-full"></div>

              {/* Caption Input Section */}
              <div>
                <label className="flex items-center gap-4 text-base font-black text-pink-300 mb-7 uppercase tracking-widest">
                  <span>Caption</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="caption"
                    placeholder="What's on your mind? Make it interesting!"
                    className="w-full px-10 py-8 border-3 border-pink-500/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-slate-800/70 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-pink-400/80 hover:bg-slate-800/90 text-lg"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <p className="mt-4 text-pink-300/50 text-sm">
                  Make your caption engaging and creative!
                </p>
              </div>

              {/* Divider */}
              <div className="h-0.5 bg-linear-to-r from-purple-500/30 via-purple-500/50 to-purple-500/30 rounded-full"></div>

              {/* Submit Button Section */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-6 px-8 rounded-3xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:shadow-purple-500/60 transform hover:scale-105 text-xl uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-7 w-7 border-4 border-white border-t-transparent"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Post</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Text */}
              <p className="text-center text-cyan-300/60 text-base pt-2 leading-relaxed">
                Upload an image and share your thoughts. Your post will appear
                instantly in the feed!
              </p>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-lg">
            Want to see other posts?
            <a
              href="/feed"
              className="ml-3 text-cyan-400 hover:text-cyan-300 font-bold transition-colors hover:underline"
            >
              View Feed →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      _id: "1",
      image: "https://ik.imagekit.io/197eearpn/image_FsF1FyP0R.jpg",
      caption: "Caption for image 1",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/posts")
      .then((res) => {
        setPosts(res.data.posts);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load posts");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="text-center mb-16 mt-20">
        <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-3 animate-pulse">
          Your Feed
        </h1>
        <p className="text-purple-300/70 text-lg">Discover amazing moments</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
              <div
                className="absolute inset-0 bg-linear-to-r from-cyan-400 to-pink-400 rounded-full animate-spin"
                style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%)" }}
              ></div>
            </div>
            <p className="text-cyan-300 font-bold text-lg">Loading posts...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-6 backdrop-blur-xl bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
          {posts.map((post) => (
            <div key={post._id} className="group relative">
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:duration-200"></div>

              {/* Main Card */}
              <div className="relative backdrop-blur-xl bg-linear-to-br from-slate-900/70 to-slate-800/50 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl hover:border-purple-400/70 transition-all duration-500 h-full flex flex-col">
                {/* Top Gradient Border */}
                <div className="h-1 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Image Container */}
                <div className="relative h-72 overflow-hidden bg-linear-to-br from-cyan-500/20 to-pink-500/20">
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  {/* Caption */}
                  <div>
                    <p className="text-white/90 font-semibold text-base line-clamp-3 group-hover:text-cyan-100 transition-colors duration-300 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-purple-500/30 flex justify-between items-center group-hover:border-purple-400/50 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        👤
                      </div>
                      <span className="text-xs text-cyan-300/70 group-hover:text-cyan-300 transition-colors">
                        {post._id.slice(0, 6)}
                      </span>
                    </div>
                    <div className="flex gap-2"> 
                      <button className="px-4 py-2 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/50 text-cyan-300 hover:text-cyan-100 rounded-xl text-xs font-bold hover:from-cyan-500/40 hover:to-pink-500/40 hover:border-cyan-300/80 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30">
                        Edit
                      </button>
                      <button className="px-4 py-2 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/50 text-cyan-300 hover:text-cyan-100 rounded-xl text-xs font-bold hover:from-cyan-500/40 hover:to-pink-500/40 hover:border-cyan-300/80 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-cyan-300/70 text-lg">
            No posts yet. Be the first to share!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;

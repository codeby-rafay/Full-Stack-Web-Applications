export default function Library() {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center mt-8">
      <div className="max-w-md text-center">

        {/* Heading */}
        <h1 className="text-4xl font-black mb-4 bg-linear-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
          Your Library
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-2">
          Build your personal collection of favorite tracks
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Save songs to your library and they'll appear right here. Your taste, your way.
        </p>

        {/* Features */}
        <div className="bg-linear-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6 mb-8">
          <div className="space-y-4 text-left">
            <div className="flex gap-3 items-start">
              <span className="text-xl">❤️</span>
              <div>
                <p className="font-semibold text-green-300">Like your favorites</p>
                <p className="text-xs text-gray-400">Quickly save tracks you love</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-semibold text-green-300">Personalized discovery</p>
                <p className="text-xs text-gray-400">Get recommendations based on your taste</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">🎵</span>
              <div>
                <p className="font-semibold text-green-300">Create playlists</p>
                <p className="text-xs text-gray-400">Organize and share your collections</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="px-8 py-3 cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/50 hover:shadow-xl">
          Explore Now
        </button>
      </div>
    </div>
  );
}

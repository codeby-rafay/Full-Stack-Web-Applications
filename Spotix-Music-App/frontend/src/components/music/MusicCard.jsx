import { randomEmoji } from "../../lib/utils";

export default function MusicCard({ music, onPlay, active }) {
  return (
    <div
      onClick={() => onPlay(music)}
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        active
          ? "bg-linear-to-br from-green-600 to-emerald-600 shadow-xl shadow-green-700/50"
          : "bg-linear-to-br from-gray-800 to-gray-900 hover:from-green-900/50 hover:to-emerald-900/50 border border-green-500/20 hover:border-green-500/40"
      }`}
    >
      {/* Card Content */}
      <div className="aspect-square flex flex-col items-center justify-center p-4 relative">
        {/* Background gradient */}
        <div className={`absolute inset-0 ${active ? "" : "bg-linear-to-br from-green-600/20 to-emerald-600/20"}`}></div>

        {/* Icon */}
        <div className="relative z-10 text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {randomEmoji(["🎵", "🎶", "🎸", "🎹"], music._id)}
        </div>

        {/* Play Button */}
        <button
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center cursor-pointer justify-center text-xl transition-all duration-300 ${
            active
              ? "bg-white text-green-600 shadow-lg opacity-100"
              : "bg-linear-to-r from-green-600 to-emerald-600 text-white opacity-0 group-hover:opacity-100 shadow-lg shadow-green-700/50 hover:shadow-xl"
          }`}
        >
          {active ? "⏸" : "▶"}
        </button>
      </div>

      {/* Info Section */}
      <div className={`p-4 relative z-10 ${active ? "bg-black/20" : "bg-linear-to-t from-gray-950 to-transparent"}`}>
        <div className={`font-bold text-sm line-clamp-2 ${active ? "text-white" : "text-gray-200 group-hover:text-green-300"}`}>
          {music.title}
        </div>
        <div className={`text-xs line-clamp-1 mt-1 ${active ? "text-white/70" : "text-gray-400 group-hover:text-green-200/70"}`}>
          {music.artist?.username}
        </div>
      </div>

      {/* Active indicator */}
      {active && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
      )}
    </div>
  );
}

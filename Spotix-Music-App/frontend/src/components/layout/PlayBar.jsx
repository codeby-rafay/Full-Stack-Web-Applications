import { formatTime } from "../../lib/utils";

export default function PlayerBar({
  currentTrack,
  isPlaying = false,
  onToggle = () => {},
  progress = { current: 0, percent: 0, duration: 0 },
  onSeek = () => {},
  volume = 0.7,
  onVolume = () => {},
}) {
  return (
    <div className="relative z-20 px-6 py-4 bg-linear-to-r from-black/90 via-gray-950/90 to-black/90 backdrop-blur-md border-t border-green-500/20 shadow-2xl shadow-green-500/20">
      {/* Progress Bar */}
      <div className="mb-4 group cursor-pointer" onClick={onSeek}>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span className="font-mono">{formatTime(progress.current)}</span>
          <div className="flex-1 h-1.5 bg-linear-to-r from-gray-700 to-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-500 via-emerald-500 to-green-500 rounded-full transition-all duration-200 shadow-lg shadow-green-500/50 group-hover:shadow-xl"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="font-mono">{formatTime(progress.duration)}</span>
        </div>
      </div>

      {/* Main Player */}
      <div className="flex items-center justify-between gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <div className="w-16 h-16 bg-linear-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-3xl shadow-lg shadow-green-500/50 shrink-0">
              {currentTrack ? "🎵" : "🎧"}
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-lg animate-pulse border-2 border-purple-400/30"></div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">
              {currentTrack?.title || "Select a track"}
            </div>
            <div className="text-xs text-purple-300/70 truncate">
              {currentTrack?.artist?.username || "Unknown Artist"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-slate-800/50 rounded-full cursor-pointer transition-all duration-300 text-gray-400 hover:text-gray-200"
            title="Previous"
          >
            <span className="text-xl">⏮</span>
          </button>

          <button
            onClick={onToggle}
            className="w-14 h-14 rounded-full cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/70 transition-all duration-300 transform hover:scale-110"
          >
            <span className="text-2xl">{isPlaying ? "⏸" : "▶"}</span>
          </button>

          <button
            className="p-2 hover:bg-slate-800/50 rounded-full cursor-pointer transition-all duration-300 text-gray-400 hover:text-gray-200"
            title="Next"
          >
            <span className="text-xl">⏭</span>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-xl">🔊</span>
          <div
            className="group cursor-pointer w-24 h-1.5 bg-linear-to-r from-gray-700 to-gray-600 rounded-full overflow-hidden"
            onClick={onVolume}
          >
            <div
              className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-200 shadow-lg shadow-green-500/50 group-hover:shadow-xl"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

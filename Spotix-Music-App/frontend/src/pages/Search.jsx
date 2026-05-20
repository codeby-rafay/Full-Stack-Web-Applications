import { useState } from "react";
import { mockMusics } from "../data/mockData";

export default function Search({ onPlay }) {
  const [q, setQ] = useState("");

  const filtered = mockMusics.filter((m) =>
    m.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-4 bg-linear-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
            Discover Music
          </h1>
          <p className="text-gray-400">Search millions of songs</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-2xl text-green-400">🔍</span>
          </div>
          <input
            className="w-full pl-14 pr-4 py-4 rounded-full bg-linear-to-r from-gray-800 to-gray-900 text-white outline-none border border-green-500/30 focus:border-green-500/60 transition-all duration-300 placeholder-gray-500 focus:ring-2 focus:ring-green-500/20 text-lg"
            placeholder="Search songs, artists, or albums..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Results */}
        <div>
          {q && (
            <p className="text-sm text-gray-400 mb-4">
              Found <span className="text-green-400 font-semibold">{filtered.length}</span> results
            </p>
          )}
          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((m, idx) => (
                <div
                  key={m._id}
                  onClick={() => onPlay(m)}
                  className="group p-4 bg-linear-to-r from-gray-800/50 to-gray-900/50 hover:from-green-900/30 hover:to-emerald-900/30 rounded-lg cursor-pointer hover:border hover:border-green-500/30 transition-all duration-300 transform hover:translate-x-1 flex items-center gap-4"
                >
                  <span className="text-2xl text-gray-500 group-hover:text-green-400 transition shrink-0 w-8 text-center">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-green-300 truncate transition">
                      {m.title}
                    </p>
                    <p className="text-sm text-gray-400 group-hover:text-green-200/70 truncate transition">
                      {m.artist?.username}
                    </p>
                  </div>
                  <button className="shrink-0 w-10 h-10 rounded-full bg-linear-to-r from-green-600 to-emerald-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg shadow-green-500/50">
                    ▶
                  </button>
                </div>
              ))
            ) : q ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-400 mb-2">😅 No results found</p>
                <p className="text-gray-500">Try searching for a different song or artist</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-400 mb-2">🎵 Start searching</p>
                <p className="text-gray-500">Enter a song or artist name to discover music</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

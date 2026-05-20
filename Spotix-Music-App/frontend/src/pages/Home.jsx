import { mockMusics, mockAlbums } from "../data/mockData";
import MusicCard from "../components/music/MusicCard";

export default function Home({ musics = mockMusics, onPlay, currentTrack }) {
  return (
    <div className="p-8 h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-2 bg-linear-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
            Welcome to Spotix
          </h1>
          <p className="text-gray-400 text-lg">Discover your next favorite track</p>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {musics.slice(0, 4).map((m) => (
              <div key={m._id}>
                <MusicCard
                  music={m}
                  onPlay={onPlay}
                  active={currentTrack?._id === m._id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* More Tracks */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recently Added</h2>
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {musics.slice(4, 8).map((m) => (
              <div key={m._id}>
                <MusicCard
                  music={m}
                  onPlay={onPlay}
                  active={currentTrack?._id === m._id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Albums */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">💿 Featured Albums</h2>
            <a href="#" className="text-sm text-green-400 hover:text-green-300 transition">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAlbums.map((a) => (
              <div
                key={a._id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 hover:from-green-900/50 hover:to-emerald-900/50 p-6 transition-all duration-300 border border-green-500/20 hover:border-green-500/40 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">💿</div>
                  <div className="font-bold text-lg text-white mb-1 group-hover:text-green-300 transition">
                    {a.title}
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-green-200/70 transition">
                    {a.artist.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

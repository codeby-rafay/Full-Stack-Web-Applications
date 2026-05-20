import { useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import PlayBar from "./components/layout/PlayBar";

export default function App() {
  const [page, setPage] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    percent: 0,
    duration: 180,
  });
  const [volume, setVolume] = useState(0.7);

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setProgress((prev) => ({
      ...prev,
      current: percent * prev.duration,
      percent: percent * 100,
    }));
    // seek audio element if available
    if (audioRef.current) {
      const newTime = percent * progress.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(vol);
  };

  // audio element and sync
  const audioRef = useRef(null);

  // when currentTrack or isPlaying changes, load/play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack && currentTrack.uri) {
      if (audioRef.current.src !== currentTrack.uri) {
        audioRef.current.src = currentTrack.uri;
      }
    }
    audioRef.current.volume = volume;
    if (isPlaying) {
      audioRef.current
        .play()
        .catch(() => {
          // autoplay may be blocked by browser; keep UI consistent
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  // update volume on change
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // timeupdate -> progress
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      const duration = a.duration || progress.duration || 0;
      const current = a.currentTime || 0;
      const percent = duration ? (current / duration) * 100 : 0;
      setProgress({ current, percent, duration: duration || progress.duration });
    };
    const onLoaded = () => {
      const duration = a.duration || progress.duration || 0;
      setProgress((p) => ({ ...p, duration }));
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [audioRef.current]);

  const navItems = [
    { id: "home", label: "Home", icon: "" },
    { id: "search", label: "Discover", icon: "" },
    { id: "library", label: "Library", icon: "" },
  ];

  return (
    <div className="flex h-screen bg-linear-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-green-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-emerald-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Sidebar */}
      <div className="relative z-10 w-72 bg-linear-to-b from-gray-900/80 to-black/80 backdrop-blur-md border-r border-green-500/20 flex flex-col p-6 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black bg-linear-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
            Spotix
          </h1>
          <p className="text-xs text-green-300/60 mt-1">Music redefined</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                page === item.id
                  ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-green-500/20 mt-auto">
          <div className="bg-linear-to-r from-green-600/10 to-emerald-600/10 rounded-lg p-4 text-center">
            <p className="text-xs text-green-200">Now Playing</p>
            <p className="text-sm font-semibold mt-1">{currentTrack?.title || "Your Vibe"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 overflow-auto">
          {page === "home" && <Home onPlay={handlePlay} currentTrack={currentTrack} />}
          {page === "search" && <Search onPlay={handlePlay} />}
          {page === "library" && <Library />}
        </div>

        <PlayBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onToggle={handleToggle}
          progress={progress}
          onSeek={handleSeek}
          volume={volume}
          onVolume={handleVolume}
        />
        {/* hidden audio element used for playback */}
        <audio ref={audioRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

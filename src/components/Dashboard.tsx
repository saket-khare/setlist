import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const songs = useQuery(api.songs.list, {});
  const setlists = useQuery(api.setlists.list);
  const recentSongs = useQuery(api.songs.list, {})?.slice(0, 5);

  if (songs === undefined || setlists === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // [AI] Calculate stats for dashboard
  const totalSongs = songs.length;
  const totalSetlists = setlists.length;
  const uniqueSingers = new Set(
    songs.map((song) => song.singer).filter(Boolean)
  ).size;
  const songsWithShayari = songs.filter((song) => song.hasShayari).length;

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* [AI] Welcome header with gradient - Fixed contrast */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-sunset p-6 text-white shadow-card">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-sm">
            Welcome back! 🎵
          </h1>
          <p className="text-white/95 text-sm drop-shadow-sm">
            Ready to create some amazing setlists?
          </p>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* [AI] Stats grid with Apple-like cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-lg">🎵</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
                {totalSongs}
              </p>
              <p className="text-sm text-neutral-600 dark:text-dark-500">
                Songs
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <span className="text-secondary-600 text-lg">📋</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
                {totalSetlists}
              </p>
              <p className="text-sm text-neutral-600 dark:text-dark-500">
                Setlists
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <span className="text-accent-600 text-lg">🎤</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
                {uniqueSingers}
              </p>
              <p className="text-sm text-neutral-600 dark:text-dark-500">
                Artists
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-lg">✨</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
                {songsWithShayari}
              </p>
              <p className="text-sm text-neutral-600 dark:text-dark-500">
                Shayari
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* [AI] Recent songs section */}
      {recentSongs && recentSongs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-700">
              Recent Songs
            </h2>
            <button className="text-primary-600 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentSongs.map((song) => (
              <div key={song._id} className="card-interactive p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 dark:text-dark-700 truncate">
                      {song.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {song.singer && (
                        <span className="text-sm text-neutral-600 dark:text-dark-500 truncate">
                          {song.singer}
                        </span>
                      )}
                      {song.movie && (
                        <span className="text-xs text-neutral-500 dark:text-dark-400 truncate">
                          • {song.movie}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {song.scale && (
                      <span className="tag-primary">{song.scale}</span>
                    )}
                    {song.hasShayari && <span className="tag-accent">✨</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* [AI] Quick actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-700">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <button className="card-interactive p-4 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-card">
                <span className="text-white text-xl drop-shadow-sm">🎵</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-dark-700">
                  Add New Song
                </h3>
                <p className="text-sm text-neutral-600 dark:text-dark-500">
                  Expand your music library
                </p>
              </div>
            </div>
          </button>

          <button className="card-interactive p-4 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center shadow-card">
                <span className="text-white text-xl drop-shadow-sm">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-dark-700">
                  Create Setlist
                </h3>
                <p className="text-sm text-neutral-600 dark:text-dark-500">
                  Organize songs for your next session
                </p>
              </div>
            </div>
          </button>

          <button className="card-interactive p-4 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-card">
                <span className="text-white text-xl drop-shadow-sm">🔍</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-dark-700">
                  Browse Library
                </h3>
                <p className="text-sm text-neutral-600 dark:text-dark-500">
                  Explore your song collection
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { SongCard } from "./SongCard";
import { SongFilters } from "./SongFilters";
import { SongDetail } from "./SongDetail";
import { Id } from "../../convex/_generated/dataModel";

export function SongLibrary() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSinger, setSelectedSinger] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<Id<"songs"> | null>(
    null
  );

  // [AI] Proper debouncing implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const songs = useQuery(api.songs.list, {
    search: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    singer: selectedSinger || undefined,
    movie: selectedMovie || undefined,
    scale: selectedScale || undefined,
    era: selectedEra || undefined,
  });

  const filterOptions = useQuery(api.songs.getFilterOptions);
  const removeSong = useMutation(api.songs.remove);

  const handleDeleteSong = async (songId: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      try {
        await removeSong({ id: songId as any });
        toast.success("Song deleted successfully");
      } catch (error) {
        toast.error("Failed to delete song");
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedTags([]);
    setSelectedSinger("");
    setSelectedMovie("");
    setSelectedScale("");
    setSelectedEra("");
  };

  // [AI] If a song is selected, show the detail view
  if (selectedSongId) {
    return (
      <SongDetail
        songId={selectedSongId}
        onBack={() => setSelectedSongId(null)}
      />
    );
  }

  if (songs === undefined || filterOptions === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* [AI] Header with Apple-like styling */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
            Song Library
          </h2>
          <p className="text-sm text-neutral-600 dark:text-dark-500 mt-1">
            {songs.length} song{songs.length !== 1 ? "s" : ""} in your
            collection
          </p>
        </div>
      </div>

      {/* [AI] Search with fixed icon alignment */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search songs, singers, movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
        {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div> */}
      </div>

      {/* [AI] Filters */}
      <SongFilters
        filterOptions={filterOptions}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedSinger={selectedSinger}
        setSelectedSinger={setSelectedSinger}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        selectedEra={selectedEra}
        setSelectedEra={setSelectedEra}
        onClearFilters={clearFilters}
      />

      {/* [AI] Songs List */}
      {songs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-dark-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-neutral-400 dark:text-dark-400 text-3xl">
              🎵
            </span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700 mb-2">
            {search ||
            selectedTags.length > 0 ||
            selectedSinger ||
            selectedMovie ||
            selectedScale ||
            selectedEra
              ? "No songs match your filters"
              : "No songs yet"}
          </h3>
          {!search &&
            selectedTags.length === 0 &&
            !selectedSinger &&
            !selectedMovie &&
            !selectedScale &&
            !selectedEra && (
              <p className="text-neutral-600 dark:text-dark-500">
                Tap the + button to add your first song
              </p>
            )}
        </div>
      ) : (
        <div className="space-y-4">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              onDelete={() => void handleDeleteSong(song._id)}
              onView={() => setSelectedSongId(song._id as Id<"songs">)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

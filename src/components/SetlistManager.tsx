import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { SetlistCard } from "./SetlistCard";
import { CreateSetlistForm } from "./CreateSetlistForm";
import { SongDetail } from "./SongDetail";
import { Id } from "../../convex/_generated/dataModel";

export function SetlistManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSetlist, setSelectedSetlist] = useState<string | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<Id<"songs"> | null>(
    null
  );

  const setlists = useQuery(api.setlists.list);
  const selectedSetlistData = useQuery(
    api.setlists.get,
    selectedSetlist ? { id: selectedSetlist as any } : "skip"
  );
  const removeSetlist = useMutation(api.setlists.remove);
  const generateShareToken = useMutation(api.setlists.generateShareToken);

  const handleDeleteSetlist = async (setlistId: string) => {
    if (confirm("Are you sure you want to delete this setlist?")) {
      try {
        await removeSetlist({ id: setlistId as any });
        toast.success("Setlist deleted successfully");
        if (selectedSetlist === setlistId) {
          setSelectedSetlist(null);
        }
      } catch (error) {
        toast.error("Failed to delete setlist");
      }
    }
  };

  const handleShareSetlist = async (setlistId: string) => {
    try {
      const shareToken = await generateShareToken({ id: setlistId as any });
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;

      if (navigator.share) {
        await navigator.share({
          title: "Check out this setlist",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to generate share link");
    }
  };

  if (setlists === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (selectedSongId) {
    return (
      <SongDetail
        songId={selectedSongId}
        onBack={() => setSelectedSongId(null)}
      />
    );
  }

  if (selectedSetlist && selectedSetlistData) {
    const validSongs = selectedSetlistData.songs.filter(Boolean);

    return (
      <div className="px-4 py-6 pb-24 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSetlist(null)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
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
              <polyline points="15,18 9,12 15,6" />
            </svg>
            <span>Back to setlists</span>
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-700 mb-2">
                {selectedSetlistData.name}
              </h2>
              {selectedSetlistData.description && (
                <p className="text-neutral-600 dark:text-dark-500 mb-3">
                  {selectedSetlistData.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1 text-neutral-600 dark:text-dark-500">
                  <span>🎵</span>
                  <span>
                    {validSongs.length} song{validSongs.length !== 1 ? "s" : ""}
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-neutral-600 dark:text-dark-500">
                  <span>⏱️</span>
                  <span>~{Math.ceil(validSongs.length * 3.5)} min</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => void handleShareSetlist(selectedSetlist)}
              className="btn-secondary py-2 px-4 text-sm"
            >
              Share 📤
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {validSongs.map((song, index) => (
            <div
              key={song._id}
              className="card-interactive p-4 cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => setSelectedSongId(song._id as Id<"songs">)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-dark-700 truncate">
                    {song.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {song.singer && (
                      <span className="text-sm text-neutral-600 dark:text-dark-500 truncate">
                        🎤 {song.singer}
                      </span>
                    )}
                    {song.movie && (
                      <span className="text-xs text-neutral-500 dark:text-dark-400 truncate">
                        • {song.movie}
                      </span>
                    )}
                  </div>
                  {song.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {song.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="tag bg-neutral-100 text-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {song.tags.length > 3 && (
                        <span className="tag bg-neutral-100 text-neutral-500">
                          +{song.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {song.scale && (
                    <span className="tag-primary">{song.scale}</span>
                  )}
                  {song.hasShayari && <span className="tag-accent">✨</span>}
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 text-xs">👁️</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {validSongs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-dark-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-neutral-400 dark:text-dark-400 text-3xl">
                📋
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700 mb-2">
              Empty Setlist
            </h3>
            <p className="text-neutral-600 dark:text-dark-500">
              Add songs to this setlist to get started
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-700">
            My Setlists
          </h2>
          <p className="text-sm text-neutral-600 dark:text-dark-500 mt-1">
            {setlists.length} setlist{setlists.length !== 1 ? "s" : ""} ready
            for your sessions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary py-2 px-4 text-sm"
        >
          Create 📋
        </button>
      </div>

      {showCreateForm && (
        <div className="card p-6 animate-scale-in">
          <CreateSetlistForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {setlists.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-dark-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-neutral-400 dark:text-dark-400 text-3xl">
              📋
            </span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700 mb-2">
            No setlists yet
          </h3>
          <p className="text-neutral-600 dark:text-dark-500 mb-4">
            Create your first setlist to organize songs for your jam sessions
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Your First Setlist 🎵
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {setlists.map((setlist) => (
            <SetlistCard
              key={setlist._id}
              setlist={setlist}
              onView={() => setSelectedSetlist(setlist._id)}
              onDelete={() => void handleDeleteSetlist(setlist._id)}
              onShare={() => void handleShareSetlist(setlist._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

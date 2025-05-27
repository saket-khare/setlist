import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface SongDetailProps {
  songId: Id<"songs">;
  onBack: () => void;
}

export function SongDetail({ songId, onBack }: SongDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "lyrics" | "chords" | "notes"
  >("overview");

  const song = useQuery(api.songs.get, { id: songId });
  const updateSong = useMutation(api.songs.update);

  const [editForm, setEditForm] = useState({
    lyrics: "",
    chords: "",
    notes: "",
    lyricsWithChords: "",
  });

  // [AI] Initialize edit form when song loads
  if (song && !isEditing && editForm.lyrics === "") {
    setEditForm({
      lyrics: song.lyrics || "",
      chords: song.chords || "",
      notes: song.notes || "",
      lyricsWithChords: song.lyricsWithChords || "",
    });
  }

  const handleSave = async () => {
    if (!song) return;

    try {
      await updateSong({
        id: songId,
        title: song.title,
        singer: song.singer,
        movie: song.movie,
        scale: song.scale,
        era: song.era,
        actor: song.actor,
        hasShayari: song.hasShayari,
        tags: song.tags,
        lyrics: editForm.lyrics || undefined,
        chords: editForm.chords || undefined,
        notes: editForm.notes || undefined,
        lyricsWithChords: editForm.lyricsWithChords || undefined,
      });

      setIsEditing(false);
      toast.success("Song updated successfully!");
    } catch (error) {
      toast.error("Failed to update song");
    }
  };

  if (!song) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "lyrics", label: "Lyrics", icon: "🎤" },
    { id: "chords", label: "Chords", icon: "🎸" },
    { id: "notes", label: "Notes", icon: "📝" },
  ] as const;

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* [AI] Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
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
          <span>Back to Library</span>
        </button>

        <button
          onClick={() => {
            if (isEditing) {
              void handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={
            isEditing
              ? "btn-primary py-2 px-4 text-sm"
              : "btn-secondary py-2 px-4 text-sm"
          }
        >
          {isEditing ? "Save Changes" : "Edit Song"}
        </button>
      </div>

      {/* [AI] Song header card */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center shadow-card">
            <span className="text-white text-2xl">🎵</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-700 mb-2">
              {song.title}
            </h1>
            <div className="space-y-1">
              {song.singer && (
                <p className="text-neutral-600 dark:text-dark-500 flex items-center">
                  <span className="mr-2">🎤</span>
                  {song.singer}
                </p>
              )}
              {song.movie && (
                <p className="text-neutral-600 dark:text-dark-500 flex items-center">
                  <span className="mr-2">🎬</span>
                  {song.movie}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-3">
                {song.scale && (
                  <span className="tag-primary">{song.scale}</span>
                )}
                {song.era && (
                  <span className="tag bg-neutral-100 text-neutral-700">
                    {song.era}
                  </span>
                )}
                {song.hasShayari && (
                  <span className="tag-accent">✨ Shayari</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {song.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-dark-300">
            <div className="flex flex-wrap gap-2">
              {song.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag bg-neutral-100 text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* [AI] Tab navigation */}
      <div className="card p-1 max-w-full">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-1 px-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-card"
                  : "text-neutral-600 hover:bg-neutral-100 dark:hover:bg-dark-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* [AI] Tab content */}
      <div className="card p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700">
              Song Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                    Title
                  </label>
                  <p className="text-neutral-900 dark:text-dark-700">
                    {song.title}
                  </p>
                </div>
                {song.singer && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                      Singer
                    </label>
                    <p className="text-neutral-900 dark:text-dark-700">
                      {song.singer}
                    </p>
                  </div>
                )}
                {song.movie && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                      Movie/Album
                    </label>
                    <p className="text-neutral-900 dark:text-dark-700">
                      {song.movie}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {song.scale && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                      Scale
                    </label>
                    <p className="text-neutral-900 dark:text-dark-700">
                      {song.scale}
                    </p>
                  </div>
                )}
                {song.era && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                      Era
                    </label>
                    <p className="text-neutral-900 dark:text-dark-700">
                      {song.era}
                    </p>
                  </div>
                )}
                {song.actor && (
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-dark-500">
                      Actor
                    </label>
                    <p className="text-neutral-900 dark:text-dark-700">
                      {song.actor}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "lyrics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700">
                Lyrics
              </h3>
              {!isEditing && !song.lyrics && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-600 text-sm font-medium"
                >
                  Add Lyrics
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editForm.lyrics}
                onChange={(e) =>
                  setEditForm({ ...editForm, lyrics: e.target.value })
                }
                placeholder="Paste or type the song lyrics here..."
                className="input-field min-h-[300px] font-mono text-sm"
              />
            ) : song.lyrics ? (
              <div className="bg-neutral-50 dark:bg-dark-100 rounded-xl p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-800 dark:text-dark-600">
                  {song.lyrics}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-neutral-400 text-4xl mb-4 block">🎤</span>
                <p className="text-neutral-600 dark:text-dark-500">
                  No lyrics added yet
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "chords" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700">
                Chords
              </h3>
              {!isEditing && !song.chords && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-600 text-sm font-medium"
                >
                  Add Chords
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editForm.chords}
                  onChange={(e) =>
                    setEditForm({ ...editForm, chords: e.target.value })
                  }
                  placeholder="Add chord progressions, chord charts, or chord sequences..."
                  className="input-field min-h-[200px] font-mono text-sm"
                />
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
                    Lyrics with Chords (Combined)
                  </label>
                  <textarea
                    value={editForm.lyricsWithChords}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        lyricsWithChords: e.target.value,
                      })
                    }
                    placeholder="Paste lyrics with chords formatted together (e.g., from Ultimate Guitar)..."
                    className="input-field min-h-[300px] font-mono text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    You can paste formatted text from sites like Ultimate Guitar
                    that have chords above lyrics
                  </p>
                </div>
              </div>
            ) : song.chords || song.lyricsWithChords ? (
              <div className="space-y-6">
                {song.chords && (
                  <div>
                    <h4 className="font-medium text-neutral-800 dark:text-dark-600 mb-2">
                      Chord Progressions
                    </h4>
                    <div className="bg-neutral-50 dark:bg-dark-100 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-800 dark:text-dark-600">
                        {song.chords}
                      </pre>
                    </div>
                  </div>
                )}
                {song.lyricsWithChords && (
                  <div>
                    <h4 className="font-medium text-neutral-800 dark:text-dark-600 mb-2">
                      Lyrics with Chords
                    </h4>
                    <div className="bg-neutral-50 dark:bg-dark-100 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-800 dark:text-dark-600">
                        {song.lyricsWithChords}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-neutral-400 text-4xl mb-4 block">🎸</span>
                <p className="text-neutral-600 dark:text-dark-500">
                  No chords added yet
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700">
                Notes & Comments
              </h3>
              {!isEditing && !song.notes && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-600 text-sm font-medium"
                >
                  Add Notes
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                placeholder="Add personal notes, performance tips, memories, or any other context about this song..."
                className="input-field min-h-[300px]"
              />
            ) : song.notes ? (
              <div className="bg-neutral-50 dark:bg-dark-100 rounded-xl p-4">
                <div className="whitespace-pre-wrap text-neutral-800 dark:text-dark-600">
                  {song.notes}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-neutral-400 text-4xl mb-4 block">📝</span>
                <p className="text-neutral-600 dark:text-dark-500">
                  No notes added yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditForm({
                lyrics: song.lyrics || "",
                chords: song.chords || "",
                notes: song.notes || "",
                lyricsWithChords: song.lyricsWithChords || "",
              });
            }}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSave()}
            className="btn-primary flex-1"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

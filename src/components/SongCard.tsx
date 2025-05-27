import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface Song {
  _id: string;
  title: string;
  singer?: string;
  movie?: string;
  scale?: string;
  era?: string;
  actor?: string;
  hasShayari?: boolean;
  tags: string[];
}

interface SongCardProps {
  song: Song;
  onDelete: () => void;
  onView?: () => void;
  showActions?: boolean;
}

export function SongCard({
  song,
  onDelete,
  onView,
  showActions = true,
}: SongCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: song.title,
    singer: song.singer || "",
    movie: song.movie || "",
    scale: song.scale || "",
    era: song.era || "",
    actor: song.actor || "",
    hasShayari: song.hasShayari || false,
    tags: song.tags.join(", "),
  });

  const updateSong = useMutation(api.songs.update);

  const handleSave = async () => {
    try {
      await updateSong({
        id: song._id as any,
        title: editForm.title,
        singer: editForm.singer || undefined,
        movie: editForm.movie || undefined,
        scale: editForm.scale || undefined,
        era: editForm.era || undefined,
        actor: editForm.actor || undefined,
        hasShayari: editForm.hasShayari,
        tags: editForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setIsEditing(false);
      toast.success("Song updated successfully");
    } catch (error) {
      toast.error("Failed to update song");
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: song.title,
      singer: song.singer || "",
      movie: song.movie || "",
      scale: song.scale || "",
      era: song.era || "",
      actor: song.actor || "",
      hasShayari: song.hasShayari || false,
      tags: song.tags.join(", "),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card p-6 animate-scale-in">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Song title"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            className="input-field"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Singer"
              value={editForm.singer}
              onChange={(e) =>
                setEditForm({ ...editForm, singer: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Movie/Album"
              value={editForm.movie}
              onChange={(e) =>
                setEditForm({ ...editForm, movie: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Scale"
              value={editForm.scale}
              onChange={(e) =>
                setEditForm({ ...editForm, scale: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Era"
              value={editForm.era}
              onChange={(e) =>
                setEditForm({ ...editForm, era: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Actor"
              value={editForm.actor}
              onChange={(e) =>
                setEditForm({ ...editForm, actor: e.target.value })
              }
              className="input-field"
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={editForm.tags}
            onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
            className="input-field"
          />

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={editForm.hasShayari}
              onChange={(e) =>
                setEditForm({ ...editForm, hasShayari: e.target.checked })
              }
              className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-dark-600">
              Has Shayari ✨
            </span>
          </label>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => void handleSave()}
              className="btn-primary flex-1"
            >
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-interactive p-6">
      <div
        className="flex justify-between items-start mb-4 cursor-pointer"
        onClick={onView}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-dark-700 mb-1 truncate">
            {song.title}
          </h3>
          <div className="space-y-1 text-sm">
            {song.singer && (
              <p className="text-neutral-600 dark:text-dark-500 truncate">
                <span className="font-medium">🎤</span> {song.singer}
              </p>
            )}
            {song.movie && (
              <p className="text-neutral-600 dark:text-dark-500 truncate">
                <span className="font-medium">🎬</span> {song.movie}
              </p>
            )}
            {song.actor && (
              <p className="text-neutral-600 dark:text-dark-500 truncate">
                <span className="font-medium">🎭</span> {song.actor}
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div
            className="flex space-x-2 ml-4"
            onClick={(e) => e.stopPropagation()}
          >
            {onView && (
              <button
                onClick={onView}
                className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 hover:bg-accent-200 transition-colors flex items-center justify-center"
                title="View details"
              >
                👁️
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors flex items-center justify-center"
              title="Edit song"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors flex items-center justify-center"
              title="Delete song"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {song.scale && <span className="tag-primary">🎼 {song.scale}</span>}
        {song.era && <span className="tag-secondary">📅 {song.era}</span>}
        {song.hasShayari && <span className="tag-accent">✨ Shayari</span>}
        {song.tags.map((tag, index) => (
          <span
            key={index}
            className="tag bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddSongFormProps {
  onSuccess?: () => void;
}

export function AddSongForm({ onSuccess }: AddSongFormProps = {}) {
  const [form, setForm] = useState({
    title: "",
    singer: "",
    movie: "",
    scale: "",
    era: "",
    actor: "",
    hasShayari: false,
    tags: "",
    lyrics: "",
    chords: "",
    notes: "",
    lyricsWithChords: "",
  });

  const addSong = useMutation(api.songs.add);
  const initializeTags = useMutation(api.tags.initializePredefinedTags);
  const predefinedTags = useQuery(api.tags.getPredefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Song title is required");
      return;
    }

    try {
      await addSong({
        title: form.title.trim(),
        singer: form.singer.trim() || undefined,
        movie: form.movie.trim() || undefined,
        scale: form.scale.trim() || undefined,
        era: form.era.trim() || undefined,
        actor: form.actor.trim() || undefined,
        hasShayari: form.hasShayari,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        lyrics: form.lyrics.trim() || undefined,
        chords: form.chords.trim() || undefined,
        notes: form.notes.trim() || undefined,
        lyricsWithChords: form.lyricsWithChords.trim() || undefined,
      });

      setForm({
        title: "",
        singer: "",
        movie: "",
        scale: "",
        era: "",
        actor: "",
        hasShayari: false,
        tags: "",
        lyrics: "",
        chords: "",
        notes: "",
        lyricsWithChords: "",
      });

      toast.success("Song added successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add song");
    }
  };

  // Initialize predefined tags on first load
  if (predefinedTags !== undefined && predefinedTags.length === 0) {
    void initializeTags();
  }

  const addPredefinedTag = (tagName: string) => {
    const currentTags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!currentTags.includes(tagName)) {
      const newTags = [...currentTags, tagName].join(", ");
      setForm({ ...form, tags: newTags });
    }
  };

  const groupedTags =
    predefinedTags?.reduce(
      (acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      },
      {} as Record<string, typeof predefinedTags>
    ) || {};

  return (
    <div className="px-4 py-6">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
            Song Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="Enter song title"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Singer
            </label>
            <input
              type="text"
              value={form.singer}
              onChange={(e) => setForm({ ...form, singer: e.target.value })}
              className="input-field"
              placeholder="Singer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Movie/Album
            </label>
            <input
              type="text"
              value={form.movie}
              onChange={(e) => setForm({ ...form, movie: e.target.value })}
              className="input-field"
              placeholder="Movie or album name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Scale
            </label>
            <input
              type="text"
              value={form.scale}
              onChange={(e) => setForm({ ...form, scale: e.target.value })}
              className="input-field"
              placeholder="e.g., C, Dm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Era
            </label>
            <input
              type="text"
              value={form.era}
              onChange={(e) => setForm({ ...form, era: e.target.value })}
              className="input-field"
              placeholder="e.g., 70s, 90s"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Actor
            </label>
            <input
              type="text"
              value={form.actor}
              onChange={(e) => setForm({ ...form, actor: e.target.value })}
              className="input-field"
              placeholder="On-screen actor"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={form.hasShayari}
              onChange={(e) =>
                setForm({ ...form, hasShayari: e.target.checked })
              }
              className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-dark-600">
              Has Shayari ✨
            </span>
          </label>
        </div>

        {/* Predefined Tags */}
        {Object.keys(groupedTags).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-3">
              Quick Tags
            </label>
            <div className="space-y-4">
              {Object.entries(groupedTags).map(([category, tags]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-neutral-500 dark:text-dark-400 uppercase tracking-wide mb-2">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => addPredefinedTag(tag.name)}
                        className="tag-primary hover:scale-105 active:scale-95"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
            Custom Tags
          </label>
          <input
            type="text"
            placeholder="Add custom tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="input-field"
          />
          <p className="text-xs text-neutral-500 dark:text-dark-400 mt-1">
            Separate multiple tags with commas
          </p>
        </div>

        {/* [AI] New sections for detailed content */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-700">
            Song Content (Optional)
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Lyrics
            </label>
            <textarea
              value={form.lyrics}
              onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
              className="input-field min-h-[120px] font-mono text-sm"
              placeholder="Paste or type song lyrics here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Chords
            </label>
            <textarea
              value={form.chords}
              onChange={(e) => setForm({ ...form, chords: e.target.value })}
              className="input-field min-h-[100px] font-mono text-sm"
              placeholder="Add chord progressions or chord charts..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Lyrics with Chords (Combined)
            </label>
            <textarea
              value={form.lyricsWithChords}
              onChange={(e) =>
                setForm({ ...form, lyricsWithChords: e.target.value })
              }
              className="input-field min-h-[150px] font-mono text-sm"
              placeholder="Paste formatted lyrics with chords (e.g., from Ultimate Guitar)..."
            />
            <p className="text-xs text-neutral-500 dark:text-dark-400 mt-1">
              For formatted text with chords above lyrics
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-600 mb-2">
              Notes & Comments
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field min-h-[100px]"
              placeholder="Add personal notes, performance tips, or any other context..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">
            Add Song 🎵
          </button>
        </div>
      </form>
    </div>
  );
}

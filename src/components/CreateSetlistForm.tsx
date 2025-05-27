import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CreateSetlistFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreateSetlistForm({ onCancel, onSuccess }: CreateSetlistFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    selectedSongs: [] as string[],
  });

  const songs = useQuery(api.songs.list, {});
  const createSetlist = useMutation(api.setlists.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Setlist name is required");
      return;
    }

    try {
      await createSetlist({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        songIds: form.selectedSongs as any,
      });

      toast.success("Setlist created successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create setlist");
    }
  };

  const toggleSong = (songId: string) => {
    if (form.selectedSongs.includes(songId)) {
      setForm({
        ...form,
        selectedSongs: form.selectedSongs.filter(id => id !== songId),
      });
    } else {
      setForm({
        ...form,
        selectedSongs: [...form.selectedSongs, songId],
      });
    }
  };

  if (songs === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Setlist</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Setlist Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter setlist name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Optional description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Songs ({form.selectedSongs.length} selected)
          </label>
          
          {songs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No songs available. Add some songs first to create a setlist.
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {songs.map((song) => (
                <label
                  key={song._id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={form.selectedSongs.includes(song._id)}
                    onChange={() => toggleSong(song._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{song.title}</div>
                    {song.singer && (
                      <div className="text-sm text-gray-600">by {song.singer}</div>
                    )}
                    {song.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {song.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {song.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{song.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={songs.length === 0}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Setlist
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

interface Setlist {
  _id: string;
  name: string;
  description?: string;
  songIds: string[];
  isPublic?: boolean;
}

interface SetlistCardProps {
  setlist: Setlist;
  onView: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function SetlistCard({
  setlist,
  onView,
  onDelete,
  onShare,
}: SetlistCardProps) {
  return (
    <div className="card-interactive p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <span className="text-secondary-600 text-lg">📋</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-dark-700 truncate">
                {setlist.name}
              </h3>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-neutral-600 dark:text-dark-500">
                  {setlist.songIds.length} song
                  {setlist.songIds.length !== 1 ? "s" : ""}
                </span>
                <span className="text-neutral-500 dark:text-dark-400">
                  ~{Math.ceil(setlist.songIds.length * 3.5)} min
                </span>
              </div>
            </div>
          </div>

          {setlist.description && (
            <p className="text-neutral-600 dark:text-dark-500 text-sm mb-3 line-clamp-2">
              {setlist.description}
            </p>
          )}

          <div className="flex items-center space-x-2">
            {setlist.isPublic && <span className="tag-accent">🌐 Public</span>}
            <span className="tag bg-neutral-100 text-neutral-600">
              🎵 Setlist
            </span>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={onView}
            className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors flex items-center justify-center"
            title="View setlist"
          >
            👁️
          </button>
          <button
            onClick={onShare}
            className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 hover:bg-accent-200 transition-colors flex items-center justify-center"
            title="Share setlist"
          >
            📤
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors flex items-center justify-center"
            title="Delete setlist"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

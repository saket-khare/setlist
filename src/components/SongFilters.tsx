import { useState } from "react";

interface FilterOptions {
  singers: (string | undefined)[];
  movies: (string | undefined)[];
  scales: (string | undefined)[];
  eras: (string | undefined)[];
  tags: string[];
}

interface SongFiltersProps {
  filterOptions: FilterOptions;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedSinger: string;
  setSelectedSinger: (singer: string) => void;
  selectedMovie: string;
  setSelectedMovie: (movie: string) => void;
  selectedScale: string;
  setSelectedScale: (scale: string) => void;
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  onClearFilters: () => void;
}

export function SongFilters({
  filterOptions,
  selectedTags,
  setSelectedTags,
  selectedSinger,
  setSelectedSinger,
  selectedMovie,
  setSelectedMovie,
  selectedScale,
  setSelectedScale,
  selectedEra,
  setSelectedEra,
  onClearFilters,
}: SongFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters =
    selectedTags.length > 0 ||
    selectedSinger ||
    selectedMovie ||
    selectedScale ||
    selectedEra;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const activeFiltersCount = [
    selectedTags.length > 0 ? 1 : 0,
    selectedSinger ? 1 : 0,
    selectedMovie ? 1 : 0,
    selectedScale ? 1 : 0,
    selectedEra ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* [AI] Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 card-interactive px-4 py-3"
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
            className="text-neutral-600"
          >
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          <span className="font-medium text-neutral-700 dark:text-dark-600">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* [AI] Expandable Filter Content */}
      {isExpanded && (
        <div className="card p-4 space-y-6 animate-scale-in">
          {/* Quick Tags */}
          {filterOptions.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-dark-600 mb-3 flex items-center">
                <span className="mr-2">🏷️</span>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-primary-500 text-white shadow-card hover:bg-primary-600 scale-105"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Dropdowns */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-dark-600 flex items-center">
              <span className="mr-2">🎯</span>
              Categories
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {/* Singer Filter */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-dark-500 mb-2">
                  🎤 Singer
                </label>
                <select
                  value={selectedSinger}
                  onChange={(e) => setSelectedSinger(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Singers</option>
                  {filterOptions.singers.filter(Boolean).map((singer) => (
                    <option key={singer} value={singer}>
                      {singer}
                    </option>
                  ))}
                </select>
              </div>

              {/* Movie Filter */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-dark-500 mb-2">
                  🎬 Movie/Album
                </label>
                <select
                  value={selectedMovie}
                  onChange={(e) => setSelectedMovie(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Movies</option>
                  {filterOptions.movies.filter(Boolean).map((movie) => (
                    <option key={movie} value={movie}>
                      {movie}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Scale Filter */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-dark-500 mb-2">
                    🎼 Scale
                  </label>
                  <select
                    value={selectedScale}
                    onChange={(e) => setSelectedScale(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">All Scales</option>
                    {filterOptions.scales.filter(Boolean).map((scale) => (
                      <option key={scale} value={scale}>
                        {scale}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Era Filter */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-dark-500 mb-2">
                    📅 Era
                  </label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">All Eras</option>
                    {filterOptions.eras.filter(Boolean).map((era) => (
                      <option key={era} value={era}>
                        {era}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

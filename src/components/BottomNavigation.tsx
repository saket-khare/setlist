interface BottomNavigationProps {
  activeTab: "dashboard" | "songs" | "setlists";
  onTabChange: (tab: "dashboard" | "songs" | "setlists") => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const tabs = [
    {
      id: "dashboard" as const,
      label: "Home",
      icon: "🏠",
      activeIcon: "🏠",
    },
    {
      id: "songs" as const,
      label: "Songs",
      icon: "🎵",
      activeIcon: "🎵",
    },
    {
      id: "setlists" as const,
      label: "Setlists",
      icon: "📋",
      activeIcon: "📋",
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary-100 text-primary-600 scale-105"
                : "text-neutral-500 hover:text-neutral-700 active:scale-95"
            }`}
          >
            <span className="text-xl mb-1">
              {activeTab === tab.id ? tab.activeIcon : tab.icon}
            </span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

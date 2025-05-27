import { useState } from "react";
import { AddSongForm } from "./AddSongForm";

export function FloatingActionButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* [AI] Floating Action Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fab"
        aria-label="Add new song"
      >
        <span className="text-2xl">+</span>
      </button>

      {/* [AI] Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* [AI] Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-100 rounded-t-2xl z-50 transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* [AI] Drawer handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-neutral-300 dark:bg-dark-300 rounded-full"></div>
        </div>

        {/* [AI] Drawer header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-200 dark:border-dark-200">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-700">
            Add New Song
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-dark-200 flex items-center justify-center text-neutral-600 dark:text-dark-500 hover:bg-neutral-200 dark:hover:bg-dark-300 transition-colors"
          >
            ×
          </button>
        </div>

        {/* [AI] Drawer content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <AddSongForm onSuccess={() => setIsDrawerOpen(false)} />
        </div>
      </div>
    </>
  );
}

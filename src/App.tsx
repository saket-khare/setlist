import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { SongLibrary } from "./components/SongLibrary";
import { SetlistManager } from "./components/SetlistManager";
import { Dashboard } from "./components/Dashboard";
import { BottomNavigation } from "./components/BottomNavigation";
import { FloatingActionButton } from "./components/FloatingActionButton";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "songs" | "setlists"
  >("dashboard");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-50">
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-dark-100/95 backdrop-blur-sm border-b border-neutral-200 dark:border-dark-200">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-warm rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🎵</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-700">
              Setlist
            </h1>
          </div>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Authenticated>
          <Content activeTab={activeTab} />
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <FloatingActionButton />
        </Authenticated>

        <Unauthenticated>
          <div className="flex items-center justify-center min-h-[80vh] px-6">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-sunset rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">🎵</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-dark-700 mb-3">
                  Welcome to Setlist
                </h2>
                <p className="text-neutral-600 dark:text-dark-500 text-lg leading-relaxed">
                  Organize your songs and create perfect setlists for your jam
                  sessions
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}

function Content({
  activeTab,
}: {
  activeTab: "dashboard" | "songs" | "setlists";
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "songs" && <SongLibrary />}
      {activeTab === "setlists" && <SetlistManager />}
    </div>
  );
}

import { useState } from "react";

import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Intro from "./components/Intro";

import "./App.css";

function App() {
  // ==================================================
  // DARK / LIGHT MODE
  // ==================================================
  const [darkMode, setDarkMode] = useState(false);

  // ==================================================
  // INTRO SCREEN
  // ==================================================
  const [showIntro, setShowIntro] = useState(true);

  // ==================================================
  // CURRENT PAGE
  // ==================================================
  // Controls which page is displayed.
  //
  // dashboard = Dashboard
  // analytics = Analytics
  // ==================================================
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "analytics"
  >("dashboard");

  // ==================================================
  // SHARED ANALYSIS STATE
  // ==================================================
  // These states belong in App.tsx because both
  // Dashboard and Analytics need access to them.
  // ==================================================

  // Has the user analyzed a game?
  const [analyzed, setAnalyzed] = useState(false);

  // App ID of the game that was analyzed
  const [analyzedAppId, setAnalyzedAppId] = useState("");

  // ==================================================
  // GET STARTED
  // ==================================================
  const handleGetStarted = () => {
    setShowIntro(false);

    // Start on Dashboard
    setCurrentPage("dashboard");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* ==================================================
          INTRO
          ================================================== */}
      {showIntro ? (
        <Intro
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onGetStarted={handleGetStarted}
        />
      ) : (
        <>
          {/* ==================================================
              DASHBOARD
              ================================================== */}
          {currentPage === "dashboard" && (
            <Dashboard
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}

              // Shared analysis state
              analyzed={analyzed}
              setAnalyzed={setAnalyzed}
              analyzedAppId={analyzedAppId}
              setAnalyzedAppId={setAnalyzedAppId}
            />
          )}

          {/* ==================================================
              ANALYTICS
              ================================================== */}
          {currentPage === "analytics" && (
            <Analytics
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}

              // Analytics receives the same shared state
              analyzed={analyzed}
              analyzedAppId={analyzedAppId}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

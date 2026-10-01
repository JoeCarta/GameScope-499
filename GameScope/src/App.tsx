import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Intro from "./components/Intro";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleGetStarted = () => {
    setShowIntro(false);

    // Start dashboard at the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  return (
    <div className="app-container">
      {showIntro ? (
        <Intro
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onGetStarted={handleGetStarted}
        />
      ) : (
        <Dashboard
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </div>
  );
}

export default App;
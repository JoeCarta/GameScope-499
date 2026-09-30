import { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  return (
    <Dashboard
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      navbarCollapsed={navbarCollapsed}
      setNavbarCollapsed={setNavbarCollapsed}
    />
  );
}

export default App;
import Navbar from "./Navbar";
import "./Dashboard.css";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  navbarCollapsed: boolean;
  setNavbarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function Dashboard({
  darkMode,
  setDarkMode,
  navbarCollapsed,
  setNavbarCollapsed,
}: DashboardProps) {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        collapsed={navbarCollapsed}
        setCollapsed={setNavbarCollapsed}
      />

      <main
        className={`dashboard ${
          darkMode ? "dark-mode" : ""
        } ${navbarCollapsed ? "dashboard-collapsed" : ""}`}
      >
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>GameScope</h1>
            <p>Game Feedback Analysis</p>
          </div>
        </header>

        {/* Steam App ID */}
        <section className="steam-search">
          <h2>Analyze a Steam Game</h2>

          <p>
            Enter the Steam App ID to analyze player feedback.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter Steam App ID"
            />

            <button>
              Analyze
            </button>
          </div>
        </section>

        {/* Dashboard Results */}
        <section className="results">
          <div className="game-status">
            <div>
              <h2>Game Analysis</h2>

              <p>
                Steam App ID: 2694490
              </p>
            </div>

            <span className="status">
              ● Analyzed
            </span>
          </div>

          {/* Statistics */}
          <div className="stats">
            <div className="stat-card">
              <h3>Total Reviews</h3>
              <p>1,284</p>
            </div>

            <div className="stat-card">
              <h3>Positive</h3>
              <p>72%</p>
            </div>

            <div className="stat-card">
              <h3>Negative</h3>
              <p>28%</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="dashboard-content">

            {/* Top Issues */}
            <div className="issues">
              <h2>Top Issues</h2>

              <div className="issue">
                <span>Inventory Problems</span>
                <span>1,284 reports</span>
              </div>

              <div className="issue">
                <span>Performance Issues</span>
                <span>932 reports</span>
              </div>

              <div className="issue">
                <span>Multiplayer Issues</span>
                <span>641 reports</span>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="feedback">
              <h2>Recent Feedback</h2>

              <div className="feedback-item">
                <p>
                  "The inventory system is difficult to use."
                </p>
              </div>

              <div className="feedback-item">
                <p>
                  "Performance drops whenever there are too many players."
                </p>
              </div>

              <div className="feedback-item">
                <p>
                  "Matchmaking keeps disconnecting."
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
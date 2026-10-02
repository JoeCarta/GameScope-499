import { useState } from "react";

import Navbar from "./Navbar";

import "./Dashboard.css";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  currentPage: "dashboard" | "analytics";

  setCurrentPage: React.Dispatch<
    React.SetStateAction<"dashboard" | "analytics">
  >;

  // ==================================================
  // SHARED ANALYSIS STATE
  // ==================================================
  // These values are controlled by App.tsx.
  // ==================================================

  // Tells Dashboard whether a game has been analyzed.
  analyzed: boolean;

  // Allows Dashboard to tell App.tsx that analysis
  // has finished.
  setAnalyzed: React.Dispatch<React.SetStateAction<boolean>>;

  // App ID stored in App.tsx so Analytics can use it too.
  analyzedAppId: string;

  // Allows Dashboard to save the App ID after analysis.
  setAnalyzedAppId: React.Dispatch<React.SetStateAction<string>>;

  onLogoClick: () => void;

}

function Dashboard({
  darkMode,
  setDarkMode,
  currentPage,
  setCurrentPage,

  // Shared analysis state
  analyzed,
  setAnalyzed,
  analyzedAppId,
  setAnalyzedAppId,
  onLogoClick
}: DashboardProps) {
  // ==================================================
  // APP ID
  // ==================================================
  // Start with the App ID saved in App.tsx.
  //
  // This is useful because Dashboard can be unmounted
  // when the user switches to Analytics. When they return,
  // the analyzed App ID is still available.
  // ==================================================
  const [appId, setAppId] = useState(analyzedAppId);

  // ==================================================
  // LOADING
  // ==================================================
  const [loading, setLoading] = useState(false);

  // ==================================================
  // GAME NAME
  // ==================================================
  // BACKEND:
  // Eventually the backend should return the real Steam
  // game name based on the App ID.
  //
  // For now, Path of Exile 2 is used as the demo game.
  // ==================================================
  const displayedAppId = analyzed
    ? analyzedAppId
    : appId.trim();

  const gameName =
    displayedAppId === "2694490"
      ? "Path of Exile 2"
      : displayedAppId
        ? `Steam Game ${displayedAppId}`
        : "Enter a Steam App ID";

  // ==================================================
  // DEMO REVIEW DATA
  // ==================================================
  // BACKEND:
  // Replace this with the actual response from MySQL.
  // ==================================================
  const reviewData = {
    totalReviews: 1284,
    positiveReviews: 925,
    negativeReviews: 359,
    positivePercentage: 72,
    negativePercentage: 28,
  };

  // ==================================================
  // TOP ISSUES
  // ==================================================
  // BACKEND:
  // These will eventually be calculated from the
  // filtered Steam reviews.
  // ==================================================
  const topIssues = [
    {
      name: "Performance",
      count: 932,
    },
    {
      name: "Inventory",
      count: 821,
    },
    {
      name: "Bugs",
      count: 523,
    },
    {
      name: "Multiplayer",
      count: 482,
    },
  ];

  // ==================================================
  // RECENT FEEDBACK
  // ==================================================
  // BACKEND:
  // These should eventually come from MySQL.
  //
  // Steam IDs are intentionally NOT displayed because
  // the project treats reviews as anonymous.
  // ==================================================
  const recentFeedback = [
    {
      type: "positive",
      text: "The combat system and overall gameplay are excellent.",
    },
    {
      type: "negative",
      text: "Performance problems make the game difficult to enjoy.",
    },
    {
      type: "positive",
      text: "Great graphics and a lot of content to explore.",
    },
  ];

  // ==================================================
  // ANALYZE GAME
  // ==================================================
  const handleAnalyze = () => {
    const trimmedAppId = appId.trim();

    // Don't analyze an empty App ID
    if (!trimmedAppId) {
      return;
    }

    setLoading(true);

    // ==================================================
    // BACKEND:
    //
    // Eventually replace this simulated timeout with
    // your actual backend request.
    //
    // Example:
    //
    // fetch(`/api/analyze/${trimmedAppId}`)
    //
    // The backend should:
    //
    // 1. Receive Steam App ID
    // 2. Collect Steam reviews
    // 3. Filter low-quality reviews
    // 4. Store/read reviews from MySQL
    // 5. Calculate analytics
    // 6. Return the results
    // ==================================================

    setTimeout(() => {
      setLoading(false);

      // Tell App.tsx that analysis is complete.
      setAnalyzed(true);

      // Save the App ID in App.tsx.
      //
      // Analytics will receive this same value.
      setAnalyzedAppId(trimmedAppId);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 2000);
  };

  // ==================================================
  // RE-ANALYZE
  // ==================================================
  const handleReanalyze = () => {
    handleAnalyze();
  };

  return (
    <div className="dashboard-page">
      {/* ==================================================
          NAVBAR
          ================================================== */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogoClick={onLogoClick}
      />

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}
      <main className="dashboard-main">
        {/* ==================================================
            PAGE HEADER
            ================================================== */}
        <section className="dashboard-header">
          <div>
            <span className="dashboard-label">GAMESCOPE</span>

            <h1>Game Review Dashboard</h1>

            <p>
              Analyze Steam player reviews and discover meaningful
              feedback about a game.
            </p>
          </div>
        </section>

        {/* ==================================================
            ANALYZE CARD
            ================================================== */}
        <section className="analyze-card">
          <div className="analyze-content">
            <div className="analyze-title">
              <h2>Analyze a Game</h2>

              <p>
                Enter a Steam App ID to analyze player reviews.
              </p>
            </div>

            <div className="search-container">
              <input
                type="text"
                value={appId}
                onChange={(event) => setAppId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAnalyze();
                  }
                }}
                placeholder="Enter Steam App ID..."
                disabled={loading}
              />

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !appId.trim()}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            <p className="app-id-help">
              Example: <strong>2694490</strong> for Path of Exile 2
            </p>
          </div>
        </section>

        {/* ==================================================
            LOADING
            ================================================== */}
        {loading && (
          <section className="loading-card">
            <div className="loading-spinner"></div>

            <h3>Analyzing Reviews...</h3>

            <p>
              Collecting and processing player feedback.
            </p>
          </section>
        )}

        {/* ==================================================
            ANALYZED GAME
            ================================================== */}
        {analyzed && !loading && (
          <>
            {/* ==================================================
                GAME STATUS
                ================================================== */}
            <section className="game-status">
              <div>
                <span className="status-label">
                  CURRENTLY ANALYZED
                </span>

                <h2>{gameName}</h2>

                <p>
                  Steam App ID:{" "}
                  <strong>{analyzedAppId}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleReanalyze}
                disabled={loading || !appId.trim()}
              >
                Re-analyze
              </button>
            </section>

            {/* ==================================================
                SUMMARY STATS
                ================================================== */}
            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">
                  TOTAL REVIEWS
                </span>

                <strong className="stat-value">
                  {reviewData.totalReviews.toLocaleString()}
                </strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  POSITIVE REVIEWS
                </span>

                <strong className="stat-value">
                  {reviewData.positivePercentage}%
                </strong>

                <span className="stat-detail">
                  {reviewData.positiveReviews.toLocaleString()} reviews
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  NEGATIVE REVIEWS
                </span>

                <strong className="stat-value">
                  {reviewData.negativePercentage}%
                </strong>

                <span className="stat-detail">
                  {reviewData.negativeReviews.toLocaleString()} reviews
                </span>
              </div>
            </section>

            {/* ==================================================
                REVIEW SUMMARY
                ================================================== */}
            <section className="analysis-summary">
              <div>
                <span className="summary-label">
                  ANALYSIS SUMMARY
                </span>

                <h2>What are players saying?</h2>

                <p>
                  The analyzed reviews contain both positive and
                  negative player feedback. The most frequently
                  mentioned issues can help identify areas that
                  may require further attention.
                </p>
              </div>

              <div className="summary-stat">
                <strong>
                  {reviewData.positivePercentage}%
                </strong>

                <span>Recommended</span>
              </div>
            </section>

            {/* ==================================================
                TOP ISSUES
                ================================================== */}
            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <span className="card-label">
                    REVIEW ANALYSIS
                  </span>

                  <h2>Top Issues</h2>
                </div>
              </div>

              <div className="issue-list">
                {topIssues.map((issue) => (
                  <div
                    className="issue-item"
                    key={issue.name}
                  >
                    <div className="issue-info">
                      <span>{issue.name}</span>

                      <strong>
                        {issue.count.toLocaleString()}
                      </strong>
                    </div>

                    <div className="issue-bar">
                      <div
                        className="issue-bar-fill"
                        style={{
                          width: `${
                            (issue.count / topIssues[0].count) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ==================================================
                RECENT FEEDBACK
                ================================================== */}
            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <span className="card-label">
                    PLAYER FEEDBACK
                  </span>

                  <h2>Recent Feedback</h2>
                </div>
              </div>

              <div className="feedback-list">
                {recentFeedback.map((feedback, index) => (
                  <div
                    className="feedback-item"
                    key={index}
                  >
                    <span
                      className={`feedback-type ${feedback.type}`}
                    >
                      {feedback.type === "positive"
                        ? "Positive"
                        : "Negative"}
                    </span>

                    <p>{feedback.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ==================================================
            BEFORE ANALYSIS
            ================================================== */}
        {!analyzed && !loading && (
          <section className="dashboard-empty">
            <h2>Ready to analyze a game?</h2>

            <p>
              Enter a Steam App ID above to begin analyzing
              player reviews.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

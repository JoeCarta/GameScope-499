import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./Navbar";
import "./Dashboard.css";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

/* =========================
   Scroll Reveal
========================= */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${
        visible ? "scroll-reveal-visible" : ""
      }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================
   Animated Number
========================= */

function AnimatedNumber({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [started]);

  useEffect(() => {
    if (!started) {
      return;
    }

    let animationFrame: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [started, value, duration]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}

/* =========================
   Dashboard
========================= */

function Dashboard({
  darkMode,
  setDarkMode,
}: DashboardProps) {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  /* =====================================================
     BACKEND DATA
     =====================================================

     The values below are currently hardcoded for the
     frontend demo.

     BACKEND TEAM:
     These values should eventually come from FastAPI.

     Expected backend data:
     - Game name
     - Steam App ID
     - Total reviews
     - Positive reviews
     - Negative reviews
     - Positive percentage
     - Negative percentage
     - Top issues
     - Review quality
     - Recent feedback
     - Analysis summary

     The React frontend should receive this data from
     FastAPI instead of hardcoding it here.
  ===================================================== */

  /* =========================
     Game Name
  ========================= */

  /*
    BACKEND:

    This is currently a temporary frontend mapping.

    The backend should eventually return the actual
    Steam game name based on the App ID.

    Example backend value:
      game_name: "Path of Exile 2"
  */

  const gameName =
    appId.trim() === "2694490"
      ? "Path of Exile 2"
      : `Steam Game ${appId}`;

  /* =========================
     Review Statistics
  ========================= */

  /*
    BACKEND:

    Replace these hardcoded values with data calculated
    from the reviews stored in MySQL.

    Your reviews table contains:

      recommended BOOLEAN

    TRUE  = Positive review
    FALSE = Negative review

    Backend can calculate:
      - Total reviews
      - Positive reviews
      - Negative reviews
      - Positive percentage
      - Negative percentage
  */

  const reviewData = [
    {
      name: "Reviews",

      // BACKEND: Replace 925 with positive_reviews
      Positive: 925,

      // BACKEND: Replace 359 with negative_reviews
      Negative: 359,
    },
  ];

  /* =========================
     Top Issues
  ========================= */

  /*
    BACKEND:

    Replace these hardcoded issues with the issues
    identified by the review-analysis system.

    Example:

      top_issues: [
        {
          issue: "Inventory Problems",
          reports: 1284
        }
      ]

    These issues are not directly stored in the
    reviews table. They will need to be generated
    by the backend analysis.
  */

  const topIssues = [
    {
      // BACKEND: Replace with issue returned by API
      issue: "Inventory Problems",

      // BACKEND: Replace with number of reports
      reports: 1284,
    },
    {
      // BACKEND: Replace with issue returned by API
      issue: "Performance Issues",

      // BACKEND: Replace with number of reports
      reports: 932,
    },
    {
      // BACKEND: Replace with issue returned by API
      issue: "Multiplayer Issues",

      // BACKEND: Replace with number of reports
      reports: 641,
    },
    {
      // BACKEND: Replace with issue returned by API
      issue: "Bugs",

      // BACKEND: Replace with number of reports
      reports: 523,
    },
  ];

  /* =========================
     Recent Feedback
  ========================= */

  /*
    BACKEND:

    Replace these example reviews with actual review
    data returned by FastAPI.

    MySQL fields that can be used here:

      review_text
      recommended

    Example:

      review_text → displayed review text
      recommended → Positive / Negative
  */

  const recentFeedback = [
    {
      // BACKEND: Determine this from the "recommended" field
      type: "Negative",

      // BACKEND: Replace with review_text
      text: "The inventory system is difficult to use.",
    },
    {
      // BACKEND: Determine this from the "recommended" field
      type: "Negative",

      // BACKEND: Replace with review_text
      text: "Performance drops whenever there are too many players.",
    },
    {
      // BACKEND: Determine this from the "recommended" field
      type: "Positive",

      // BACKEND: Replace with review_text
      text: "The new crafting system makes progression much more enjoyable.",
    },
  ];

  /* =====================================================
     BACKEND CONNECTION
     =====================================================

     Currently this function only simulates an analysis.

     BACKEND TEAM:

     Replace the setTimeout() with a fetch() request
     to your FastAPI backend.

     Frontend should send:

       appId

     Backend should return:

       game_name
       app_id
       total_reviews
       positive_reviews
       negative_reviews
       positive_percentage
       negative_percentage
       top_issues
       review_quality
       recent_feedback
       summary
  ===================================================== */

  const handleAnalyze = () => {
    if (!appId.trim()) {
      return;
    }

    setLoading(true);
    setAnalyzed(false);

    /*
      BACKEND:

      Remove this temporary setTimeout() when FastAPI
      is connected.

      Replace it with something similar to:

        fetch("YOUR_FASTAPI_ENDPOINT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            app_id: appId,
          }),
        })

      The response should then be stored in React
      state and used to populate the dashboard.
    */

    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 2000);
  };

  /* =========================
     Re-analyze
  ========================= */

  /*
    BACKEND:

    This can eventually send the same App ID back
    to the backend to run the analysis again.
  */

  const handleReanalyze = () => {
    if (!appId.trim()) {
      return;
    }

    handleAnalyze();
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="dashboard">
        <Reveal>
          <header className="dashboard-header">
            <div>
              <h1>Game Feedback Analysis</h1>

              <p>
                Analyze player feedback and identify the issues that matter
                most.
              </p>
            </div>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <section className="analyze-card">
            <div className="analyze-header">
              <h2>Analyze a Steam Game</h2>

              <p>
                Enter a Steam App ID to analyze player reviews.
              </p>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Enter Steam App ID"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAnalyze();
                  }
                }}
              />

              <button
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </section>
        </Reveal>

        {loading && (
          <Reveal>
            <section className="loading-card">
              <div className="spinner"></div>

              <h3>Analyzing player feedback...</h3>

              <p>
                Collecting and processing Steam reviews. This may take a
                moment.
              </p>
            </section>
          </Reveal>
        )}

        {analyzed && !loading && (
          <>
            <Reveal>
              <section className="game-status">
                <div className="game-icon">
                  🎮
                </div>

                <div>
                  <h2>Game Analysis Complete</h2>

                  <p>
                    {/* BACKEND: Replace gameName with game_name from API */}
                    <strong>{gameName}</strong>
                  </p>

                  <p>
                    {/* BACKEND: Replace appId with app_id from API if needed */}
                    Steam App ID: <strong>{appId}</strong>
                  </p>
                </div>

                <div className="analysis-status">
                  <span className="status-badge">
                    Analyzed
                  </span>

                  <small className="analyzed-time">
                    Just now
                  </small>
                </div>
              </section>
            </Reveal>

            {/* =================================================
                STATISTICS

                BACKEND:
                Replace the hardcoded numbers below with values
                returned from FastAPI.
            ================================================= */}

            <Reveal delay={100}>
              <section className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">
                    Total Reviews
                  </span>

                  <strong>
                    {/* BACKEND: Replace 1284 with total_reviews */}
                    <AnimatedNumber value={1284} />
                  </strong>

                  <small>
                    {/* BACKEND: Replace with actual analyzed count */}
                    Analyzed reviews
                  </small>
                </div>

                <div className="stat-card positive-stat">
                  <span className="stat-label">
                    Positive
                  </span>

                  <strong>
                    {/* BACKEND: Replace 72 with positive_percentage */}
                    <AnimatedNumber value={72} />
                    %
                  </strong>

                  <small>
                    {/* BACKEND: Replace 925 with positive_reviews */}
                    925 reviews
                  </small>
                </div>

                <div className="stat-card negative-stat">
                  <span className="stat-label">
                    Negative
                  </span>

                  <strong>
                    {/* BACKEND: Replace 28 with negative_percentage */}
                    <AnimatedNumber value={28} />
                    %
                  </strong>

                  <small>
                    {/* BACKEND: Replace 359 with negative_reviews */}
                    359 reviews
                  </small>
                </div>
              </section>
            </Reveal>

            {/* =================================================
                ANALYSIS SUMMARY

                BACKEND:
                Replace the hardcoded summary below with the
                summary generated by the backend analysis.
            ================================================= */}

            <Reveal delay={150}>
              <section className="analysis-summary">
                <div className="summary-icon">
                  !
                </div>

                <div className="summary-content">
                  <span className="summary-label">
                    Analysis Summary
                  </span>

                  <p>
                    {/* BACKEND:
                        Replace this entire sentence with
                        summary returned by FastAPI. */}

                    <strong>Inventory Problems</strong> are currently the
                    most frequently reported issue in the analyzed feedback.
                  </p>
                </div>

                <button
                  className="reanalyze-button"
                  onClick={handleReanalyze}
                  disabled={loading}
                >
                  ↻ Re-analyze
                </button>
              </section>
            </Reveal>

            <section className="dashboard-content">
              {/* =================================================
                  REVIEW SENTIMENT CHART

                  BACKEND:
                  Replace reviewData with review statistics
                  returned by FastAPI.
              ================================================= */}

              <Reveal delay={100}>
                <div className="dashboard-card chart-card">
                  <div className="card-header">
                    <div>
                      <h2>Review Sentiment</h2>

                      <p>
                        Positive vs. negative player feedback.
                      </p>
                    </div>
                  </div>

                  <div className="chart-container animated-bar-chart">
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={reviewData}
                        margin={{
                          top: 10,
                          right: 20,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="Positive"
                          name="Positive"
                          fill="#22c55e"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                          animationDuration={1400}
                          animationBegin={200}
                          animationEasing="ease-out"
                        />

                        <Bar
                          dataKey="Negative"
                          name="Negative"
                          fill="#ef4444"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                          animationDuration={1400}
                          animationBegin={350}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Reveal>

              {/* =================================================
                  TOP ISSUES

                  BACKEND:
                  Replace topIssues with the issues returned
                  by the review-analysis backend.
              ================================================= */}

              <Reveal delay={200}>
                <div className="dashboard-card issues-card">
                  <div className="card-header">
                    <div>
                      <h2>Top Issues</h2>

                      <p>
                        Most frequently mentioned problems.
                      </p>
                    </div>
                  </div>

                  <div className="issues-list">
                    {topIssues.map(
                      (item, index) => (
                        <div
                          className="issue-item"
                          key={item.issue}
                        >
                          <div className="issue-number">
                            {index + 1}
                          </div>

                          <div className="issue-info">
                            <div className="issue-title-row">
                              <span>
                                {item.issue}
                              </span>

                              <strong>
                                {/* BACKEND:
                                    Replace item.reports with
                                    reports returned by API. */}

                                <AnimatedNumber
                                  value={item.reports}
                                />
                              </strong>
                            </div>

                            <div className="issue-progress">
                              <div
                                className="issue-progress-fill"
                                style={{
                                  /*
                                    BACKEND:

                                    Replace the hardcoded 1284
                                    with the appropriate total
                                    returned by the backend.

                                    For example:

                                    item.reports /
                                    analysisData.total_reviews
                                  */

                                  width: `${Math.max(
                                    25,
                                    (item.reports /
                                      1284) *
                                      100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* =================================================
                REVIEW QUALITY

                BACKEND:
                Replace 78 with review_quality returned
                by FastAPI.
            ================================================= */}

            <Reveal delay={100}>
              <section className="dashboard-card quality-card">
                <div className="quality-content">
                  <div>
                    <h2>Review Quality</h2>

                    <p>
                      Overall quality score based on review usefulness,
                      detail, and consistency.
                    </p>
                  </div>

                  <div className="quality-score">
                    <div
                      className="quality-circle"
                      style={
                        {
                          /*
                            BACKEND:

                            The 78% value is currently hardcoded.

                            Eventually this should use something
                            like:

                              analysisData.review_quality

                            The CSS animation may also need to
                            receive this value dynamically.
                          */

                          "--quality-progress":
                            "78%",
                        } as React.CSSProperties
                      }
                    >
                      <span>
                        {/* BACKEND: Replace 78 with review_quality */}
                        <AnimatedNumber value={78} />%
                      </span>
                    </div>

                    <div>
                      <strong>
                        {/* BACKEND:
                            This description can eventually be
                            generated based on review_quality. */}

                        Good Quality
                      </strong>

                      <p>
                        {/* BACKEND:
                            Replace with quality description
                            returned/calculated by backend. */}

                        Most reviews provide useful feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            {/* =================================================
                RECENT FEEDBACK

                BACKEND:
                Replace recentFeedback with review data
                returned from FastAPI.

                MySQL fields:
                - review_text
                - recommended
                - helpful_votes
                - playtime_hours
                - playtime_at_review_hours

                The backend can use these fields to determine
                which reviews are useful to display.
            ================================================= */}

            <Reveal delay={100}>
              <section className="dashboard-card feedback-card">
                <div className="card-header">
                  <div>
                    <h2>Recent Feedback</h2>

                    <p>
                      Examples of recently analyzed player reviews.
                    </p>
                  </div>
                </div>

                <div className="feedback-list">
                  {recentFeedback.map(
                    (feedback, index) => (
                      <div
                        className="feedback-item"
                        key={`${feedback.text}-${index}`}
                      >
                        <span
                          className={`feedback-type ${
                            feedback.type ===
                            "Positive"
                              ? "feedback-positive"
                              : "feedback-negative"
                          }`}
                        >
                          {feedback.type}
                        </span>

                        <p>
                          "{feedback.text}"
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            </Reveal>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

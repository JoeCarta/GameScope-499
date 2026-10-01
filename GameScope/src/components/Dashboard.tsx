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

function Dashboard({
  darkMode,
  setDarkMode,
}: DashboardProps)  {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const reviewData = [
    {
      name: "Reviews",
      Positive: 925,
      Negative: 359,
    },
  ];

  const topIssues = [
    {
      issue: "Inventory Problems",
      reports: 1284,
    },
    {
      issue: "Performance Issues",
      reports: 932,
    },
    {
      issue: "Multiplayer Issues",
      reports: 641,
    },
    {
      issue: "Bugs",
      reports: 523,
    },
  ];

  const recentFeedback = [
    {
      type: "Negative",
      text: "The inventory system is difficult to use.",
    },
    {
      type: "Negative",
      text: "Performance drops whenever there are too many players.",
    },
    {
      type: "Positive",
      text: "The new crafting system makes progression much more enjoyable.",
    },
  ];

  const handleAnalyze = () => {
    if (!appId.trim()) {
      return;
    }

    setLoading(true);
    setAnalyzed(false);

    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
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
              <p>Enter a Steam App ID to analyze player reviews.</p>
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

              <button onClick={handleAnalyze} disabled={loading}>
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
                <div className="game-icon">🎮</div>

                <div>
                  <h2>Game Analysis Complete</h2>
                  <p>
                    Steam App ID: <strong>{appId}</strong>
                  </p>
                </div>

                <span className="status-badge">Analyzed</span>
              </section>
            </Reveal>

            <Reveal delay={100}>
              <section className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Reviews</span>
                  <strong>1,284</strong>
                  <small>Analyzed reviews</small>
                </div>

                <div className="stat-card positive-stat">
                  <span className="stat-label">Positive</span>
                  <strong>72%</strong>
                  <small>925 reviews</small>
                </div>

                <div className="stat-card negative-stat">
                  <span className="stat-label">Negative</span>
                  <strong>28%</strong>
                  <small>359 reviews</small>
                </div>
              </section>
            </Reveal>

            <section className="dashboard-content">
              <Reveal delay={100}>
                <div className="dashboard-card chart-card">
                  <div className="card-header">
                    <div>
                      <h2>Review Sentiment</h2>
                      <p>Positive vs. negative player feedback.</p>
                    </div>
                  </div>

                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={reviewData}
                        margin={{
                          top: 10,
                          right: 20,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="Positive"
                          name="Positive"
                          fill="#22c55e"
                          radius={[6, 6, 0, 0]}
                        />

                        <Bar
                          dataKey="Negative"
                          name="Negative"
                          fill="#ef4444"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="dashboard-card issues-card">
                  <div className="card-header">
                    <div>
                      <h2>Top Issues</h2>
                      <p>Most frequently mentioned problems.</p>
                    </div>
                  </div>

                  <div className="issues-list">
                    {topIssues.map((item, index) => (
                      <div className="issue-item" key={item.issue}>
                        <div className="issue-number">
                          {index + 1}
                        </div>

                        <div className="issue-info">
                          <div className="issue-title-row">
                            <span>{item.issue}</span>
                            <strong>{item.reports}</strong>
                          </div>

                          <div className="issue-progress">
                            <div
                              className="issue-progress-fill"
                              style={{
                                width: `${Math.max(
                                  25,
                                  (item.reports / 1284) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

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
                    <div className="quality-circle">
                      <span>78%</span>
                    </div>

                    <div>
                      <strong>Good Quality</strong>
                      <p>Most reviews provide useful feedback.</p>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={100}>
              <section className="dashboard-card feedback-card">
                <div className="card-header">
                  <div>
                    <h2>Recent Feedback</h2>
                    <p>Examples of recently analyzed player reviews.</p>
                  </div>
                </div>

                <div className="feedback-list">
                  {recentFeedback.map((feedback, index) => (
                    <div
                      className="feedback-item"
                      key={`${feedback.text}-${index}`}
                    >
                      <span
                        className={`feedback-type ${
                          feedback.type === "Positive"
                            ? "feedback-positive"
                            : "feedback-negative"
                        }`}
                      >
                        {feedback.type}
                      </span>

                      <p>"{feedback.text}"</p>
                    </div>
                  ))}
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
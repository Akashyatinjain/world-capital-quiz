import React from "react";

function Home({ onStartGame }) {
  // Load persistent stats
  const highScore = parseInt(localStorage.getItem("geo_high_score") || "0", 10);
  const maxStreak = parseInt(localStorage.getItem("geo_max_streak") || "0", 10);

  // Settings state local to Home config
  const [mode, setMode] = React.useState("multiple-choice"); // 'classic' or 'multiple-choice'
  const [style, setStyle] = React.useState("endless"); // 'endless' or 'time-attack'

  const handleStart = () => {
    onStartGame({ mode, style });
  };

  return (
    <div className="home-container animate-fade-in">
      <span className="app-logo">👑</span>
      <h1 className="home-title gradient-text">GeoPro</h1>
      <p className="home-subtitle">
        Master the nations. Test your global geography knowledge by identifying country capitals in record time.
      </p>

      <div className="setup-section">
        {/* Game Mode */}
        <div className="setup-group">
          <span className="setup-label">Game Mode</span>
          <div className="options-grid">
            <button
              type="button"
              className={`option-btn ${mode === "multiple-choice" ? "active" : ""}`}
              onClick={() => setMode("multiple-choice")}
            >
              Multiple Choice
            </button>
            <button
              type="button"
              className={`option-btn ${mode === "classic" ? "active" : ""}`}
              onClick={() => setMode("classic")}
            >
              Classic (Write In)
            </button>
          </div>
        </div>

        {/* Challenge Style */}
        <div className="setup-group">
          <span className="setup-label">Challenge Style</span>
          <div className="options-grid">
            <button
              type="button"
              className={`option-btn ${style === "endless" ? "active" : ""}`}
              onClick={() => setStyle("endless")}
            >
              Endless Practice
            </button>
            <button
              type="button"
              className={`option-btn ${style === "time-attack" ? "active" : ""}`}
              onClick={() => setStyle("time-attack")}
            >
              Time Attack (60s)
            </button>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleStart} style={{ width: "100%", padding: "16px" }}>
        START CHALLENGE
      </button>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-val">{highScore}</span>
          <span className="stat-lbl">High Score</span>
        </div>
        <div className="stat-item" style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
          <span className="stat-val">{maxStreak}🔥</span>
          <span className="stat-lbl">Max Streak</span>
        </div>
      </div>
    </div>
  );
}

export default Home;

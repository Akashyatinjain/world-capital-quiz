import React from "react";

function Summary({ gameSummary, onRestart, onHome }) {
  const { score, history, settings, streak } = gameSummary;

  // Calculate stats
  const totalQuestions = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Compute Grade letter and rating feedback text
  let grade = "F";
  let gradeClass = "grade-F";
  let feedbackText = "Oops! Keep practicing to map the world.";

  if (score > 35) {
    grade = "A+";
    gradeClass = "grade-A";
    feedbackText = "Incredible! You are a master cartographer!";
  } else if (score >= 25) {
    grade = "A";
    gradeClass = "grade-A";
    feedbackText = "Splendid job! Excellent geographical vision.";
  } else if (score >= 15) {
    grade = "B";
    gradeClass = "";
    feedbackText = "Well done! Solid score, you know your capitals.";
  } else if (score >= 7) {
    grade = "C";
    gradeClass = "";
    feedbackText = "Good effort! Practice makes perfect.";
  } else if (score >= 1) {
    grade = "D";
    gradeClass = "";
    feedbackText = "Not bad, but there's room to expand your horizon.";
  }

  return (
    <div className="summary-container animate-fade-in">
      {/* Grade Display Badge */}
      <div className={`grade-badge ${gradeClass}`}>
        {grade}
      </div>

      <h2 className="summary-headline gradient-text">Challenge Complete!</h2>
      <p className="summary-desc">{feedbackText}</p>

      {/* Statistics Cards */}
      <div className="summary-stats-grid">
        <div className="summary-stat-card">
          <span className="summary-stat-val gradient-text">{score}</span>
          <span className="summary-stat-lbl">Final Score</span>
        </div>
        <div className="summary-stat-card">
          <span className="summary-stat-val gradient-text">{streak}🔥</span>
          <span className="summary-stat-lbl">Peak Streak</span>
        </div>
        <div className="summary-stat-card">
          <span className="summary-stat-val gradient-text">{accuracy}%</span>
          <span className="summary-stat-lbl">Accuracy</span>
        </div>
      </div>

      {/* Review Section */}
      {history.length > 0 && (
        <div className="review-section">
          <h3 className="review-header">Question Review</h3>
          <div className="review-list">
            {history.map((item, index) => (
              <div
                key={index}
                className={`review-item ${item.isCorrect ? "correct" : "incorrect"}`}
              >
                <div className="review-country-info">
                  {item.code !== "unknown" ? (
                    <img
                      src={`https://flagcdn.com/w80/${item.code}.png`}
                      alt={item.country}
                      className="review-flag"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>🏳️</span>
                  )}
                  <span className="review-country-name">{item.country}</span>
                </div>
                <div className="review-answers">
                  {item.isCorrect ? (
                    <span className="review-correct">{item.correctCapital}</span>
                  ) : (
                    <>
                      <span className="review-user-wrong">{item.userAnswer || "[Blank]"}</span>
                      <span className="review-correct">{item.correctCapital}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "16px", width: "100%" }}>
        <button
          className="btn btn-primary"
          onClick={onRestart}
          style={{ flex: 1 }}
        >
          PLAY AGAIN
        </button>
        <button
          className="btn btn-secondary"
          onClick={onHome}
          style={{ flex: 1 }}
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}

export default Summary;

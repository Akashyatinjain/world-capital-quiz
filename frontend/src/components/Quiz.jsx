import React, { useState, useEffect, useRef } from "react";
import countriesData from "../data/capitals.json";

function Quiz({ gameSettings, onGameOver, onBackToHome }) {
  const { mode, style } = gameSettings;

  // Game states
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lives, setLives] = useState(style === "endless" ? 3 : null);
  const [timeLeft, setTimeLeft] = useState(style === "time-attack" ? 60 : null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [userInput, setUserInput] = useState("");
  
  // Interaction / Feedback states
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [shake, setShake] = useState(false);
  const [history, setHistory] = useState([]); // tracks { country, capital, code, userAnsw, isCorrect }

  // Refs for tracking timer and autofocus
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Generate a random question
  const loadNextQuestion = (currentHistory = history) => {
    // Avoid repeating recently asked countries if possible
    const playedIds = currentHistory.map((h) => h.id);
    let available = countriesData.filter((c) => !playedIds.includes(c.id));
    
    // If all countries have been played, reset pool
    if (available.length === 0) {
      available = countriesData;
    }

    const randomCountry = available[Math.floor(Math.random() * available.length)];
    setCurrentQuestion(randomCountry);
    setUserInput("");
    setSelectedChoice(null);
    setAnswerSubmitted(false);
    setFeedback(null);
    setShake(false);

    if (mode === "multiple-choice") {
      setChoices(generateChoices(randomCountry.capital, countriesData));
    }

    // Auto focus the input field in Classic Mode after state change
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Generate multiple choice distractors
  const generateChoices = (correctCapital, allData) => {
    const distractors = [];
    while (distractors.length < 3) {
      const rand = allData[Math.floor(Math.random() * allData.length)];
      if (
        rand.capital.toLowerCase() !== correctCapital.toLowerCase() &&
        !distractors.some((d) => d.toLowerCase() === rand.capital.toLowerCase())
      ) {
        distractors.push(rand.capital);
      }
    }
    const merged = [correctCapital, ...distractors];
    return merged.sort(() => Math.random() - 0.5);
  };

  // Initialize first question
  useEffect(() => {
    loadNextQuestion([]);
  }, []);

  // Timer Effect (Time Attack Mode)
  useEffect(() => {
    if (style === "time-attack") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleEndGame(score, currentStreak, history);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [style, score, currentStreak, history]);

  // Handle Game Over
  const handleEndGame = (finalScore = score, peakStreak = currentStreak, finalHistory = history) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate final peak streak in case the history contains a larger streak
    // Save to localstorage if new highs
    const storedHighScore = parseInt(localStorage.getItem("geo_high_score") || "0", 10);
    const storedMaxStreak = parseInt(localStorage.getItem("geo_max_streak") || "0", 10);

    if (finalScore > storedHighScore) {
      localStorage.setItem("geo_high_score", finalScore.toString());
    }
    if (peakStreak > storedMaxStreak) {
      localStorage.setItem("geo_max_streak", peakStreak.toString());
    }

    onGameOver({
      score: finalScore,
      history: finalHistory,
      settings: gameSettings,
      streak: peakStreak
    });
  };

  // Process Quiz Answer
  const processAnswer = (userAnswer) => {
    if (answerSubmitted) return;

    const correctCapital = currentQuestion.capital.trim();
    const isCorrect = userAnswer.trim().toLowerCase() === correctCapital.toLowerCase();

    setAnswerSubmitted(true);
    
    // Add to history
    const updatedHistory = [
      ...history,
      {
        id: currentQuestion.id,
        country: currentQuestion.country,
        correctCapital: correctCapital,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        code: currentQuestion.code
      }
    ];
    setHistory(updatedHistory);

    if (isCorrect) {
      setFeedback("correct");
      const nextScore = score + 1;
      const nextStreak = currentStreak + 1;
      setScore(nextScore);
      setCurrentStreak(nextStreak);

      // Brief delay before loading next question
      setTimeout(() => {
        loadNextQuestion(updatedHistory);
      }, 850);
    } else {
      setFeedback("incorrect");
      setShake(true);
      setCurrentStreak(0); // Break streak

      if (style === "endless") {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            handleEndGame(score, currentStreak, updatedHistory);
          }, 850);
          return;
        }
      }

      setTimeout(() => {
        loadNextQuestion(updatedHistory);
      }, 950);
    }
  };

  // Text Submit handler (Classic Mode)
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || answerSubmitted) return;
    processAnswer(userInput);
  };

  // Choice Click handler (Multiple Choice Mode)
  const handleChoiceClick = (choiceIndex) => {
    if (answerSubmitted) return;
    setSelectedChoice(choiceIndex);
    processAnswer(choices[choiceIndex]);
  };

  if (!currentQuestion) {
    return (
      <div className="glass-panel" style={{ textAlign: "center" }}>
        <h2 className="gradient-text">Loading Countries...</h2>
      </div>
    );
  }

  const isUrgent = timeLeft !== null && timeLeft <= 10;
  const isHighStreak = currentStreak >= 5;

  return (
    <div className={`glass-panel animate-fade-in ${shake ? "animate-shake" : ""}`}>
      {/* Feedback Overlay Effect */}
      <div className={`feedback-overlay ${feedback ? feedback : ""}`}></div>

      {/* Quiz Header Row */}
      <div className="quiz-header">
        <button className="back-link" onClick={onBackToHome}>
          ← Quit Quiz
        </button>
        {currentStreak > 0 && (
          <span className={`streak-badge ${isHighStreak ? "active-fire" : ""}`}>
            {currentStreak} Streak 🔥
          </span>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${(history.length / countriesData.length) * 100}%`
          }}
        ></div>
      </div>

      {/* Main Question Card Area */}
      <div className="quiz-card-content">
        {/* Dynamic Country Flag */}
        <div className="flag-wrapper">
          {currentQuestion.code !== "unknown" ? (
            <img
              src={`https://flagcdn.com/w160/${currentQuestion.code}.png`}
              alt={`${currentQuestion.country} flag`}
              className="flag-image"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <span className="flag-placeholder">🏳️</span>
          )}
        </div>

        <p className="country-prompt">What is the capital of</p>
        <h2 className="country-name gradient-text">{currentQuestion.country}</h2>

        {/* Input Interface based on Game Mode */}
        {mode === "classic" ? (
          <form className="answer-form" onSubmit={handleTextSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Type capital name..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={answerSubmitted}
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={!userInput.trim() || answerSubmitted}
            >
              {answerSubmitted ? "CHECKING..." : "SUBMIT"}
            </button>
          </form>
        ) : (
          <div className="choices-grid">
            {choices.map((choice, index) => {
              const isSelected = selectedChoice === index;
              const isCorrectCapital = choice.toLowerCase() === currentQuestion.capital.toLowerCase();
              
              let choiceClass = "";
              if (answerSubmitted) {
                if (isCorrectCapital) {
                  choiceClass = "correct";
                } else if (isSelected) {
                  choiceClass = "incorrect";
                }
              }

              return (
                <button
                  key={index}
                  className={`choice-btn ${choiceClass}`}
                  onClick={() => handleChoiceClick(index)}
                  disabled={answerSubmitted}
                >
                  <span>{choice}</span>
                  {answerSubmitted && isCorrectCapital && (
                    <span className="choice-indicator">✓</span>
                  )}
                  {answerSubmitted && isSelected && !isCorrectCapital && (
                    <span className="choice-indicator">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Meta Row: Timer/Lives & Score */}
      <div className="quiz-meta-row">
        {style === "time-attack" ? (
          <div className={`timer-box ${isUrgent ? "urgent" : ""}`}>
            ⏱️ {timeLeft}s
          </div>
        ) : (
          <div className="timer-box">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                style={{
                  opacity: i < lives ? 1 : 0.25,
                  transition: "opacity 0.3s ease",
                  marginRight: "4px"
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        )}

        <div className="score-box">Score: {score}</div>
      </div>
    </div>
  );
}

export default Quiz;

import React, { useState } from "react";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Summary from "./components/Summary";

function App() {
  const [screen, setScreen] = useState("home"); // 'home', 'quiz', 'summary'
  const [gameSettings, setGameSettings] = useState({
    mode: "multiple-choice",
    style: "endless",
  });
  const [gameSummary, setGameSummary] = useState(null);

  const handleStartGame = (settings) => {
    setGameSettings(settings);
    setScreen("quiz");
  };

  const handleGameOver = (summary) => {
    setGameSummary(summary);
    setScreen("summary");
  };

  const handleRestart = () => {
    setScreen("quiz");
  };

  const handleBackToHome = () => {
    setScreen("home");
  };

  return (
    <>
      {screen === "home" && (
        <Home onStartGame={handleStartGame} />
      )}
      
      {screen === "quiz" && (
        <Quiz
          gameSettings={gameSettings}
          onGameOver={handleGameOver}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {screen === "summary" && (
        <Summary
          gameSummary={gameSummary}
          onRestart={handleRestart}
          onHome={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;

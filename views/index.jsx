import React, { useState } from "react";

function CapitalCityQuiz() {

  const [score, setScore] = useState(0);
  const [countryName, setCountryName] = useState("Country Name");
  const [wasCorrect, setWasCorrect] = useState(null);

  // Example submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Example logic (replace with real API/backend logic)
    const result = false; // simulate wrong answer
    setWasCorrect(result);

    if (!result) {
      alert(`Game over! Final best score: ${score}`);
    }
  };

  if (wasCorrect === false) {
    return (
      <div id="app">
        <a href="/" className="restart-button">Restart</a>
      </div>
    );
  }

  return (
    <div id="app">
      <form className="container" onSubmit={handleSubmit}>

        <div className="horizontal-container">
          <h3>
            Total Score:
            <span id="score"> {score} </span>
          </h3>
        </div>

        <h1 id="countryName">
          {countryName}
        </h1>

        <div className="answer-container">
          <input
            type="text"
            name="answer"
            id="userInput"
            placeholder="Enter the capital"
            autoFocus
            autoComplete="off"
          />
        </div>

        <button type="submit">
          SUBMIT
        </button>

      </form>
    </div>
  );
}

export default CapitalCityQuiz;
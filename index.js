import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // React sends JSON

// Database
const db = new pg.Client({
  user: "postgres",
  password: "akashjain042006",
  host: "localhost",
  database: "world",
  port: 5432,
});

await db.connect();

// Quiz data
let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Load countries from DB
async function loadQuiz() {
  try {
    const result = await db.query("SELECT * FROM country");
    quiz = result.rows;
  } catch (err) {
    console.error("Database error:", err);
  }
}

await loadQuiz();

// Get next question
function nextQuestion() {
  const randomCountry =
    quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

// =======================
// API ROUTES
// =======================

// GET question
app.get("/api/question", (req, res) => {
  totalCorrect = 0;
  nextQuestion();

  res.json({
    question: currentQuestion,
    totalScore: totalCorrect,
  });
});

// POST answer
app.post("/api/submit", (req, res) => {
  const answer = req.body.answer?.trim() || "";
  let isCorrect = false;

  if (
    currentQuestion.capital.toLowerCase() ===
    answer.toLowerCase()
  ) {
    totalCorrect++;
    isCorrect = true;
  }

  nextQuestion();

  res.json({
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
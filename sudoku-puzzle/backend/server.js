const express = require("express");
const cors = require("cors");
const SudokuGenerator = require("sudoku");

const app = express();
app.use(cors()); // Use cors middleware
app.use(express.json()); // Use express.json() middleware to parse JSON body

const port = 3000;

app.get("/sudoku", (req, res) => {
  const sudoku = SudokuGenerator.makepuzzle();
  const solution = SudokuGenerator.solvepuzzle(sudoku);
  res.json({
    puzzle: sudoku,
    solution: solution,
  });
});

app.post("/check", (req, res) => {
  const { puzzle, userInput, index } = req.body;
  const solution = SudokuGenerator.solvepuzzle(puzzle);
  const isCorrect = solution[index] == userInput - 1;
  res.json({
    isCorrect: isCorrect,
  });
});

app.listen(port, () => {
  console.log(`Sudoku server listening at http://localhost:${port}/sudoku`);
});

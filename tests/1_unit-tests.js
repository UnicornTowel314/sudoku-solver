const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {
  suite("Puzzle String Validation", () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
      let validPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"
      assert.equal(solver.validate(validPuzzle), true);
    });

    test("Logic handles a puzzle string with invalid characters", () => {
      let invalidPuzzle = "1x5xx2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    assert.deepEqual(solver.validate(invalidPuzzle), { "error": "Invalid characters in puzzle" });
    });

    test("Logic handles a puzzle string that is not 81 characters long", () => {
      let invalidPuzzle = "..839.7.575.....96..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
      assert.deepEqual(solver.validate(invalidPuzzle), { error: "Expected puzzle to be 81 characters long" });
    });
  });

  suite("Row Placement Validation", () => {
    test("Logic handles a valid row placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 3;
      assert.equal(solver.checkRowPlacement(puzzle, row, column, value), true);
    });

    test("Logic handles invalid row placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 5;
      assert.equal(solver.checkRowPlacement(puzzle, row, column, value), false);
    });
  });

  suite("Column Placement Validation", () => {
    test("Logic handles a valid column placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 3;
      assert.equal(solver.checkColPlacement(puzzle, row, column, value), true);
    });

    test("Logic handles an invalid column placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 2;
      assert.equal(solver.checkColPlacement(puzzle, row, column, value), false);
    });
  });

  suite("Region Placement Validation", () => {
    test("Logic handles a valid region placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 3;
      assert.equal(solver.checkRegionPlacement(puzzle, row, column, value), true);
    });

    test("Logic handles an invalid region placement", () => {
      let puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
      let row = 0;
      let column = 1;
      let value = 6;
      assert.equal(solver.checkRegionPlacement(puzzle, row, column, value), false);
    });
  });

  suite("Solution Validation", () => {
    test("Valid puzzle strings pass the solver", () => {
      let puzzle = ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6";
      assert.equal(solver.solve(puzzle), "473891265851726394926345817568913472342687951197254638734162589685479123219538746");
    });

    test("Invalid puzzle strings fail the solver", () => {
      let invalidPuzzle = ".7.8x.....5c...3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6";
      assert.equal(solver.solve(invalidPuzzle), false);
    });

    test("Solver returns the expected solution for an incomplete puzzle", () => {
      let puzzle = "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
      assert.equal(solver.solve(puzzle), "827549163531672894649831527496157382218396475753284916962415738185763249374928651");
    });
  });
});

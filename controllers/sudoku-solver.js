class SudokuSolver {
  constructor() {
    this.actualPuzzle = "";
  }
  validate(puzzleString) {
    // Check if puzzleString is 81 characters long
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" }
    }

    // Check for invalid characters in puzzleString
    let regex = /^[0-9.]{81}$/;
    if (!regex.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }else {
      return true;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let checkedRow = puzzleString.slice(row * 9, row * 9 + 9);

    // Check if the value is already in the cell
    if (checkedRow[column] === value) {
      return true;
    }

    // Check if the value is in the row and not in the cell
    if (checkedRow.includes(value) && checkedRow[column] !== value) {
      return false;
    // Check if already filled
    }else if (!checkedRow[column] === ".") {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let checkedCol = "";
    for (let i = 0; i < 9; i++) {
      checkedCol += puzzleString[i * 9 + column];
    }

    // Check if the value is already in cell
    if (checkedCol[row] === value) {
      return true;
    }

    // Check if value is in the column but not the cell
    if (checkedCol.includes(value) && checkedCol[row] !== value) {
      return false;
    // Check if already filled
    }else if (!checkedCol[row] === ".") {
      return false;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let checkedRegion = "";

    // Determine region
    let regionRow = Math.floor(row / 3);
    let regionCol = Math.floor(column / 3);

    // Determine checkedRegion string
    for (let i = regionRow * 3; i < regionRow * 3 + 3; i++) {
      for (let j = regionCol * 3; j < regionCol * 3 + 3; j++) {
        checkedRegion += puzzleString[i * 9 + j];
      }
    }

    let cell = puzzleString[(row) * 9 + column];

    // Check if value is in cell
    if (cell === value) {
      return true;
    }

    // Check if value is in region but not in cell
    if (checkedRegion.includes(value) && cell !== value) {
      return true;
    // Check if already filled
    }else if (!checkedRegion[(row % 3) * 3 + (column % 3)] === ".") {
      return false;
    }

    return true;
  }

  solve(puzzleString) {
    // Check validity of puzzle
    if (this.validate(puzzleString) !== true) {
      console.log("puzzle not valid");
      return false;
    }

    // Check if puzzle stored in actualPuzzle is the same as puzzleString
    if (puzzleString === this.actualPuzzle) {
      console.log("can't be solved");
      return false;
    }

    // Check if puzzle is not solved
    if (puzzleString.includes(".") === true) {
      // Add the puzzleString to the actualPuzzle
      this.actualPuzzle = puzzleString;

      let tempSolution = [];
      for (let i = 0; i < 81; i++) {
        // If the value is not a dot, add it to tempSolution
        if (puzzleString[i] !== ".") {
          tempSolution.push(puzzleString[i]);
        }else {
          let possibleVals = [];
          for (let j = 1; j <= 9; j++) {
            // Check if j is a valid possible value
            if (this.checkRowPlacement(puzzleString, Math.floor(i / 9), i % 9, j.toString()) &&
            this.checkColPlacement(puzzleString, Math.floor(i / 9), i % 9, j.toString()) &&
            this.checkRegionPlacement(puzzleString, Math.floor(i / 9), i % 9, j.toString())) {
              possibleVals.push(j.toString())
            }
          }
          tempSolution.push(possibleVals);
        }
      }

      // Loop through tempSolution, if only one possible value, add it to solvedPuzzle
      for (let k = 0; k < 81; k++) {
        if (tempSolution[k].length === 1) {
          tempSolution[k] = tempSolution[k][0];
        }else {
          tempSolution[k] = ".";
        }
      }

      let newPuzzle = tempSolution.join("");
      return this.solve(newPuzzle);
    }else {
      console.log("puzzle solved >>", puzzleString);

      // Check if rows are valid
      for (let i = 0; i < 9; i++) {
        if (!this.isUnique(puzzleString.substr(i * 9, 9))) {
          console.log("row not valid");
          return false;
        }
      }

      // Check if columns are valid
      for (let j = 0; j < 9; j++) {
        let column = "";
        for (let i = 0; i < 9; i++) {
          column += puzzleString[i * 9 + j];
        }
        if (!this.isUnique(column)) {
          console.log("column not valid");
          return false;
        }
      }

      // Check if regions are valid
      for (let reg = 0; reg < 0; reg++) {
        let box = "";
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            box += puzzleString[Math.floor(reg / 3) * 27 + i * 9 + (reg % 3) * 3 + j];
          }
        }

        if (!this.isUnique(box)) {
          console.log("region not valid");
          return false;
        }
      }

      return puzzleString;
    }
  }
}

module.exports = SudokuSolver;


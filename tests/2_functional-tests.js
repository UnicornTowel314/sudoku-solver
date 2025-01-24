const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test("Solve a puzzle with a valid string", (done) => {
    let validPuzzle = { puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3" };

    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(validPuzzle)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        done();
      });
  });

  test("Solve a puzzle with a missing string", (done) => {
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("Solve a puzzle with invalid characters", (done) => {
    let invalidPuzzle = { puzzle: "x..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...y" }
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(invalidPuzzle)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length", (done) => {
    let invalidPuzzle = { puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72..." }
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(invalidPuzzle)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });

  test("Solve a puzzle that cannot be solved", (done) => {
    let unsolvablePuzzle = { puzzle: "5..97372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...2" }
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(unsolvablePuzzle)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("Check a puzzle placement with all fields", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3",
      value: 8
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test("Check a puzzle placement with a single placement conflict", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3",
      value: 2
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 1);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3",
      value: 3
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 2);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3",
      value: 9
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 3);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3"
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters", (done) => {
    let input = {
      puzzle: "x..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...y",
      coordinate: "A3",
      value: 8
    }
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with incorrect length", (done) => {
    let invalidPuzzle = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...",
      coordinate: "A3",
      value: 8
    }
    chai.request(server)
      .keepOpen()
      .post("/api/solve")
      .send(invalidPuzzle)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "K3",
      value: 8
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value", (done) => {
    let input = {
      puzzle: "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      coordinate: "A3",
      value: 12
    }
    chai.request(server)
      .keepOpen()
      .post("/api/check")
      .send(input)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});


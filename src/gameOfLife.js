const { zipper, validateNeighbours, contains } = require("./gameOfLifeUtil.js");

const findNeighboursOfCell = function(cell, bounds) {
  let xCoordinates = [cell[0] - 1, cell[0], cell[0] + 1];
  let yCoordinates = [cell[1] - 1, cell[1], cell[1] + 1];
  let zip = zipper(yCoordinates);
  let allNeighbours = xCoordinates.reduce(zip, []);
  allNeighbours.splice(4, 1);
  let validateNeighbour = validateNeighbours.bind(null, bounds);
  let allValidNeighbours = allNeighbours.filter(validateNeighbour);
  return allValidNeighbours;
};

const findAllNeighbours = function(bounds) {
  let limits = bounds["bottomRight"].concat(bounds["topLeft"]);
  let allNeighbours = {};
  for (let row = limits[2]; row <= limits[0]; row++) {
    for (let column = limits[3]; column <= limits[1]; column++) {
      allNeighbours["[" + row + ", " + column + "]"] = findNeighboursOfCell(
        [row, column],
        bounds
      );
    }
  }
  return allNeighbours;
};

const calculateAliveNeighboursOfCell = function(
  allNeighbours,
  currentGeneration,
  cell
) {
  let isAlive = contains.bind(null, currentGeneration);
  return allNeighbours[cell].filter(isAlive).length;
};

const aliveNeighboursCalculator = function(allNeighbours, currentGeneration) {
  return function(result, cell) {
    result[cell] = calculateAliveNeighboursOfCell(
      allNeighbours,
      currentGeneration,
      cell
    );
    return result;
  };
};

const calculateAliveNeighbours = function(allNeighbours, currentGeneration) {
  let cells = Object.keys(allNeighbours);
  let aliveNeighboursOfEachCell = aliveNeighboursCalculator(
    allNeighbours,
    currentGeneration
  );
  let neighboursState = cells.reduce(aliveNeighboursOfEachCell, {});
  return neighboursState;
};

const applyRules = function(neighboursState, currentGeneration, cell) {
  let isAlive = neighboursState[cell] === 3;
  isAlive =
    isAlive ||
    (neighboursState[cell] === 2 &&
      contains(currentGeneration, JSON.parse(cell)));
  return isAlive;
};

const nextGeneration = function(currentGeneration, bounds) {
  let allNeighbours = findAllNeighbours(bounds);
  let neighboursState = calculateAliveNeighbours(
    allNeighbours,
    currentGeneration
  );
  let allCells = Object.keys(neighboursState);
  let rulesApplier = applyRules.bind(null, neighboursState, currentGeneration);
  let nextGen = allCells.filter(rulesApplier);
  nextGen = nextGen.map(cell => JSON.parse(cell));
  return nextGen;
};

module.exports = {
  findNeighboursOfCell,
  findAllNeighbours,
  calculateAliveNeighbours,
  nextGeneration
};

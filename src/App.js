import React, { Component } from "react";
import "./App.css";
import GameOfLife from "./gameOfLife";

class Game extends Component {
  constructor(props) {
    super(props);
    this.GameOfLife = GameOfLife;
    this.boundaryLimits = {
      topLeft: [0, 0],
      bottomRight: [this.props.size - 1, this.props.size - 1]
    };
    this.state = { aliveCells: [] };
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.nextGeneration = this.GameOfLife.nextGeneration.bind(this);
    this.getNextGenerationCells = this.getNextGenerationCells.bind(this);
  }

  addAliveCells(id) {
    this.state.aliveCells.push(id.split("_").map(number => +number));
    let element = document.getElementById(id);
    element.style.background = "rgb(3, 5, 117)";
  }

  displayNextGenerationCells(nextGeneration) {
    nextGeneration.forEach(cell => {
      let id = cell.join("_");
      document.getElementById(id).style.background = "rgb(3, 5, 117)";
    });
  }

  removeCurrentGenerationCells() {
    this.state.aliveCells.forEach(cell => {
      let id = cell.join("_");
      document.getElementById(id).style.background = "rgb(231, 236, 247)";
    });
  }

  getNextGenerationCells() {
    let nextGeneration = this.nextGeneration(
      this.state.aliveCells,
      this.boundaryLimits
    );
    this.removeCurrentGenerationCells();
    this.displayNextGenerationCells(nextGeneration);
    this.setState({aliveCells : nextGeneration}
    );

  }

  startGame() {
    this.timerId = setInterval(() => {
      this.getNextGenerationCells();
    }, 500);
  }

  stopGame() {
    clearInterval(this.timerId);
  }

  render() {
    return (
      <main id="mainContainer" className="main-container">
        <GameHeader />
        <CreateTable size={this.props} key="gameTable" game={this} />
        <CreateGameButtons name={this.props} game={this} />
      </main>
    );
  }
}

const GameHeader = function(){
  return (
    <header>
      Game Of Life
    </header>
  );
}

const GenerateColumns = function(props) {
  let columns = [];
  for (let index = 0; index < props.size.size; index++) {
    columns.push(
      <td
        id={props.id + "_" + index}
        key={props.id + "_" + index}
        onClick={props.game.addAliveCells.bind(
          props.game,
          props.id + "_" + index
        )}
      />
    );
  }
  return columns;
};

const GenerateRows = function(props) {
  let rows = [];
  for (let index = 0; index < props.size.size; index++) {
    rows.push(
      <tr id={index} key={index}>
        <GenerateColumns
          size={props.size}
          id={index}
          key={index}
          game={props.game}
        />
      </tr>
    );
  }
  return rows;
};

const CreateTableBody = function(props) {
  return (
    <tbody>
      <GenerateRows size={props.size} key="tableRows" game={props.game} />
    </tbody>
  );
};

const CreateTable = function(props) {
  return (
    <table>
      <CreateTableBody size={props.size} key="tableBody" game={props.game} />
    </table>
  );
};

const CreateButton = function(props) {
  return (
    <button className="game-btn" onClick={props.action}>
      {props.name}
    </button>
  );
};

const CreateGameButtons = function(props) {
  return (
    <div className="btn-container">
      <CreateButton name="START" action={props.game.startGame} />
      <CreateButton name="STOP" action={props.game.stopGame} />
    </div>
  );
};

export default Game;

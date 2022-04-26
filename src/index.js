import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={(props.isWin ? "win " : "") + "square"}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(i, isWin) {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        isWin={isWin}
        // forget to pass the function and it will fire whenever
        // the component renders
        onClick={() => props.onClick(i)}
      />
    );
  }
  return (
    <div>
      {[0,1,2].map((row) =>
        <div className="board-row" key={row}>
          {[0,1,2].map((col) => 
            { 
              const winline=props.winner && props.winner.winline
              const idx = row*3 + col 
              const isWin = winline && winline.includes(idx)
              return renderSquare(idx, isWin)
            }
          )}
        </div>
      )}
    </div>
  );
}

function MovesList(props) {
  const moves = props.history.map((step, move) => {
    const cell = getCell(step.cell)
    const desc = move 
      ? `Go to move # ${move} (${cell.row},${cell.col})`
      : 'Go to game start';
    return (
      <li key={move} className={move === props.stepNumber ? 'current' : ''} >
        <button onClick={() => props.onClick(move)}>
          {desc}
        </button>
      </li>
    );
  })
  return ( <ol>{moves}</ol> )
}

function StatusLine(props) {
  const winner = props.winner
  const filled = props.current.squares.filter((s) => !s).length === 0; 
  const status = (winner 
    ? `Winner is ${winner.winner}!`
    : filled
      ? 'Tie game!'
      : `Next player is ${props.xIsNext ? 'X' : 'O'}`);
  return <div>{status}</div>
}

function Game() {
  function handleClick(i) {
    const hist = history.slice(0, stepNumber+1)
    const current = hist[stepNumber]
    // immutability: replace with new array.
    const squares = [...current.squares];
    // equiv to: const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory( [...hist, {squares: squares, cell: i}] )
    setStepNumber( stepNumber+1 )
    setXIsNext( !xIsNext )
  }

  function jumpTo(move) {
    setXIsNext( !(move % 2) )
    setStepNumber( move )
  }

  const [history, setHistory] = useState(
    [{
      squares: Array(9).fill(null),
      cell: null
    }]
  );
  const [xIsNext, setXIsNext] = useState(true)
  const [stepNumber, setStepNumber] = useState(0)
  const current = history[stepNumber]
  const winner = calculateWinner(current.squares);
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winner={winner}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <StatusLine winner={winner} current={current} xIsNext={xIsNext} />
        <MovesList
          history={history}
          stepNumber={stepNumber}
          onClick={(move) => jumpTo(move)}
        />
      </div>
    </div>
  );
}

function getCell(cell) {
  const row = Math.floor(cell/3) 
  const col = cell - 3*row
  return {'row':row + 1, 'col': col +1}
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {'winner': squares[a], 'winline': line,};
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combination";
import GameOver from "./components/GameOver";
import { array } from "zod";

const PLAYERS={
  X:'Player 1',
  O:'Player 2'
};

const initialGameBoard=[
  [null,null,null],
  [null,null,null],
  [null,null,null]
]

function derivedActivePlayer(gameTurns){
  let currentPlayer='X';
  if(gameTurns.length>0 && gameTurns[0].player==='X'){
    currentPlayer='O';
  }
  return currentPlayer;
}
function derivedWinner(gameBoard,players){
  let winner;

  for(const combination of WINNING_COMBINATIONS){
   const firstSquareSymbol=gameBoard[combination[0].row][combination[0].column];
   const secondSquareSymbol=gameBoard[combination[1].row][combination[1].column];
   const thirdSquareSymbol=gameBoard[combination[2].row][combination[2].column];

   if(firstSquareSymbol && firstSquareSymbol===secondSquareSymbol && firstSquareSymbol===thirdSquareSymbol){
          winner=players[firstSquareSymbol];
   }
  }
  return winner;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for(const turn of gameTurns){ //won't execute if turns is null
    const{square,player}=turn;
    const {row,col}=square;

    gameBoard[row][col]=player;

  }

  return gameBoard;
}

function App() {

  //const [activePlayer,setActivePlayer]=useState('X');
  const[gameTurns,setGameTurns]=useState([]);
  const[players,setPlayers] =useState(PLAYERS);
  // const[hasWinner,setHasWinner]=useState(false);

  const activePlayer=derivedActivePlayer(gameTurns);

  const gameBoard=deriveGameBoard(gameTurns);

  //let gameBoard=[...initialGameBoard.map(array=>[...array])];
 
   const winner=derivedWinner(gameBoard,players);
   
   const hasDraw=gameTurns.length===9 && !winner;

  function handleSelectSquare(rowIndex,colIndex){
    if (gameBoard[rowIndex][colIndex] || winner || hasDraw) {
      return;
    }
    //setActivePlayer((curActivePlayer)=>curActivePlayer==='X' ?'O':'X');
    setGameTurns(prevTurns => {
    // Get the current player
    const currentPlayer = derivedActivePlayer(prevTurns);
      
    // Add the new turn at the beginning of the array
    return [{
      square: { row: rowIndex, col: colIndex },
      player: currentPlayer
    }, ...prevTurns];
  });
  
  }

  function handleRestart(){
    setGameTurns([]);

  }


  function handlePlayerNameChange(symbol,newName){
    setPlayers(prevPlayers =>{
      return {
        ...prevPlayers,
        [symbol]:newName
      };
    });

  }
  return (
    <>
    <div id="game-container">
      <ol id="players" className="highlight-player">
      <Player  name={PLAYERS.X} symbol="O" isActive={activePlayer==='O'} onChangeName={handlePlayerNameChange}/>
       <Player name={PLAYERS.O} symbol="X" isActive={activePlayer==='X'} onChangeName={handlePlayerNameChange} />
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
     <GameBoard onSelectSquare={handleSelectSquare}  turns={gameTurns} board={gameBoard}/>
     <Log turns={gameTurns} />
    </div>
    </>
  )
}

export default App

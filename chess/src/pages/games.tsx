// import { useState } from "react";
import ChessBoard from "../components/ChessBoard";

const Game = () => {
  // const [board, setBoard] = useState(null); // Initialize the game information

  return (
    <div>
      <ChessBoard roomId="my-chess-room" />
    </div>
  );
};

export default Game;

// components/Chessboard.tsx

import React, { useEffect, useRef, useState } from "react";
import { initializeBoard, makeMove } from "../game-logic/chessboard";
import { Piece } from "@/game-logic/types";
import { RenderSquare } from "./Square";
import { getValidMoves } from "@/game-logic/movements";
import { Color, getColorFromString } from "@/game-logic/enums";
import { Rings } from "react-loader-spinner";

const Chessboard: React.FC = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [captures, setCaptures] = useState<[number, number][]>([]);
  const [currentTurn, setCurrentTurn] = useState<Color | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const ws = useRef<WebSocket | null>(null); // Store WebSocket connection reference
  const webSocketUrl = process.env.WEB_SOCKET_URL || "ws://localhost:8080";
  console.log("Web Socket Url: ", webSocketUrl);

  // Connect to WebSocket server and join room
  useEffect(() => {
    const roomId = "my-chess-room"; // You can dynamically generate room ID or pass via props
    ws.current = new WebSocket(webSocketUrl); // Connect to WebSocket server

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      ws.current?.send(
        JSON.stringify({
          type: "joinRoom",
          roomId,
        })
      );
    };

    ws.current.onmessage = (message) => {
      const { type, payload } = JSON.parse(message.data);

      if (type === "welcome") {
        console.log("Welcome Player: ", payload);

        setPlayerColor(getColorFromString(payload));
      }

      if (type === "gameStart") {
        console.log("Game can be started now.");

        setCurrentTurn(getColorFromString(payload) as Color);
      }

      if (type === "move") {
        // Receive opponent's move
        const { from, to } = payload;
        setBoard((prevBoard) => makeMove(prevBoard, from, to));
        setCurrentTurn(currentTurn === Color.Black ? Color.White : Color.Black); // Switch turns
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // Handle move sending to server
  const handleMove = (
    from: { row: number; col: number },
    to: { row: number; col: number }
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "move",
          payload: { from, to },
        })
      );
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (playerColor !== currentTurn) {
      alert("It's not your turn!");
      return;
    }
    if (selectedSquare) {
      // If a square is already selected, attempt to move
      if (
        validMoves.some(([r, c]) => r === row && c === col) ||
        captures.some(([r, c]) => r === row && c === col)
      ) {
        const from = selectedSquare;
        const to = { row, col };
        // Move the piece
        const newBoard = makeMove(board, from, to);
        // const newBoard = [...board];
        // newBoard[row][col] = board[selectedSquare.row][selectedSquare.col];
        // newBoard[selectedSquare.row][selectedSquare.col] = null;
        setBoard(newBoard);

        handleMove(from, to);

        // Deselect the square and clear valid moves
        setSelectedSquare(null);
        setValidMoves([]);
        setCaptures([]);
        setCurrentTurn(currentTurn === Color.White ? Color.Black : Color.White);
      } else {
        // Deselect if the move is invalid
        setSelectedSquare(null);
        setValidMoves([]);
        setCaptures([]);
      }
    } else if (board[row][col]) {
      // Select the square and highlight valid moves
      if (board[row][col].color === currentTurn) {
        setSelectedSquare({ row, col });
        const { moves, captures } = getValidMoves(board, row, col, currentTurn);
        setCaptures(captures);
        setValidMoves(moves);
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        currentTurn !== null
          ? currentTurn === Color.White
            ? "bg-slate-300"
            : "bg-gray-700"
          : "bg-blue-300"
      }`}
    >
      {currentTurn !== null ? (
        <div>
          <h2
            className={`mb-4 text-xl text-center ${
              currentTurn === Color.Black ? "text-slate-300" : "text-gray-700"
            }`}
          >
            Turn: {currentTurn}
          </h2>
          <div className="shadow-2xl">
            <div
              className={`w-96 grid grid-cols-8 grid-rows-8 gap-0 ${
                playerColor === Color.White ? "scale-y-[-1]" : ""
              }`}
            >
              {board.map((row, rowIndex) =>
                row.map((_, colIndex) => (
                  <RenderSquare
                    key={`${rowIndex}-${colIndex}`}
                    board={board}
                    row={rowIndex}
                    col={colIndex}
                    isSelected={
                      selectedSquare?.row === rowIndex &&
                      selectedSquare?.col === colIndex
                    }
                    isValidMove={validMoves.some(
                      ([r, c]) => r === rowIndex && c === colIndex
                    )}
                    isCaptureMove={captures.some(
                      ([r, c]) => r === rowIndex && c === colIndex
                    )}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    playerColor={playerColor as Color}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center align-middle flex-col">
          <Rings wrapperStyle={{ justifyContent: "center" }} color="#FF6D00" />
          <h2 className="text-center text-slate-700 font-bold text-2xl">
            Waiting for other player...
          </h2>
        </div>
      )}
    </div>
  );
};

export default Chessboard;

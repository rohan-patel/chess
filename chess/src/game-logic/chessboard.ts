import { Color, PieceType } from "./enums";
import { Board, Piece } from "./types";

export const initializeBoard = (): Board => {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // White pieces
  board[0] = [
    { type: PieceType.Rook, color: Color.White },
    { type: PieceType.Knight, color: Color.White },
    { type: PieceType.Bishop, color: Color.White },
    { type: PieceType.Queen, color: Color.White },
    { type: PieceType.King, color: Color.White },
    { type: PieceType.Bishop, color: Color.White },
    { type: PieceType.Knight, color: Color.White },
    { type: PieceType.Rook, color: Color.White },
  ];
  board[1] = Array(8).fill({ type: PieceType.Pawn, color: Color.White });

  // Black pieces
  board[7] = [
    { type: PieceType.Rook, color: Color.Black },
    { type: PieceType.Knight, color: Color.Black },
    { type: PieceType.Bishop, color: Color.Black },
    { type: PieceType.Queen, color: Color.Black },
    { type: PieceType.King, color: Color.Black },
    { type: PieceType.Bishop, color: Color.Black },
    { type: PieceType.Knight, color: Color.Black },
    { type: PieceType.Rook, color: Color.Black },
  ];
  board[6] = Array(8).fill({ type: PieceType.Pawn, color: Color.Black });
  // board[4][1] = { type: PieceType.Pawn, color: Color.Black };
  // board[4][4] = { type: PieceType.King, color: Color.Black };
  board[3][3] = { type: PieceType.King, color: Color.White };
  board[2][5] = { type: PieceType.Knight, color: Color.White };
  board[2][7] = { type: PieceType.Bishop, color: Color.White };
  board[4][2] = { type: PieceType.Bishop, color: Color.White };
  board[5][1] = { type: PieceType.Bishop, color: Color.Black };

  return board;
};

export const makeMove = (
  board: (Piece | null)[][],
  from: { row: number; col: number },
  to: { row: number; col: number }
): (Piece | null)[][] => {
  const newBoard = board.map((row) => row.slice()); // Create a deep copy of the board

  // Move the piece
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;

  return newBoard;
};

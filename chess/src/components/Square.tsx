// components/Square.tsx

import Image, { StaticImageData } from "next/image";
import BishopBlack from "../public/assets/chess_pieces/bishop_black.svg";
import BishopWhite from "../public/assets/chess_pieces/bishop_white.svg";
import RookBlack from "../public/assets/chess_pieces/rook_black.svg";
import RookWhite from "../public/assets/chess_pieces/rook_white.svg";
import KingBlack from "../public/assets/chess_pieces/king_black.svg";
import KingWhite from "../public/assets/chess_pieces/king_white.svg";
import KnightBlack from "../public/assets/chess_pieces/knight_black.svg";
import KnightWhite from "../public/assets/chess_pieces/knight_white.svg";
import QueenBlack from "../public/assets/chess_pieces/queen_black.svg";
import QueenWhite from "../public/assets/chess_pieces/queen_white.svg";
import PawnBlack from "../public/assets/chess_pieces/pawn_dark.svg";
import PawnWhite from "../public/assets/chess_pieces/pawn_white.svg";
import { Piece } from "@/game-logic/types";
import { Color } from "@/game-logic/enums";

const pieceToSvg: Record<string, StaticImageData> = {
  PawnWhite: PawnWhite,
  PawnBlack: PawnBlack,
  KnightWhite: KnightWhite,
  KnightBlack: KnightBlack,
  BishopWhite: BishopWhite,
  BishopBlack: BishopBlack,
  RookWhite: RookWhite,
  RookBlack: RookBlack,
  QueenWhite: QueenWhite,
  QueenBlack: QueenBlack,
  KingWhite: KingWhite,
  KingBlack: KingBlack,
};

interface SquareProps {
  board: (Piece | null)[][];
  row: number;
  col: number;
  isSelected: boolean;
  isValidMove: boolean;
  isCaptureMove: boolean;
  onClick: () => void;
  playerColor: Color;
}

export function RenderSquare({
  board,
  row,
  col,
  isSelected,
  isValidMove,
  isCaptureMove,
  onClick,
  playerColor,
}: SquareProps) {
  const piece = board[row][col];
  const isDarkSquare = (row + col) % 2 === 1;

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex items-center justify-center aspect-square overflow-hidden group 
        ${
          isCaptureMove
            ? "bg-capture-outer"
            : isSelected
            ? "bg-selected-square"
            : isDarkSquare
            ? "bg-light-square"
            : "bg-dark-square"
        } 
        ${isValidMove ? "hover:bg-valid-move-square" : ""} 
        `}
    >
      {isValidMove && (
        <div className="absolute w-1/4 h-1/4 bg-valid-move rounded-full group-hover:hidden"></div>
      )}
      {isCaptureMove && (
        <div
          className="absolute rounded-full bg-capture-inner"
          style={{ width: "115%", height: "115%" }}
        ></div>
      )}
      {piece && (
        <span
          className={`z-10 ${
            playerColor === Color.White ? "scale-y-[-1]" : ""
          }`}
        >
          <Image
            src={pieceToSvg[`${piece.type}${piece.color}`]}
            alt={`${piece.color} ${piece.type}`}
            className="w-10 h-10"
          />
        </span>
      )}
    </div>
  );
}

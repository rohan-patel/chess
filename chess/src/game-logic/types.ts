import { Color, PieceType } from "./enums";

export interface Piece {
  type: PieceType;
  color: Color;
}

export type Board = (Piece | null)[][];

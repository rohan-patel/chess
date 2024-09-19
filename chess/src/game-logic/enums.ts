export enum PieceType {
  Pawn = "Pawn",
  Rook = "Rook",
  Knight = "Knight",
  Bishop = "Bishop",
  Queen = "Queen",
  King = "King",
}

export enum Color {
  White = "White",
  Black = "Black",
}

export const getColorFromString = (color: string) => {
  if (color.toLowerCase() === "black") {
    return Color.Black;
  } else if (color.toLowerCase() === "white") {
    return Color.White;
  } else return null;
};

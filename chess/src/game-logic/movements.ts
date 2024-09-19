import { Color, PieceType } from "./enums";
import { Piece } from "./types";

function getValidMovesForPiece(
  board: (Piece | null)[][],
  row: number,
  col: number
): { moves: [number, number][]; captures: [number, number][] } {
  const piece = board[row][col];

  if (!piece) return { moves: [], captures: [] };

  switch (piece.type) {
    case PieceType.Pawn:
      return getPawnMoves(board, row, col, piece.color);
    case PieceType.Rook:
      return getRookMoves(board, row, col, piece.color);
    case PieceType.Knight:
      return getKnightMoves(board, row, col, piece.color);
    case PieceType.Bishop:
      return getBishopMoves(board, row, col, piece.color);
    case PieceType.Queen:
      return getQueenMoves(board, row, col, piece.color);
    case PieceType.King:
      return getKingMoves(board, row, col, piece.color);
    default:
      return { moves: [], captures: [] };
  }
}

export function getValidMoves(
  board: (Piece | null)[][],
  row: number,
  col: number,
  currentTurn: Color
): { moves: [number, number][]; captures: [number, number][] } {
  const piece = board[row][col];
  if (!piece || piece.color !== currentTurn) return { moves: [], captures: [] };

  const kingIsInCheck = isKingInCheck(board, currentTurn);
  console.log("kingIsInCheck: ", kingIsInCheck);

  const validMovesAndCaptures = getValidMovesForPiece(board, row, col);

  if (kingIsInCheck) {
    const validMoves = validMovesAndCaptures.moves.filter(
      ([targetRow, targetCol]) => {
        const simulatedBoard = deepCopyBoard(board);
        simulatedBoard[targetRow][targetCol] = simulatedBoard[row][col];
        simulatedBoard[row][col] = null;

        return !isKingInCheck(simulatedBoard, currentTurn); // Only allow moves that resolve the check
      }
    );
    const validCaptures = validMovesAndCaptures.captures.filter(
      ([targetRow, targetCol]) => {
        const simulatedBoard = deepCopyBoard(board);
        simulatedBoard[targetRow][targetCol] = simulatedBoard[row][col];
        simulatedBoard[row][col] = null;

        return !isKingInCheck(simulatedBoard, currentTurn); // Only allow moves that resolve the check
      }
    );
    return { moves: validMoves, captures: validCaptures };
  }
  console.log("king is not in check");

  return validMovesAndCaptures;
}

const getPawnMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const moves: [number, number][] = [];
  const captures: [number, number][] = [];
  const direction = color === Color.White ? 1 : -1;

  if (!board[row + direction][col]) {
    moves.push([row + direction, col]);

    const startRow = color === Color.White ? 1 : 6;
    if (row === startRow && !board[row + 2 * direction][col]) {
      moves.push([row + 2 * direction, col]);
    }
  }
  if (
    board[row + direction][col + direction] &&
    board[row + direction][col + direction]?.color !== color
  ) {
    captures.push([row + direction, col + direction]);
  }
  if (
    board[row + direction][col - direction] &&
    board[row + direction][col - direction]?.color !== color
  ) {
    captures.push([row + direction, col - direction]);
  }
  return { moves, captures };
};

const getRookMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const captures: [number, number][] = [];
  const moves: [number, number][] = [];
  const possibleMoves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (let index = 0; index < possibleMoves.length; index++) {
    const directions = possibleMoves[index];
    for (
      let i = row + directions[0], j = col + directions[1];
      i >= 0 &&
      i < 8 &&
      j >= 0 &&
      j < 8 &&
      (board[i][j] === null || board[i][j]?.color !== color);
      i = i + directions[0], j = j + directions[1]
    ) {
      if (board[i][j] && board[i][j]?.color !== color) {
        captures.push([i, j]);
        break;
      } else {
        moves.push([i, j]);
      }
    }
  }
  return { moves, captures };
};

const getKnightMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const captures: [number, number][] = [];
  const moves: [number, number][] = [];
  const possibleMoves = [
    [-2, 1],
    [-1, 2],
    [-1, -2],
    [-2, -1],
    [2, 1],
    [1, 2],
    [1, -2],
    [2, -1],
  ];
  for (let index = 0; index < possibleMoves.length; index++) {
    const directions = possibleMoves[index];
    const i = row + directions[0];
    const j = col + directions[1];
    if (
      i >= 0 &&
      i < 8 &&
      j >= 0 &&
      j < 8 &&
      (board[i][j] === null || board[i][j]?.color !== color)
    ) {
      if (board[i][j] && board[i][j]?.color !== color) {
        captures.push([i, j]);
      } else {
        moves.push([i, j]);
      }
    }
  }
  return { moves, captures };
};

const getBishopMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const captures: [number, number][] = [];
  const moves: [number, number][] = [];
  const possibleMoves = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ];
  for (let index = 0; index < possibleMoves.length; index++) {
    const directions = possibleMoves[index];
    for (
      let i = row + directions[0], j = col + directions[1];
      i >= 0 &&
      i < 8 &&
      j >= 0 &&
      j < 8 &&
      (board[i][j] === null || board[i][j]?.color !== color);
      i = i + directions[0], j = j + directions[1]
    ) {
      if (board[i][j] && board[i][j]?.color !== color) {
        captures.push([i, j]);
        break;
      } else {
        moves.push([i, j]);
      }
    }
  }
  return { moves, captures };
};

const getQueenMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const captures: [number, number][] = [];
  const moves: [number, number][] = [];
  const possibleMoves = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (let index = 0; index < possibleMoves.length; index++) {
    const directions = possibleMoves[index];
    for (
      let i = row + directions[0], j = col + directions[1];
      i >= 0 &&
      i < 8 &&
      j >= 0 &&
      j < 8 &&
      (board[i][j] === null || board[i][j]?.color !== color);
      i = i + directions[0], j = j + directions[1]
    ) {
      if (board[i][j] && board[i][j]?.color !== color) {
        captures.push([i, j]);
        break;
      } else {
        moves.push([i, j]);
      }
    }
  }
  return { moves, captures };
};

const getKingMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  color: Color
) => {
  const captures: [number, number][] = [];
  const moves: [number, number][] = [];
  const piece = board[row][col];
  const possibleMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let index = 0; index < possibleMoves.length; index++) {
    const directions = possibleMoves[index];
    const i = row + directions[0];
    const j = col + directions[1];
    if (
      i >= 0 &&
      i < 8 &&
      j >= 0 &&
      j < 8 &&
      (board[i][j] === null || board[i][j]?.color !== color)
    ) {
      const opponentsValidMoves = getAllValidMoves(
        board,
        piece?.color === Color.Black ? Color.White : Color.Black
      );

      if (board[i][j] && board[i][j]?.color !== color) {
        const newBoard = deepCopyBoard(board);
        newBoard[i][j] = null;
        const opponentValidCaptures = getAllValidMoves(
          newBoard,
          piece?.color === Color.Black ? Color.White : Color.Black
        );
        if (!opponentValidCaptures.some(([r, c]) => r === i && c === j)) {
          captures.push([i, j]);
        }
      } else {
        if (!opponentsValidMoves.some(([r, c]) => r === i && c === j)) {
          moves.push([i, j]);
        }
      }
    }
  }
  return { moves, captures };
};

const getAllValidMoves = (
  board: (Piece | null)[][],
  color: Color
): [number, number][] => {
  const validMoves: [number, number][] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        // console.log("Piece: ", piece.type);
        const { moves } = getValidMovesForPiece(board, row, col);
        // console.log("Moves: ", moves);

        validMoves.push(...moves);
      }
    }
  }
  return validMoves;
};

const getAllCaptureMoves = (
  board: (Piece | null)[][],
  color: Color
): [number, number][] => {
  const validCaptures: [number, number][] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        // console.log("Piece: ", piece.type);
        const { captures } = getValidMovesForPiece(board, row, col);
        // console.log("Moves: ", captures);

        validCaptures.push(...captures);
      }
    }
  }
  return validCaptures;
};

const deepCopyBoard = (board: (Piece | null)[][]): (Piece | null)[][] => {
  return board.map(
    (row) => row.map((piece) => (piece ? { ...piece } : null)) // Create a new object for each piece
  );
};

const findKingPoistion = (
  board: (Piece | null)[][],
  color: Color
): [number, number] => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j]?.type === PieceType.King && board[i][j]?.color === color)
        return [i, j];
    }
  }
  return [0, 0];
};

export const isKingInCheck = (
  board: (Piece | null)[][],
  color: Color
): boolean => {
  const opponentsColor = color === Color.Black ? Color.White : Color.Black;
  console.log("opponentsColor: ", opponentsColor);

  const kingPosition = findKingPoistion(board, color);

  console.log("King Position: ", kingPosition);

  const oppoentsValidMoves = getAllCaptureMoves(board, opponentsColor);
  console.log("oppoentsValidMoves", oppoentsValidMoves);

  return oppoentsValidMoves.some(
    ([r, c]) => r === kingPosition[0] && c === kingPosition[1]
  );
};

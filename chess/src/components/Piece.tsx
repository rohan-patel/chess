import React from 'react';

interface PieceProps {
  type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  color: 'white' | 'black';
}

const Piece: React.FC<PieceProps> = ({ type, color }) => {
    const pieceImage = `${type}_${color}.png`;
  
    return (
      <img
        src={require(`../pieces/${pieceImage}`)}
        alt={`${type} ${color}`}
        className="w-full h-full"
      />
    );
  };
  
  export default Piece;
  
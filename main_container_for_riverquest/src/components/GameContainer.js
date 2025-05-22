import React from 'react';
import Shore from './Shore';
import River from './River';
import Boat from './Boat';
import useGameLogic from '../hooks/useGameLogic';

/**
 * Main container for the RiverQuest game
 * 
 * @returns {JSX.Element} GameContainer component
 */
const GameContainer = () => {
  // Game logic and state
  const {
    characters,
    boat,
    moveCount,
    gameStatus,
    leftShoreCharacters,
    rightShoreCharacters,
    moveToBoat,
    moveToShore,
    moveBoat,
    resetGame
  } = useGameLogic();

  // Handle character selection
  const handleCharacterSelect = (characterId) => {
    const character = characters.find(c => c.id === characterId);
    
    if (!character) return;
    
    if (character.location === boat.location) {
      // Character is on shore, try to move to boat
      moveToBoat(characterId);
    } else if (character.location === 'boat') {
      // Character is in boat, move to shore
      moveToShore(characterId);
    }
  };

  // Status message based on game status
  let statusMessage = `Moves: ${moveCount}`;
  if (gameStatus === 'won') {
    statusMessage = `You won in ${moveCount} moves!`;
  } else if (gameStatus === 'lost') {
    statusMessage = 'Game over! Constraints violated.';
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>RiverQuest: The Strategic Crossing</h1>
        <div className="game-status">
          <span>{statusMessage}</span>
          {gameStatus !== 'playing' && (
            <button onClick={resetGame} className="reset-button">
              Play Again
            </button>
          )}
        </div>
      </div>
      
      <div className="game-board">
        {/* Left shore */}
        <Shore 
          side="leftShore" 
          characters={leftShoreCharacters} 
          onSelectCharacter={handleCharacterSelect}
        />
        
        {/* River */}
        <div className="river-section">
          <River />
          <Boat 
            boat={boat} 
            characters={characters}
            onMoveToShore={handleCharacterSelect}
            onMoveBoat={moveBoat}
          />
        </div>
        
        {/* Right shore */}
        <Shore 
          side="rightShore" 
          characters={rightShoreCharacters} 
          onSelectCharacter={handleCharacterSelect}
        />
      </div>
      
      <div className="game-instructions">
        <h2>Rules:</h2>
        <ul>
          <li>Move all characters to the right shore to win.</li>
          <li>The farmer can operate the boat.</li>
          <li>The wolf can't be left alone with the chicken.</li>
          <li>The chicken can't be left alone with the grain.</li>
          <li>The boat can carry up to 2 characters.</li>
        </ul>
      </div>
    </div>
  );
};

export default GameContainer;

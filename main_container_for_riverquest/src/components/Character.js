import React from 'react';

/**
 * Character component that represents a character or object in the game
 * 
 * @param {Object} props - Component props
 * @param {Object} props.character - Character data
 * @param {function} props.onSelect - Function called when character is selected
 * @param {boolean} props.isSelected - Whether the character is selected
 * @param {string} props.location - Where the character is located
 * @returns {JSX.Element} Character component
 */
const Character = ({ character, onSelect, isSelected, location }) => {
  const handleClick = () => {
    onSelect(character.id);
  };

  return (
    <div 
      className={`character ${isSelected ? 'selected' : ''} ${location}`}
      onClick={handleClick}
      title={character.name}
    >
      <div className="character-icon">{character.icon}</div>
      <div className="character-name">{character.name}</div>
    </div>
  );
};

export default Character;

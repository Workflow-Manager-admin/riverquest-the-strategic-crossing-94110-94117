import React from 'react';
import Character from './Character';

/**
 * Shore component representing a bank of the river
 * 
 * @param {Object} props - Component props
 * @param {string} props.side - Which side of the river ('leftShore' or 'rightShore')
 * @param {Array} props.characters - Characters on this shore
 * @param {function} props.onSelectCharacter - Function called when a character is selected
 * @returns {JSX.Element} Shore component
 */
const Shore = ({ side, characters, onSelectCharacter }) => {
  return (
    <div className={`shore ${side}`}>
      <div className="shore-content">
        {characters.map(character => (
          <Character
            key={character.id}
            character={character}
            onSelect={onSelectCharacter}
            location={side}
          />
        ))}
      </div>
      <div className="shore-ground"></div>
    </div>
  );
};

export default Shore;

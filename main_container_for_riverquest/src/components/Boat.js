import React from 'react';
import Character from './Character';

/**
 * Boat component that can transport characters across the river
 * 
 * @param {Object} props - Component props
 * @param {Object} props.boat - Boat state
 * @param {Array} props.characters - Characters in the game
 * @param {function} props.onMoveToShore - Function to move character to shore
 * @param {function} props.onMoveBoat - Function to move the boat
 * @returns {JSX.Element} Boat component
 */
const Boat = ({ boat, characters, onMoveToShore, onMoveBoat }) => {
  // Get characters in the boat
  const boatCharacters = characters.filter(c => c.location === 'boat');
  
  return (
    <div className={`boat ${boat.location}`}>
      <div className="boat-content">
        {/* Render characters in the boat */}
        {boatCharacters.map(character => (
          <Character
            key={character.id}
            character={character}
            onSelect={onMoveToShore}
            location="boat"
          />
        ))}
        
        {/* Empty spots in the boat */}
        {boatCharacters.length < 2 && (
          <div className="boat-empty-spot"></div>
        )}
      </div>
      
      {/* Boat controls */}
      {boatCharacters.some(c => c.canOperateBoat) && boatCharacters.length > 0 && (
        <button 
          className="boat-control" 
          onClick={onMoveBoat}
          aria-label="Move boat"
        >
          {boat.location === 'leftShore' ? 'Cross →' : '← Cross'}
        </button>
      )}
    </div>
  );
};

export default Boat;

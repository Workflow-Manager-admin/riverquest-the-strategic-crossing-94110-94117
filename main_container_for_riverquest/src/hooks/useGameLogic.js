import { useState, useCallback } from 'react';

/**
 * Custom hook for managing RiverQuest game logic
 * 
 * @param {Object} config - Configuration for the game
 * @param {Array} config.initialCharacters - Initial characters in the game
 * @param {number} config.boatCapacity - Maximum capacity of the boat (default: 2)
 * @returns {Object} Game state and methods
 */
const useGameLogic = (config = {}) => {
  const {
    initialCharacters = [
      { id: 'farmer', name: 'Farmer', icon: '👨‍🌾', canOperateBoat: true },
      { id: 'wolf', name: 'Wolf', icon: '🐺', constraints: ['chicken'] },
      { id: 'chicken', name: 'Chicken', icon: '🐔', constraints: ['grain'] },
      { id: 'grain', name: 'Grain', icon: '🌾' },
    ],
    boatCapacity = 2,
  } = config;

  // Game state
  const [characters, setCharacters] = useState(
    initialCharacters.map(char => ({ ...char, location: 'leftShore' }))
  );
  
  const [boat, setBoat] = useState({
    location: 'leftShore', // leftShore or rightShore
    passengers: [],
  });
  
  const [moveCount, setMoveCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

  // Computed properties
  const leftShoreCharacters = characters.filter(c => c.location === 'leftShore');
  const rightShoreCharacters = characters.filter(c => c.location === 'rightShore');
  const boatCharacters = characters.filter(c => c.location === 'boat');
  
  /**
   * Check if there are any constraint violations on a shore
   * 
   * @param {Array} shoreCharacters - Characters on a shore
   * @returns {boolean} True if there are constraint violations
   */
  const checkConstraints = useCallback((shoreCharacters) => {
    // If the farmer is present, constraints don't apply (he manages the animals)
    if (shoreCharacters.some(c => c.id === 'farmer')) {
      return false;
    }
    
    // Check if any character has a constraint that is violated
    for (const character of shoreCharacters) {
      if (character.constraints) {
        for (const constrainedId of character.constraints) {
          if (shoreCharacters.some(c => c.id === constrainedId)) {
            return true; // Constraint violation found
          }
        }
      }
    }
    
    return false; // No constraint violations
  }, []);

  /**
   * Check if the game has been won (all characters on right shore)
   * 
   * @returns {boolean} True if the game is won
   */
  const checkWinCondition = useCallback(() => {
    return characters.every(c => c.location === 'rightShore');
  }, [characters]);

  /**
   * Move a character to the boat if there's space
   * 
   * @param {string} characterId - ID of the character to move
   * @returns {boolean} Success status of the move
   */
  const moveToBoat = useCallback((characterId) => {
    // Validate character exists and is on the same shore as the boat
    const character = characters.find(c => c.id === characterId);
    
    if (!character || character.location !== boat.location || 
        character.location === 'boat' ||
        boat.passengers.length >= boatCapacity) {
      return false;
    }
    
    // Update character location and boat passengers
    setCharacters(prev => 
      prev.map(c => 
        c.id === characterId 
          ? { ...c, location: 'boat' } 
          : c
      )
    );
    
    setBoat(prev => ({
      ...prev,
      passengers: [...prev.passengers, characterId],
    }));
    
    return true;
  }, [boat, characters, boatCapacity]);

  /**
   * Move a character from the boat to the shore
   * 
   * @param {string} characterId - ID of the character to move
   * @returns {boolean} Success status of the move
   */
  const moveToShore = useCallback((characterId) => {
    // Validate character is on the boat
    const character = characters.find(c => c.id === characterId);
    
    if (!character || character.location !== 'boat') {
      return false;
    }
    
    // Update character location and boat passengers
    setCharacters(prev => 
      prev.map(c => 
        c.id === characterId 
          ? { ...c, location: boat.location } 
          : c
      )
    );
    
    setBoat(prev => ({
      ...prev,
      passengers: prev.passengers.filter(id => id !== characterId),
    }));
    
    return true;
  }, [boat, characters]);

  /**
   * Move the boat to the other shore
   * 
   * @returns {boolean} Success status of the move
   */
  const moveBoat = useCallback(() => {
    // Boat needs an operator to move
    const hasBoatOperator = characters.some(
      c => c.location === 'boat' && c.canOperateBoat
    );
    
    if (!hasBoatOperator || boat.passengers.length === 0) {
      return false;
    }
    
    // Move the boat
    const newLocation = boat.location === 'leftShore' ? 'rightShore' : 'leftShore';
    
    setBoat(prev => ({
      ...prev,
      location: newLocation,
    }));
    
    // Update all characters in the boat to the new location
    setCharacters(prev => 
      prev.map(c => 
        c.location === 'boat'
          ? { ...c, location: 'boat' }
          : c
      )
    );
    
    setMoveCount(count => count + 1);
    
    // Check for constraint violations after the move
    setTimeout(() => {
      const newLeftShore = characters.filter(c => c.location === 'leftShore');
      const newRightShore = characters.filter(c => c.location === 'rightShore');
      
      const leftViolation = checkConstraints(newLeftShore);
      const rightViolation = checkConstraints(newRightShore);
      
      if (leftViolation || rightViolation) {
        setGameStatus('lost');
      } else if (checkWinCondition()) {
        setGameStatus('won');
      }
    }, 0);
    
    return true;
  }, [boat, characters, checkConstraints, checkWinCondition]);

  /**
   * Reset the game to its initial state
   */
  const resetGame = useCallback(() => {
    setCharacters(initialCharacters.map(char => ({ ...char, location: 'leftShore' })));
    setBoat({
      location: 'leftShore',
      passengers: [],
    });
    setMoveCount(0);
    setGameStatus('playing');
  }, [initialCharacters]);

  return {
    // State
    characters,
    boat,
    moveCount,
    gameStatus,
    
    // Computed
    leftShoreCharacters,
    rightShoreCharacters,
    boatCharacters,
    
    // Methods
    moveToBoat,
    moveToShore,
    moveBoat,
    resetGame,
  };
};

export default useGameLogic;

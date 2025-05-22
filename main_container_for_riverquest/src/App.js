import React from 'react';
import './App.css';
import GameContainer from './components/GameContainer';

/**
 * Main App component for RiverQuest: The Strategic Crossing
 * 
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">🌊</span> RiverQuest
            </div>
          </div>
        </div>
      </nav>

      <main className="game-main">
        <div className="container">
          <GameContainer />
        </div>
      </main>
    </div>
  );
}

export default App;

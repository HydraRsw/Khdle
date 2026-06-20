import React from 'react';
import './WordleInstructionsModal.css'; // Si prefieres separar sus estilos específicos

function WordleInstructionsModal({ difficulty, setDifficulty, onStartGame }) {
  return (
    <div className="wordle-instructions-overlay">
      <div className="wordle-instructions-modal">
        <h2 className="instructions-title">WORDLE CLÁSICO</h2>
        
        <div className="instructions-body">
          <p>
            Wordle Clásico es un modo de juego donde tendrás que adivinar el nombre exacto 
            del personaje misterioso utilizando códigos de colores en las casillas.
          </p>
          
          <div className="modes-explanation">
            <h4>Hay 2 modalidades disponibles:</h4>
            <ul>
              <li>
                <strong>Modo Normal:</strong> Solo se incluirán en el repertorio personajes originales de Kingdom Hearts.
              </li>
              <li>
                <strong>Modo Difícil:</strong> Se incluirán todos los personajes disponibles en la base de datos (incluyendo invitados).
              </li>
            </ul>
          </div>

          <p className="select-prompt">Selecciona tu modalidad abajo:</p>
          
          <div className="difficulty-selector-buttons">
            <button 
              className={`diff-btn normal-btn ${difficulty === 'normal' ? 'active' : ''}`}
              onClick={() => setDifficulty('normal')}
            >
              Modo Normal (Solo KH)
            </button>
            <button 
              className={`diff-btn hard-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Modo Difícil (Todos)
            </button>
          </div>
        </div>

        <button className="start-wordle-game-btn" onClick={onStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default WordleInstructionsModal;
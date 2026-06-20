import React, { useState, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import GridHeader from './components/GridHeader';
import RowResult from './components/RowResult';
import VictoryModal from './components/VictoryModal';
import ClassicWordle from './components/ClassicWordle'; 
import WordleInstructionsModal from './components/WordleInstructionsModal'; // <-- Nuevo Import
import './App.css';

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [secretCharacter, setSecretCharacter] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);

  const [vistaActual, setVistaActual] = useState(() => {
    const path = window.location.pathname;
    if (path === '/wordle') return 'wordle';
    if (path === '/attribute') return 'atributos';
    return 'menu';
  });

  // ESTADOS PARA EL CONTROL DEL MODAL
  const [showWordleInstructions, setShowWordleInstructions] = useState(false);
  const [wordleDifficulty, setWordleDifficulty] = useState('normal'); 
  const [isWordleGameStarted, setIsWordleGameStarted] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/wordle') {
        setVistaActual('wordle');
      } else if (path === '/attribute') {
        setVistaActual('atributos');
        setIsWordleGameStarted(false);
      } else {
        setVistaActual('menu');
        setIsWordleGameStarted(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navegarA = (ruta, vista) => {
    window.history.pushState({}, '', ruta);
    setVistaActual(vista);
    
    if (vista === 'wordle') {
      setShowWordleInstructions(true);
      setIsWordleGameStarted(false);
      setWordleDifficulty('normal'); 
    }
  };

  const selectRandomCharacter = (lista) => {
    if (lista.length > 0) {
      const randomCharacter = lista[Math.floor(Math.random() * lista.length)];
      setSecretCharacter(randomCharacter);
    }
  };

  useEffect(() => {
    const cacheBuster = `?v=${new Date().getTime()}`;

    fetch(`${import.meta.env.BASE_URL}personajes.json${cacheBuster}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo abrir el archivo personajes.json");
        return res.json();
      })
      .then(data => {
        const cleanData = data.filter(p => p && p.name);
        setPersonajes(cleanData);
        selectRandomCharacter(cleanData);
      })
      .catch(err => console.error("Error fetching JSON data:", err));
  }, []);

  const resetGame = () => {
    setGuesses([]);
    setHasWon(false);
    setHasGivenUp(false);
    selectRandomCharacter(personajes);
  };

  const handleGuess = (character) => {
    if (hasWon || hasGivenUp) return;
    if (guesses.some(g => g.id === character.id)) return;
    
    const updatedGuesses = [character, ...guesses];
    setGuesses(updatedGuesses);

    if (character.name.toLowerCase() === secretCharacter.name.toLowerCase()) {
      setTimeout(() => {
        setHasWon(true);
      }, character.name ? 3200 : 500);
    }
  };

  const isGameOver = hasWon || hasGivenUp;

  return (
    <div className="app-container">
      <header>
        <img 
          src={`${import.meta.env.BASE_URL}logo.png`} 
          alt="KHDle" 
          style={{ cursor: 'pointer' }}
          onClick={() => navegarA('/', 'menu')} 
        />
        {vistaActual === 'menu' && <p>Adivina los elementos del universo de Kingdom Hearts</p>}
      </header>

    {/* ==========================================================================
    VISTA 1: MENÚ HOME SELECCIÓN DE JUEGO (ESTILO PREMIUM LOLDLE)
    ========================================================================== */}
{vistaActual === 'menu' && (
  <div className="kh-menu-wrapper">
    <div className="kh-menu-list">
      
      {/* MODO A: ATRIBUTOS */}
      <div className="kh-menu-row" onClick={() => navegarA('/attribute', 'atributos')}>
        <div className="kh-menu-circle-icon">
          {/* Deja este img para tu icono/imagen circular dorado del signo de interrogación */}
          <img src={`${import.meta.env.BASE_URL}icon-atributos.png`} alt="Icono Atributos" onError={(e) => e.target.style.display = 'none'} />
          <span className="kh-fallback-emoji">❓</span>
        </div>
        <div className="kh-menu-badge-content">
          <h3>Modo Atributos</h3>
          <p>Consigue pistas de origen, arma, debut y alineación con cada intento.</p>
        </div>
      </div>

      {/* MODO B: WORDLE CLÁSICO */}
      <div className="kh-menu-row" onClick={() => navegarA('/wordle', 'wordle')}>
        <div className="kh-menu-circle-icon">
          {/* Deja este img para tu icono/imagen circular dorado del modo Wordle */}
          <img src={`${import.meta.env.BASE_URL}icon-wordle.png`} alt="Icono Wordle" onError={(e) => e.target.style.display = 'none'} />
          <span className="kh-fallback-emoji">📝</span>
        </div>
        <div className="kh-menu-badge-content">
          <h3>Wordle Clásico</h3>
          <p>Adivina el nombre exacto del personaje usando el código de colores.</p>
        </div>
      </div>

    </div>
  </div>
)}

   {/* ==========================================================================
          VISTA 2: JUEGO ORIGINAL POR ATRIBUTOS
          ========================================================================== */}
      {vistaActual === 'atributos' && (
        <div className="game-layout">
          <h2 className="game-subtitle">GUESS THE KINGDOM HEARTS CHARACTER OF THE DAY!</h2>
          
          {!isGameOver && (
            <div className="search-and-actions-wrapper">
              <SearchBox personajes={personajes} onGuess={handleGuess} guesses={guesses} />
              <button className="give-up-btn" onClick={() => setHasGivenUp(true)}>
                Give Up
              </button>
            </div>
          )}
          
          {/* MODAL DE VICTORIA SUPERPUESTO */}
{hasWon && secretCharacter && (
  <div className="victory-container">
    <div>
      <h2 className="victory-title">VICTORY!</h2>
      <div className="victory-card-info">
        <img 
          className="victory-character-img"
          src={
            secretCharacter.image.startsWith('http')
              ? secretCharacter.image
              : `${import.meta.env.BASE_URL}${secretCharacter.image}`
          } 
          alt={secretCharacter.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/100?text=KH';
          }} 
        />
        <div className="victory-details">
          <p className="victory-text-sub">You Guessed</p>
          <h3 className="victory-character-name">{secretCharacter.name}</h3>
        </div>
      </div>
      <p className="victory-stats">
        Attempts: <span className="highlight-attempts">{guesses.length}</span>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <button onClick={resetGame}>Try Again</button>
        <button className="go-home-gray" onClick={() => navegarA('/', 'menu')}>Go Home</button>
      </div>
    </div>
  </div>
)}

       {/* MODAL DE DERROTA SUPERPUESTO */}
{hasGivenUp && secretCharacter && (
  <div className="defeat-box">
    <div>
      <h2>GAME OVER</h2>
      <p className="defeat-subtext">The secret character was:</p>
      
      <img 
        src={
          secretCharacter.image.startsWith('http')
            ? secretCharacter.image
            : `${import.meta.env.BASE_URL}${secretCharacter.image}`
        } 
        alt={secretCharacter.name} 
        onError={(e) => {
          e.target.onerror = null; // Evita bucle infinito si la imagen comodín también falla
          e.target.src = 'https://via.placeholder.com/100?text=KH';
        }} 
      />
      
      <h3>{secretCharacter.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
        <button className="play-again-blue" onClick={resetGame}>Try Again</button>
        <button className="go-home-gray" onClick={() => navegarA('/', 'menu')}>Go Home</button>
      </div>
    </div>
  </div>
)}
          <div className="game-grid">
            <GridHeader />
            <div className="rows-container">
              {guesses.map((guess, idx) => (
                <RowResult key={`${guess.id}-${guesses.length - idx}`} guess={guess} secret={secretCharacter} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: MODO WORDLE CLÁSICO */}
      {vistaActual === 'wordle' && (
        <div className="game-layout">
          
          {/* Llamada limpia al componente del Modal */}
          {showWordleInstructions && (
            <WordleInstructionsModal 
              difficulty={wordleDifficulty}
              setDifficulty={setWordleDifficulty}
              onStartGame={() => {
                setShowWordleInstructions(false);
                setIsWordleGameStarted(true);
              }}
            />
          )}

          {/* Carga del juego autónomo */}
          {isWordleGameStarted && (
            <ClassicWordle difficulty={wordleDifficulty} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
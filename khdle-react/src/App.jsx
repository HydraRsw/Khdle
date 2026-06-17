import React, { useState, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import GridHeader from './components/GridHeader';
import RowResult from './components/RowResult';
import VictoryModal from './components/VictoryModal'; // Importamos el nuevo componente
import './App.css';

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [secretCharacter, setSecretCharacter] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false); // Estado para controlar la victoria
  const [hasGivenUp, setHasGivenUp] = useState(false); // Estado para controlar la rendición

  // Función separada para elegir un personaje al azar de la lista
  const selectRandomCharacter = (lista) => {
    if (lista.length > 0) {
      const randomCharacter = lista[Math.floor(Math.random() * lista.length)];
      setSecretCharacter(randomCharacter);
      console.log("Shhh... The secret character is:", randomCharacter.name);
    }
  };

  useEffect(() => {
    // Le agregamos un número único basado en el tiempo (?v=12345678)
    const cacheBuster = `?v=${new Date().getTime()}`;

    fetch(`${import.meta.env.BASE_URL}personajes.json${cacheBuster}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo abrir el archivo personajes.json");
        return res.json();
      })
      .then(data => {
        const cleanData = data.filter(p => p && p.name);
        setPersonajes(cleanData);
        selectRandomCharacter(cleanData); // Selecciona el primer personaje
      })
      .catch(err => console.error("Error fetching JSON data:", err));
  }, []);

  // Función para Reiniciar el Juego (Resetear todos los estados)
  const resetGame = () => {
    setGuesses([]);
    setHasWon(false);
    setHasGivenUp(false);
    selectRandomCharacter(personajes); // Elige un nuevo personaje aleatorio
  };

  const handleGuess = (character) => {
    if (hasWon || hasGivenUp) return; // Bloquear más intentos si ya ganó o se rindió
    if (guesses.some(g => g.id === character.id)) return;
    
    const updatedGuesses = [character, ...guesses];
    setGuesses(updatedGuesses);

    // Si el nombre coincide con el personaje misterioso, se activa la victoria
    if (character.name.toLowerCase() === secretCharacter.name.toLowerCase()) {
      // Un pequeño retraso para permitir que se terminen de revelar las cartas antes del mensaje
      setTimeout(() => {
        setHasWon(true);
      }, character.name ? 3200 : 500); // Ajustado al delay de la cascada de las cartas
    }
  };

  // El juego termina si el usuario gana o se rinde
  const isGameOver = hasWon || hasGivenUp;

  return (
    <div className="app-container">
      <header>
        <h1>KHDle</h1>
        <p>Guess the Kingdom Hearts character of the day!</p>
      </header>

      {/* Le pasamos guesses al buscador */}
{!isGameOver && (
  <div className="search-and-actions-wrapper">
    <SearchBox personajes={personajes} onGuess={handleGuess} guesses={guesses} />
    <button className="give-up-btn" onClick={() => setHasGivenUp(true)}>
      Give Up
    </button>
  </div>
)}
      
      {/* Componente de Victoria al estilo Loldle (Le pasamos resetGame para su botón) */}
      {hasWon && secretCharacter && (
        <VictoryModal 
          secret={secretCharacter} 
          attempts={guesses.length} 
          onTryAgain={resetGame} // Se lo pasamos como prop a tu modal
        />
      )}

      {/* Pantalla de Derrota/Rendición si presiona Give Up */}
      {hasGivenUp && secretCharacter && (
        <div className="defeat-box">
          <h2>YOU GAVE UP</h2>
          <p className="defeat-subtext">The secret character was:</p>
          <img 
            src={secretCharacter.image} 
            alt={secretCharacter.name} 
            onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=KH'} 
          />
          <h3>{secretCharacter.name}</h3>
          <button className="try-again-btn" onClick={resetGame}>
            Try Again
          </button>
        </div>
      )}

      <div className="game-grid">
        <GridHeader />
        <div className="rows-container">
          {guesses.map((guess, idx) => (
            <RowResult 
              key={`${guess.id}-${guesses.length - idx}`} 
              guess={guess} 
              secret={secretCharacter} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
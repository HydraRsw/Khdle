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

useEffect(() => {
  // import.meta.env.BASE_URL le dice a React automáticamente si está en localhost o en /Khdle/
  fetch(`${import.meta.env.BASE_URL}personajes.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error("No se pudo abrir el archivo personajes.json");
      }
      return res.json();
    })
    .then(data => {
      const cleanData = data.filter(p => p && p.name);
      setPersonajes(cleanData);
      
      if (cleanData.length > 0) {
        const randomCharacter = cleanData[Math.floor(Math.random() * cleanData.length)];
        setSecretCharacter(randomCharacter);
        console.log("Shhh... The secret character is:", randomCharacter.name);
      }
    })
    .catch(err => console.error("Error fetching JSON data:", err));
}, []);
  const handleGuess = (character) => {
    if (hasWon) return; // Si ya ganó, bloquear más intentos
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

  return (
    <div className="app-container">
      <header>
        <h1>KHDle</h1>
        <p>Guess the Kingdom Hearts character of the day!</p>
      </header>

      {/* Ocultar la barra de búsqueda si el jugador ya ganó */}
      {!hasWon && <SearchBox personajes={personajes} onGuess={handleGuess} />}
      
      {/* Componente de Victoria al estilo Loldle */}
      {hasWon && secretCharacter && (
        <VictoryModal 
          secret={secretCharacter} 
          attempts={guesses.length} 
        />
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
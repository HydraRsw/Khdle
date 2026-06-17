import React, { useState } from "react";

// Recibimos 'guesses' aquí (por defecto un arreglo vacío si no viene nada)
function SearchBox({ personajes, onGuess, guesses = [] }) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // FILTRO MEJORADO: 
  // 1. Revisa si el nombre incluye lo escrito.
  // 2. Revisa que el personaje NO esté ya dentro de la lista de intentos (guesses).
  const filtrados = personajes.filter((p) =>
    p.name.toLowerCase().includes(input.toLowerCase()) &&
    !guesses.some((g) => g.id === p.id)
  );

  const handleSelect = (personaje) => {
    onGuess(personaje);
    setInput("");
    setIsOpen(false);
  };

  return (
    <div className="search-container">
      <div className="search-input-row">
        <input
          type="text"
          placeholder="Escribe el nombre de un personaje..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => input.length > 0 && setIsOpen(true)}
        />
        <button
          onClick={() => filtrados.length > 0 && handleSelect(filtrados[0])}
        >
          Guess
        </button>
      </div>

      {isOpen && filtrados.length > 0 && (
        <ul className="suggestions-list">
          {filtrados.map((p) => (
            <li key={p.id} onClick={() => handleSelect(p)}>
              <img 
                src={p.image && p.image.startsWith('http') ? `https://images.weserv.nl/?url=${p.image}` : `${import.meta.env.BASE_URL}${p.image || ''}`} 
                alt={p.name} 
                className="dropdown-avatar"
                onError={(e) => e.target.src = 'https://via.placeholder.com/40?text=KH'}
              />
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;
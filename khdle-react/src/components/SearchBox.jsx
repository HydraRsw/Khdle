import React, { useState, useEffect, useRef } from 'react';

function SearchBox({ personajes, onGuess }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);

  // Manejar el cambio del input y aplicar el filtro startsWith
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const normalValue = value.trim().toLowerCase();
    if (!normalValue) {
      setSuggestions([]);
      return;
    }

    // Filtramos estrictamente los personajes que EMPIECEN con la letra/letras
    const filtered = personajes.filter(p => 
      p.name.toLowerCase().startsWith(normalValue)
    );
    setSuggestions(filtered);
  };

  const selectCharacter = (personaje) => {
    setInputValue('');
    setSuggestions([]);
    onGuess(personaje);
  };

  // Cerrar el dropdown si el usuario hace clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={dropdownRef}>
      <div className="input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type character name..."
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div className="autocomplete-items">
            {suggestions.map((p) => (
              <div 
                key={p.id} 
                className="autocomplete-item"
                onClick={() => selectCharacter(p)}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=KH'} 
                />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => {
        const exactMatch = personajes.find(p => p.name.toLowerCase() === inputValue.trim().toLowerCase());
        if (exactMatch) selectCharacter(exactMatch);
      }}>Guess</button>
    </div>
  );
}

export default SearchBox;
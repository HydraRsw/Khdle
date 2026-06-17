import React, { useState } from "react";

function SearchBox({ personajes, onGuess }) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // CORRECCIÓN AQUÍ: Filtramos si el nombre INCLUYE el texto escrito en cualquier parte
  const filtrados = personajes.filter((p) =>
    p.name.toLowerCase().includes(input.toLowerCase()),
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
                src={
                  p.image.startsWith("http")
                    ? `https://images.weserv.nl/?url=${p.image}`
                    : `${import.meta.env.BASE_URL}${p.image}`
                }
                alt={p.name}
                className="dropdown-avatar"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/40?text=KH")
                }
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

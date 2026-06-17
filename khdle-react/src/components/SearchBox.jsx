import React, { useState, useEffect, useRef } from "react";

function SearchBox({ personajes, onGuess, guesses = [] }) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Creamos una referencia para el contenedor del buscador
  const searchRef = useRef(null);

  // Filtro de personajes (excluyendo los que ya fueron arriesgados)
  const filtrados = personajes.filter((p) =>
    p.name.toLowerCase().includes(input.toLowerCase()) &&
    !guesses.some((g) => g.id === p.id)
  );

  // 2. Efecto para escuchar los clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si la referencia existe y el lugar donde se hizo clic NO está dentro del buscador...
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false); // Cerramos las sugerencias
      }
    };

    // Escuchamos los clics en todo el documento
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpiamos el evento cuando el componente se desmonte para evitar fugas de memoria
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (personaje) => {
    onGuess(personaje);
    setInput("");
    setIsOpen(false);
  };

  return (
    /* 3. Le asignamos la referencia al div contenedor principal */
    <div className="search-container" ref={searchRef}>
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
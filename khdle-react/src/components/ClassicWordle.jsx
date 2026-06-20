import React, { useState, useEffect } from 'react';

// Estructura de las filas del teclado virtual (QWERTY)
const TECLADO_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BKSP']
];

export default function ClassicWordle() {
  const [listaPersonajes, setListaPersonajes] = useState([]);
  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [largoPalabra, setLargoPalabra] = useState(0);
  
  const [intentos, setIntentos] = useState(Array(6).fill(''));
  const [intentoActual, setIntentoActual] = useState(0);
  const [textoActual, setTextoActual] = useState('');
  
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [resultado, setResultado] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Cargar por defecto el modo Normal al entrar
  useEffect(() => {
    cargarDificultad('personajes_kh.json');
  }, []);

  const cargarDificultad = (archivoJson) => {
     fetch(`${import.meta.env.BASE_URL}personajeskh.json?v=${new Date().getTime()}`) 
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data.filter((p) => p && p.name && p.name.length >= 3 && p.name.length <= 6);
        setListaPersonajes(cleanData);
        
        if (cleanData.length > 0) {
          const aleatorio = cleanData[Math.floor(Math.random() * cleanData.length)];
          const nombreLimpio = aleatorio.name.toUpperCase();
          setPalabraSecreta(nombreLimpio);
          setLargoPalabra(nombreLimpio.length);
        }
        
        setIntentos(Array(6).fill(''));
        setIntentoActual(0);
        setTextoActual('');
        setJuegoTerminado(false);
        setResultado('');
        setErrorMsg('');
      })
      .catch((err) => console.error("Error cargando JSON en Wordle:", err));
  };

  // Mapear el estado actual de cada letra del alfabeto para pintar el teclado
  const obtenerEstadoLetrasTeclado = () => {
    const mapeoEstados = {};

    intentos.forEach((intento, filaIndex) => {
      if (filaIndex >= intentoActual) return;

      for (let i = 0; i < intento.length; i++) {
        const letra = intento[i];
        
        if (palabraSecreta[i] === letra) {
          mapeoEstados[letra] = 'wd-correct';
        } else if (palabraSecreta.includes(letra)) {
          if (mapeoEstados[letra] !== 'wd-correct') {
            mapeoEstados[letra] = 'wd-present';
          }
        } else {
          if (mapeoEstados[letra] !== 'wd-correct' && mapeoEstados[letra] !== 'wd-present') {
            mapeoEstados[letra] = 'wd-incorrect';
          }
        }
      }
    });

    return mapeoEstados;
  };

  const estadosTeclado = obtenerEstadoLetrasTeclado();

  const procesarEntradaTeclado = (tecla) => {
    if (juegoTerminado || !palabraSecreta) return;
    setErrorMsg('');

    if (tecla === 'ENTER') {
      if (textoActual.length === largoPalabra) {
        const existeEnJson = listaPersonajes.some(
          (p) => p.name.toLowerCase() === textoActual.toLowerCase()
        );

        if (!existeEnJson) {
          setErrorMsg('NOT IN CHARACTER LIST');
          return;
        }

        const nuevosIntentos = [...intentos];
        nuevosIntentos[intentoActual] = textoActual;
        setIntentos(nuevosIntentos);

        if (textoActual === palabraSecreta) {
          setResultado('victoria');
          setJuegoTerminado(true);
        } else if (intentoActual === 5) {
          setResultado('derrota');
          setJuegoTerminado(true);
        } else {
          setIntentoActual(intentoActual + 1);
          setTextoActual('');
        }
      }
    } else if (tecla === 'BKSP' || tecla === 'BACKSPACE') {
      setTextoActual((prev) => prev.slice(0, -1));
    } else if (tecla.length === 1 && /^[a-zA-Z]$/.test(tecla)) {
      if (textoActual.length < largoPalabra) {
        setTextoActual((prev) => (prev + tecla).toUpperCase());
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      procesarEntradaTeclado(e.key.toUpperCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [textoActual, intentoActual, juegoTerminado, largoPalabra, palabraSecreta, intentos, listaPersonajes]);

  const obtenerClaseCasilla = (letra, index, filaIndex) => {
    if (filaIndex >= intentoActual) return 'wd-neutral';
    if (palabraSecreta[index] === letra) return 'wd-correct';
    if (palabraSecreta.includes(letra)) return 'wd-present';
    return 'wd-incorrect';
  };

  // Función para redirigir al Home alterando el historial de la SPA nativa
  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    // Despachamos el popstate manualmente para que App.jsx reaccione y cambie la vista
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!palabraSecreta) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>Loading Worlds...</div>;

  return (
    <div className="classic-wordle-container">
      
      {errorMsg && (
        <div className="wd-error-banner">
          {errorMsg}
        </div>
      )}

      {/* Estructura de cuadrícula */}
      <div className="wd-grid">
        {intentos.map((intento, filaIndex) => {
          const palabraFila = filaIndex === intentoActual 
            ? textoActual.padEnd(largoPalabra, ' ') 
            : intento.padEnd(largoPalabra, ' ');

          return (
            <div key={filaIndex} className="wd-row">
              {palabraFila.split('').map((letra, colIndex) => {
                const claseColor = letra !== ' ' ? obtenerClaseCasilla(letra, colIndex, filaIndex) : 'wd-neutral';
                
                return (
                  <div key={colIndex} className={`wd-box ${claseColor}`}>
                    {letra !== ' ' ? letra : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Teclado Virtual */}
      <div className="wd-keyboard">
        {TECLADO_LAYOUT.map((fila, filaIndex) => (
          <div key={filaIndex} className="wd-keyboard-row">
            {fila.map((tecla) => {
              const estadoEstilo = estadosTeclado[tecla] || 'wd-key-neutral';
              const esTeclaEspecial = tecla === 'ENTER' || tecla === 'BKSP';

              return (
                <button
                  key={tecla}
                  className={`wd-key-btn ${estadoEstilo} ${esTeclaEspecial ? 'wd-key-wide' : ''}`}
                  onClick={() => procesarEntradaTeclado(tecla)}
                >
                  {tecla === 'BKSP' ? '⌫' : tecla}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ==========================================================================
          MODAL INTERACTIVO DE FIN DE JUEGO (VICTORIA / DERROTA)
          ========================================================================== */}
      {juegoTerminado && (
        <div className="wd-result-modal-overlay">
          <div className={`wd-result-modal-box ${resultado === 'victoria' ? 'border-victory' : 'border-defeat'}`}>
            <h2 className={`result-title ${resultado === 'victoria' ? 'text-victory' : 'text-defeat'}`}>
              {resultado === 'victoria' ? 'VICTORY' : 'GAME OVER'}
            </h2>
            <p className="defeat-subtext">The mystery character name was:</p>
            <h3 className="result-character-name">
              {palabraSecreta}
            </h3>
            
            <div className="result-modal-actions">
              <button 
                onClick={() => cargarDificultad(listaPersonajes.length > 50 ? 'personajes.json' : 'personajes_kh.json')} 
                className="wd-modal-btn play-again-blue"
              >
                Play Again
              </button>
              <button 
                onClick={handleGoHome} 
                className="wd-modal-btn go-home-gray"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
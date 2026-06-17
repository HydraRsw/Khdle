import React from 'react';
import { motion } from 'framer-motion';

// Componente para manejar la animación exclusiva de cada casilla
function AnimateBox({ attr, guess, secret, index }) {
  const isCorrect = String(guess[attr]).toLowerCase() === String(secret[attr]).toLowerCase();

  return (
    <motion.div
      className={`box ${isCorrect ? 'correct' : 'incorrect'}`}
      // CONFIGURACIÓN DEL SUSPENSO:
      // Inicia completamente de perfil (oculto)
      initial={{ rotateY: 90, opacity: 0 }}
      // Gira lentamente hasta ponerse de frente
      animate={{ rotateY: 0, opacity: 1 }}
      // Ajustamos la velocidad aquí con duration (0.6 segundos por casilla)
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        delay: index * 0.4 // 0.4 segundos de retraso entre cada columna para dar intriga
      }}
    >
      {attr === 'image' ? (
        <img 
          src={guess.image} 
          alt="avatar" 
          onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=KH'} 
        />
      ) : (
        <span>{guess[attr] || 'N/A'}</span>
      )}
    </motion.div>
  );
}

function RowResult({ guess, secret }) {
  const attributes = ['image', 'gender', 'alignment', 'weapon', 'origin', 'debut', 'species'];

  return (
    <div className="result-row">
      {attributes.map((attr, index) => (
        <AnimateBox 
          key={attr} 
          attr={attr} 
          guess={guess} 
          secret={secret} 
          index={index} 
        />
      ))}
    </div>
  );
}

export default RowResult;
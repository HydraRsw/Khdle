import React from 'react';
import { motion } from 'framer-motion';

function AnimateBox({ attr, guess, secret, index }) {
  // Validación estricta de acierto/fallo por propiedad
  const isCorrect = String(guess[attr]).toLowerCase() === String(secret[attr]).toLowerCase();

  // Determinamos el color de fondo de la casilla
  let boxClass = 'incorrect';
  if (attr === 'image') {
    boxClass = 'neutral-box'; // Fuerza un color gris neutro para la foto
  } else if (isCorrect) {
    boxClass = 'correct';
  }

  return (
    <motion.div
      className={`box ${boxClass}`}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        delay: index * 0.4
      }}
    >
      {attr === 'image' ? (
        <div className="image-container">
          {/* CORRECCIÓN: Usamos 'guess' en lugar de 'p' y protegemos la ruta */}
          <img 
            src={guess.image && guess.image.startsWith('http') ? guess.image : `${import.meta.env.BASE_URL}${guess.image || ''}`} 
            alt="avatar" 
            onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=KH'} 
          />
        </div>
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
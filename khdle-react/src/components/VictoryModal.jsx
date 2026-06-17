import React from 'react';
import { motion } from 'framer-motion';

function VictoryModal({ secret, attempts, onTryAgain }) {
  return (
    <motion.div 
      className="victory-container"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <h2 className="victory-title">VICTORY!</h2>
      
      <div className="victory-card-info">
        <img 
          className="victory-character-img" 
          src={secret.image} 
          alt={secret.name} 
          onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=KH'}
        />
        <div className="victory-details">
          <p className="victory-text-sub">You guessed</p>
          <h3 className="victory-character-name">{secret.name}</h3>
        </div>
      </div>

      <div className="victory-stats">
        <p>Attempts: <span className="highlight-attempts">{attempts}</span></p>
        <button className="try-again-btn" onClick={onTryAgain}>
        Try Again
      </button>
      </div>
      
    </motion.div>
  );
}

export default VictoryModal;
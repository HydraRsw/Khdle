import React from 'react';

function GridHeader() {
  const headers = ['Character', 'Gender', 'Alignment', 'Weapon', 'Origin', 'Debut', 'Species'];
  
  return (
    <div className="attributes-header">
      {headers.map(h => (
        <div key={h} className="header-box">{h}</div>
      ))}
    </div>
  );
}

export default GridHeader;
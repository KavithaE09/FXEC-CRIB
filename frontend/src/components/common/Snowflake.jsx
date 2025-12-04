import React from 'react';

const Snowflake = ({ delay, duration, left }) => (
  <div
    className="absolute text-white opacity-70 pointer-events-none animate-fall"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      fontSize: '1.5rem'
    }}
  >
    ❅
  </div>
);

export default Snowflake;
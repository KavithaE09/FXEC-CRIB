import React from 'react';

const ChristmasLights = () => (
  <div className="absolute top-0 left-0 w-full h-16 overflow-hidden pointer-events-none">
    <div className="flex justify-around">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full animate-pulse"
          style={{
            backgroundColor: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22c55e' : '#fbbf24',
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  </div>
);

export default ChristmasLights;
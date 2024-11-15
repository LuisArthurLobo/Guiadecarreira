import React, { useState, useEffect } from 'react';

interface ConfettiProps {
  active: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speedX: number;
  speedY: number;
  speedRotation: number;
  shape: 'star' | 'circle';
  gradientColors: string[];
  gradientOffset: number;
  pulseSpeed: number;
  oscillationSpeed: number;
  blurAmount: number;
  baseOpacity: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    if (active) {
      const pieces = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 1.5 + 0.8,
        speedX: Math.random() * 8 - 4,
        speedY: Math.random() * 0.8 + 0.2,
        speedRotation: Math.random() * 15 - 7.5,
        shape: (Math.random() > 0.5 ? 'star' : 'circle') as ('star' | 'circle'),
        gradientColors: [
          '#22ffff',
          '#3c64ff',
          '#c03afc',
          '#ff54e8',
          '#ff5959',
          '#ff9a07',
          '#feff07',
          '#58ff07',
          '#07ff77',
          '#22ffff'
        ],
        gradientOffset: Math.random() * 360,
        pulseSpeed: Math.random() * 1.5 + 0.5,
        oscillationSpeed: Math.random() * 1.5 + 0.5,
        blurAmount: Math.random() * 0.5 + 0.5,
        baseOpacity: Math.random() * 0.3 + 0.3
      }));
      
      setConfetti(pieces);
      
      const interval = setInterval(() => {
        setConfetti(prev => {
          if (prev.length === 0) {
            clearInterval(interval);
            return prev;
          }
          
          return prev
            .map(piece => ({
              ...piece,
              x: piece.x + piece.speedX * 0.1 + Math.sin(Date.now() / 2000 * piece.oscillationSpeed) * 1.5,
              y: piece.y + piece.speedY,
              rotation: piece.rotation + piece.speedRotation * 0.2,
              speedY: piece.speedY + 0.015,
              speedX: piece.speedX * 0.99
            }))
            .filter(piece => piece.y < 120);
        });
      }, 16);
      
      return () => clearInterval(interval);
    } else {
      setConfetti([]);
    }
  }, [active]);
  
  if (!active && confetti.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(piece => {
        const time = Date.now() / 1000;
        const pulseScale = 1 + Math.sin(time * piece.pulseSpeed) * 0.1;
        const maskRotation = (time * 30 + piece.gradientOffset) % 360;
        
        return (
          <div
            key={piece.id}
            className="absolute w-5 h-5 transform-gpu mix-blend-screen"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              transform: `rotate(${piece.rotation}deg) scale(${piece.scale * pulseScale})`,
              opacity: piece.baseOpacity,
              filter: `blur(${piece.blurAmount}px)`,
            }}
          >
            <svg viewBox="0 0 20 20">
              <defs>
                <radialGradient id={`glow-${piece.id}`}>
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <linearGradient id={`conic-${piece.id}`} gradientTransform={`rotate(${maskRotation})`}>
                  {piece.gradientColors.map((color, index) => (
                    <stop
                      key={index}
                      offset={`${(index * 100) / (piece.gradientColors.length - 1)}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              </defs>
              {piece.shape === 'star' ? (
                <>
                  <path
                    d="M10 0L13.09 6.91L20 10L13.09 13.09L10 20L6.91 13.09L0 10L6.91 6.91L10 0Z"
                    fill={`url(#conic-${piece.id})`}
                    style={{
                      filter: 'brightness(1.2) contrast(1.2)'
                    }}
                  />
                  <path
                    d="M10 0L13.09 6.91L20 10L13.09 13.09L10 20L6.91 13.09L0 10L6.91 6.91L10 0Z"
                    fill={`url(#glow-${piece.id})`}
                    style={{
                      mixBlendMode: 'overlay'
                    }}
                  />
                </>
              ) : (
                <>
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={`url(#conic-${piece.id})`}
                    style={{
                      filter: 'brightness(1.2) contrast(1.2)'
                    }}
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={`url(#glow-${piece.id})`}
                    style={{
                      mixBlendMode: 'overlay'
                    }}
                  />
                </>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Confetti;
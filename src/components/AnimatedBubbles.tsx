
import React, { useMemo } from 'react';

interface Bubble {
  id: number;
  size: number;
  positionX: number;
  positionY: number;
  duration: number;
  delay: number;
}

interface AnimatedBubblesProps {
  count?: number;
  color?: string;
  className?: string;
}

const AnimatedBubbles: React.FC<AnimatedBubblesProps> = ({ 
  count = 15, 
  color = 'hsl(246, 84%, 97%)',
  className = '' 
}) => {
  const bubbles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 80) + 40, // 40px to 120px
      positionX: Math.floor(Math.random() * 100),
      positionY: Math.floor(Math.random() * 100),
      duration: Math.floor(Math.random() * 15) + 10, // 10s to 25s
      delay: Math.floor(Math.random() * 10)
    }));
  }, [count]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {bubbles.map((bubble: Bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-bubble-float"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.positionX}%`,
            bottom: `-${bubble.size}px`,
            backgroundColor: color,
            opacity: 0.2,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBubbles;

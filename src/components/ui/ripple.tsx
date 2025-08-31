import React, { useRef, useEffect, useState } from 'react';

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export function Ripple({ children, className = '', color = 'rgba(255, 255, 255, 0.3)', duration = 600 }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const rippleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const id = rippleId.current++;

    setRipples(prev => [...prev, { id, x, y, size }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, duration);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget.querySelector('button');
    if (button) {
      button.click();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseDown={addRipple}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            transform: 'scale(0)',
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
}

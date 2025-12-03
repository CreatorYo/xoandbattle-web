import React, { useRef, useEffect, useState, cloneElement, isValidElement } from 'react';

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

  const addRipple = (event: React.MouseEvent) => {
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

  const isRoundedFull = className.includes('rounded-full');
  const baseClasses = `relative overflow-hidden ${isRoundedFull ? 'rounded-full' : 'rounded-lg'}`;
  
  if (isValidElement(children) && typeof children.type !== 'string') {
    const child = children as React.ReactElement;
    const originalOnMouseDown = child.props.onMouseDown;
    
    return (
      <div
        ref={containerRef}
        className={`${baseClasses} ${className}`}
        style={{ display: 'inline-block' }}
      >
        {cloneElement(child, {
          onMouseDown: (e: React.MouseEvent) => {
            addRipple(e);
            originalOnMouseDown?.(e);
          },
          style: {
            ...child.props.style,
            position: 'relative',
            zIndex: 1,
          },
        })}
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
              zIndex: 0,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${baseClasses} ${className}`}
      onMouseDown={addRipple}
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

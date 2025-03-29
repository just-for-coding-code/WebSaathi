
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  spotlightColor?: string;
  borderGlow?: boolean;
  gradientBg?: boolean;
  style?: React.CSSProperties;
}

const CardSpotlight = ({
  children,
  className,
  containerClassName,
  spotlightColor = "rgba(155, 135, 245, 0.15)",
  borderGlow = false,
  gradientBg = false,
  style,
}: CardSpotlightProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      className={cn(
        "relative overflow-hidden group",
        containerClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={style}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`,
        }}
      />
      
      {/* Border glow effect (optional) */}
      {borderGlow && (
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      )}
      
      {/* Background gradient (optional) */}
      {gradientBg && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800/90 opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Content */}
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};

export default CardSpotlight;

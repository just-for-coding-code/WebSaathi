
import React, { useEffect, useRef, useState } from 'react';

export const BackgroundBeams = ({ 
  className = "",
  color = "#9b87f5",
  beamOpacity = 0.5,
  beamCount = 8,
  beamSpread = 0.2,
  waveSpeed = 10,
  randomize = true,
  children
}: {
  className?: string;
  color?: string;
  beamOpacity?: number;
  beamCount?: number;
  beamSpread?: number;
  waveSpeed?: number;
  randomize?: boolean;
  children?: React.ReactNode;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const generatedPaths: SVGPathElement[] = [];
    
    // Clear any existing paths
    const existingPaths = svg.querySelectorAll('path');
    existingPaths.forEach(path => path.remove());

    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;
    
    // Set viewBox attribute to match dimensions
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    // Generate new beam paths
    for (let i = 0; i < beamCount; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Distribute starting positions across the screen width
      const startX = randomize 
        ? Math.random() * svgWidth
        : (i / beamCount) * svgWidth * (1 + beamSpread) - (svgWidth * beamSpread / 2);
      
      const startY = 0;
      
      // Create more natural-looking curves
      const controlX1 = startX - svgWidth * (0.1 + Math.random() * 0.4);
      const controlY1 = svgHeight * (0.2 + Math.random() * 0.3);
      
      const controlX2 = startX + svgWidth * (0.1 + Math.random() * 0.4);
      const controlY2 = svgHeight * (0.5 + Math.random() * 0.4);
      
      // Create varied end positions
      const endX = randomize 
        ? Math.random() * svgWidth 
        : startX + (Math.random() - 0.5) * svgWidth * 0.7;
      
      const endY = svgHeight;
      
      // Create the path data
      const pathData = `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', (2 + Math.random() * 10).toString());
      path.setAttribute('stroke-opacity', (beamOpacity * (0.4 + Math.random() * 0.6)).toString());
      path.setAttribute('fill', 'none');
      
      // Apply animation with staggered delays and different durations for a more organic feel
      const animateDuration = waveSpeed + Math.random() * waveSpeed * 2;
      const animateDelay = i * (waveSpeed / beamCount);
      const alternating = i % 2 === 0 ? 'alternate' : 'alternate-reverse';
      
      // Create @keyframes-like animation with JavaScript
      path.style.animation = `beam${i} ${animateDuration}s ${animateDelay}s infinite ${alternating} ease-in-out`;
      
      // Create a style element for each beam's custom animation
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes beam${i} {
          0% {
            stroke-opacity: ${(beamOpacity * (0.4 + Math.random() * 0.3))};
            stroke-width: ${(2 + Math.random() * 8)}px;
            filter: blur(${Math.random() * 4}px);
          }
          50% {
            stroke-opacity: ${(beamOpacity * (0.7 + Math.random() * 0.3))};
            stroke-width: ${(6 + Math.random() * 6)}px;
            filter: blur(${Math.random() * 3 + 1}px);
          }
          100% {
            stroke-opacity: ${(beamOpacity * (0.4 + Math.random() * 0.3))};
            stroke-width: ${(2 + Math.random() * 8)}px;
            filter: blur(${Math.random() * 4}px);
          }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Add interactive effect that reacts to mouse movement
      if (isHovering) {
        const dx = mousePosition.x - startX;
        const dy = mousePosition.y - svgHeight / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt(svgWidth * svgWidth + svgHeight * svgHeight) / 2;
        const influence = Math.max(0, 1 - distance / maxDistance) * 30;
        
        const newControlX1 = controlX1 + (mousePosition.x - controlX1) * influence / 500;
        const newControlY1 = controlY1 + (mousePosition.y - controlY1) * influence / 500;
        
        path.setAttribute('d', `M${startX},${startY} C${newControlX1},${newControlY1} ${controlX2},${controlY2} ${endX},${endY}`);
      }
      
      svg.appendChild(path);
      generatedPaths.push(path);
    }

    // Add event listeners for hover effects
    svg.addEventListener('mouseenter', () => setIsHovering(true));
    svg.addEventListener('mouseleave', () => setIsHovering(false));

    // Cleanup function
    return () => {
      generatedPaths.forEach(path => path.remove());
      document.querySelectorAll(`style[id^="beam-style"]`).forEach(elem => elem.remove());
      svg.removeEventListener('mouseenter', () => setIsHovering(true));
      svg.removeEventListener('mouseleave', () => setIsHovering(false));
    };
  }, [beamCount, beamOpacity, color, dimensions, beamSpread, waveSpeed, randomize, mousePosition, isHovering]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-10"></div>
      <svg 
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Paths will be dynamically generated */}
      </svg>
      {children && <div className="relative z-20">{children}</div>}
    </div>
  );
};

export default BackgroundBeams;

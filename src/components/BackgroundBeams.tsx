
import React, { useEffect, useRef } from 'react';

export const BackgroundBeams = ({ 
  className = "",
  color = "#9b87f5",
  beamOpacity = 0.4,
  beamCount = 5,
}: {
  className?: string;
  color?: string;
  beamOpacity?: number;
  beamCount?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const generatedPaths: SVGPathElement[] = [];
    
    // Clear any existing paths
    const existingPaths = svg.querySelectorAll('path');
    existingPaths.forEach(path => path.remove());

    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    
    // Generate new paths
    for (let i = 0; i < beamCount; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Randomize starting position
      const startX = Math.random() * svgWidth;
      const startY = 0;
      
      // Randomize curve control points
      const controlX1 = startX - 100 + Math.random() * 200;
      const controlY1 = svgHeight / 3 + Math.random() * (svgHeight / 3);
      const controlX2 = startX - 150 + Math.random() * 300;
      const controlY2 = svgHeight / 3 * 2 + Math.random() * (svgHeight / 3);
      
      // End position
      const endX = Math.random() * svgWidth;
      const endY = svgHeight;
      
      // Create the path data
      const pathData = `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', (2 + Math.random() * 8).toString());
      path.setAttribute('stroke-opacity', (beamOpacity * (0.5 + Math.random() * 0.5)).toString());
      path.setAttribute('fill', 'none');
      
      // Apply animation
      const animateDuration = 10 + Math.random() * 25;
      path.style.animation = `pulse ${animateDuration}s ease-in-out infinite alternate`;
      
      svg.appendChild(path);
      generatedPaths.push(path);
    }

    // Cleanup function to remove paths
    return () => {
      generatedPaths.forEach(path => path.remove());
    };
  }, [beamCount, beamOpacity, color]);

  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
      <svg 
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        preserveAspectRatio="none"
      >
        {/* Paths will be dynamically generated */}
      </svg>
    </div>
  );
};

export default BackgroundBeams;


import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { prefersReducedMotion } from '@/utils/animationUtils';

export const BackgroundBeams = ({ 
  className = "",
  color = "#9b87f5",
  beamOpacity = 0.5,
  beamCount = 8,
  beamSpread = 0.2,
  waveSpeed = 10,
  randomize = true,
}: {
  className?: string;
  color?: string;
  beamOpacity?: number;
  beamCount?: number;
  beamSpread?: number;
  waveSpeed?: number;
  randomize?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const isMobile = useIsMobile();
  const reducedMotion = prefersReducedMotion();
  
  // Optimize for mobile
  const optimizedBeamCount = isMobile ? Math.min(4, beamCount) : beamCount;
  const optimizedOpacity = isMobile ? Math.min(0.3, beamOpacity) : beamOpacity;
  const optimizedWaveSpeed = reducedMotion ? 0 : (isMobile ? waveSpeed * 1.5 : waveSpeed);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Throttled resize listener for better performance
    let timeoutId: number;
    const throttledResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Skip animation for users who prefer reduced motion
    if (reducedMotion) return;
    
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
    
    // Skip animation for mobile or reduced motion preference
    if (isMobile && optimizedBeamCount === 0) return;
    
    // Generate new beam paths - optimized for performance
    for (let i = 0; i < optimizedBeamCount; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Distribute starting positions across the screen width
      const startX = randomize 
        ? Math.random() * svgWidth
        : (i / optimizedBeamCount) * svgWidth * (1 + beamSpread) - (svgWidth * beamSpread / 2);
      
      const startY = 0;
      
      // Create more natural-looking curves - simplified for performance
      const controlX1 = startX - svgWidth * (0.1 + Math.random() * 0.3);
      const controlY1 = svgHeight * (0.2 + Math.random() * 0.3);
      
      const controlX2 = startX + svgWidth * (0.1 + Math.random() * 0.3);
      const controlY2 = svgHeight * (0.5 + Math.random() * 0.3);
      
      // Create varied end positions
      const endX = randomize 
        ? Math.random() * svgWidth 
        : startX + (Math.random() - 0.5) * svgWidth * 0.5;
      
      const endY = svgHeight;
      
      // Create the path data
      const pathData = `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', (1 + Math.random() * 8).toString());
      path.setAttribute('stroke-opacity', (optimizedOpacity * (0.4 + Math.random() * 0.6)).toString());
      path.setAttribute('fill', 'none');
      
      // Apply animation with staggered delays and different durations for a more organic feel
      // Skip animation for reduced motion preference
      if (!reducedMotion) {
        const animateDuration = optimizedWaveSpeed + Math.random() * optimizedWaveSpeed;
        const animateDelay = i * (optimizedWaveSpeed / optimizedBeamCount);
        const alternating = i % 2 === 0 ? 'alternate' : 'alternate-reverse';
        
        // Create @keyframes-like animation with JavaScript
        path.style.animation = `beam${i} ${animateDuration}s ${animateDelay}s infinite ${alternating} ease-in-out`;
        
        // Create a style element for each beam's custom animation
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          @keyframes beam${i} {
            0% {
              stroke-opacity: ${(optimizedOpacity * (0.4 + Math.random() * 0.3))};
              stroke-width: ${(1 + Math.random() * 6)}px;
              filter: blur(${Math.random() * 3}px);
            }
            50% {
              stroke-opacity: ${(optimizedOpacity * (0.6 + Math.random() * 0.3))};
              stroke-width: ${(3 + Math.random() * 4)}px;
              filter: blur(${Math.random() * 2 + 1}px);
            }
            100% {
              stroke-opacity: ${(optimizedOpacity * (0.4 + Math.random() * 0.3))};
              stroke-width: ${(1 + Math.random() * 6)}px;
              filter: blur(${Math.random() * 3}px);
            }
          }
        `;
        document.head.appendChild(styleElement);
      }
      
      svg.appendChild(path);
      generatedPaths.push(path);
    }

    // Cleanup function
    return () => {
      generatedPaths.forEach(path => path.remove());
      document.querySelectorAll(`style[id^="beam-style"]`).forEach(elem => elem.remove());
    };
  }, [optimizedBeamCount, optimizedOpacity, color, dimensions, beamSpread, optimizedWaveSpeed, randomize, isMobile, reducedMotion]);

  // For reduced motion or extremely low-end devices, show a simple gradient
  if (reducedMotion || (isMobile && optimizedBeamCount === 0)) {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5"></div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-10"></div>
      <svg 
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Paths will be dynamically generated */}
      </svg>
    </div>
  );
};

export default BackgroundBeams;

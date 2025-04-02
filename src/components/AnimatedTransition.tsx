
import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/utils/animationUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'scale' | 'slide';
  duration?: number;
  delay?: number;
  disableOnMobile?: boolean;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  className = '',
  type = 'fade',
  duration = 300,
  delay = 0,
  disableOnMobile = false
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const reducedMotion = prefersReducedMotion();
  const isMobile = useIsMobile();
  
  // Skip animation based on reduced motion preference, mobile setting, or device performance
  const skipAnimation = reducedMotion || (disableOnMobile && isMobile);
  
  // Check if the device is low-end (fewer CPU cores) for additional performance optimization
  const isLowEndDevice = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;
  
  // Optimize duration based on device capabilities
  const optimizedDuration = 
    isLowEndDevice ? Math.min(duration, 150) :  // Much shorter duration for low-end devices
    isMobile ? Math.min(duration, 200) :        // Shorter duration for mobile
    duration;                                    // Full duration for desktop

  useEffect(() => {
    if (show) setShouldRender(true);
    
    let timeoutId: NodeJS.Timeout;
    if (!show) {
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, skipAnimation ? 0 : optimizedDuration);
    }
    
    return () => clearTimeout(timeoutId);
  }, [show, optimizedDuration, skipAnimation]);

  if (!shouldRender) return null;

  // If animations should be skipped, just show/hide without animation
  if (skipAnimation) {
    return show ? <div className={className}>{children}</div> : null;
  }

  let animationClasses = '';
  
  switch (type) {
    case 'fade':
      animationClasses = show ? 'opacity-100' : 'opacity-0';
      break;
    case 'scale':
      animationClasses = show ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      break;
    case 'slide':
      animationClasses = show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4';
      break;
    default:
      animationClasses = show ? 'opacity-100' : 'opacity-0';
  }

  // Optimize for performance on low-end devices by minimizing GPU usage
  const transitionStyle = {
    transitionProperty: isLowEndDevice ? 'opacity' : 'all',
    transitionDuration: `${optimizedDuration}ms`,
    transitionDelay: delay ? `${delay}ms` : undefined,
    willChange: isLowEndDevice ? 'opacity' : 'opacity, transform',
  };

  return (
    <div
      className={`transition transform ${animationClasses} ${className}`}
      style={transitionStyle}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;


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

// Add proper type definition for NavigatorWithMemory interface
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
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
  
  // Determine if animations should be disabled
  const skipAnimation = reducedMotion || (disableOnMobile && isMobile);
  
  // Enhanced performance detection for improved mobile experience
  const isLowPerformanceDevice = typeof navigator !== 'undefined' && (
    (navigator as NavigatorWithMemory).deviceMemory !== undefined && (navigator as NavigatorWithMemory).deviceMemory <= 4 || 
    navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4 || 
    /Android [456]/.test(navigator.userAgent)
  );
  
  // Optimize duration based on device capabilities
  const optimizedDuration = 
    isLowPerformanceDevice ? Math.min(duration, 120) :  // Very short duration for low-end devices
    isMobile ? Math.min(duration, 180) :        // Shorter duration for mobile
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

  // Optimize for performance by minimizing GPU usage on low-end devices
  const transitionStyle = {
    transitionProperty: isLowPerformanceDevice ? 'opacity' : 'all',
    transitionDuration: `${optimizedDuration}ms`,
    transitionDelay: delay ? `${delay}ms` : undefined,
    willChange: isLowPerformanceDevice ? 'opacity' : 'opacity, transform',
    contain: 'content',  // Improve rendering performance
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

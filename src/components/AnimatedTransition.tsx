
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
  
  // Skip animation for reduced motion preference or on mobile if disabled
  const skipAnimation = reducedMotion || (disableOnMobile && isMobile);
  
  // Optimize duration for mobile
  const optimizedDuration = isMobile ? Math.min(duration, 200) : duration;

  useEffect(() => {
    if (show) setShouldRender(true);
    
    let timeoutId: NodeJS.Timeout;
    if (!show) {
      // Use shorter duration on mobile
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

  return (
    <div
      className={`transition-all transform ${animationClasses} ${className}`}
      style={{ 
        transitionDuration: `${optimizedDuration}ms`,
        transitionDelay: delay ? `${delay}ms` : undefined
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;

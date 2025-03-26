
import React, { useEffect, useState } from 'react';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'scale' | 'slide';
  duration?: number;
  delay?: number;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  className = '',
  type = 'fade',
  duration = 300,
  delay = 0
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
    
    let timeoutId: NodeJS.Timeout;
    if (!show) {
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }
    
    return () => clearTimeout(timeoutId);
  }, [show, duration]);

  if (!shouldRender) return null;

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
        transitionDuration: `${duration}ms`,
        transitionDelay: delay ? `${delay}ms` : undefined
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;

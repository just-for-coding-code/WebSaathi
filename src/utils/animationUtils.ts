
export const staggeredAnimation = (index: number, baseDelay: number = 100): number => {
  return baseDelay * index;
};

export const sequentialAnimation = (
  element: HTMLElement, 
  animation: string, 
  duration: number = 1000
): Promise<void> => {
  return new Promise((resolve) => {
    // Check if browser supports animation
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      // Skip animation for users who prefer reduced motion
      resolve();
      return;
    }
    
    element.classList.add(animation);
    
    const onAnimationEnd = () => {
      element.removeEventListener('animationend', onAnimationEnd);
      element.classList.remove(animation);
      resolve();
    };
    
    element.addEventListener('animationend', onAnimationEnd);
    
    // Fallback if animation doesn't complete
    setTimeout(resolve, duration + 50);
  });
};

export const smoothScrollTo = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Instant scroll for users who prefer reduced motion
      element.scrollIntoView({
        block: 'start'
      });
    } else {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
};

// Optimized intersection observer for scroll-triggered animations
export const createScrollObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = { 
    threshold: 0.1,
    rootMargin: '0px 0px -5% 0px'
  }
): IntersectionObserver => {
  return new IntersectionObserver(callback, options);
};

// Helper to ensure elements remain visible after animation
export const applyPersistentAnimation = (element: Element, useReducedMotion: boolean = false): void => {
  if (useReducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Skip animation for users who prefer reduced motion
    element.classList.add('opacity-100');
    return;
  }
  
  // After animating in, make sure the element stays visible
  element.classList.add('animate-slide-in');
  
  const handleAnimationEnd = () => {
    element.removeEventListener('animationend', handleAnimationEnd);
    element.classList.remove('animate-slide-in');
    element.classList.add('opacity-100'); // Keep element visible
  };
  
  element.addEventListener('animationend', handleAnimationEnd);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized version of BackgroundBeams for better performance
export const optimizeBeams = (beamCount: number, deviceType: 'mobile' | 'tablet' | 'desktop'): number => {
  // Reduce beam count on mobile/tablet for better performance
  if (deviceType === 'mobile') return Math.min(beamCount, 4);
  if (deviceType === 'tablet') return Math.min(beamCount, 6);
  return beamCount;
};

// Detect device type based on screen width
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

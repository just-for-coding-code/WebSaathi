
export const staggeredAnimation = (index: number, baseDelay: number = 100): number => {
  return baseDelay * index;
};

export const sequentialAnimation = (
  element: HTMLElement, 
  animation: string, 
  duration: number = 1000
): Promise<void> => {
  return new Promise((resolve) => {
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
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Intersection observer for scroll-triggered animations
export const createScrollObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = { 
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  }
): IntersectionObserver => {
  return new IntersectionObserver(callback, options);
};

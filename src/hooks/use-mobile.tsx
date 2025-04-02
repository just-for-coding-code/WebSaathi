
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the more modern event listener approach if available
    if (mql.addEventListener) {
      mql.addEventListener("change", handleResize)
    } else {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Set initial value
    handleResize()
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleResize)
      } else {
        // Fallback for older browsers
        mql.removeListener(handleResize)
      }
    }
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    // Use matchMedia for better performance
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    // Use the more modern event listener approach if available
    if (mql.addEventListener) {
      mql.addEventListener("change", handleResize)
    } else {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Set initial value
    handleResize()
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleResize)
      } else {
        // Fallback for older browsers
        mql.removeListener(handleResize)
      }
    }
  }, [])

  return !!isTablet
}

export function useDeviceType() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

// Performance detection hook
export function usePerformanceLevel(): 'low' | 'medium' | 'high' {
  const [performanceLevel, setPerformanceLevel] = React.useState<'low' | 'medium' | 'high'>('medium')
  const deviceType = useDeviceType()
  
  React.useEffect(() => {
    // Simple heuristic to determine performance level
    const detectPerformance = () => {
      // Check if device is mobile/tablet
      if (deviceType === 'mobile') {
        // Mobile devices are considered low performance by default
        setPerformanceLevel('low')
        return
      }
      
      // For desktop, try to detect hardware capabilities
      try {
        // Use available hardware concurrency (CPU cores) as a proxy for performance
        const cores = navigator.hardwareConcurrency || 0
        
        if (cores <= 2) {
          setPerformanceLevel('low')
        } else if (cores <= 4) {
          setPerformanceLevel('medium')
        } else {
          setPerformanceLevel('high')
        }
      } catch (e) {
        // Fallback if hardwareConcurrency is not available
        setPerformanceLevel(deviceType === 'tablet' ? 'medium' : 'high')
      }
    }
    
    detectPerformance()
  }, [deviceType])
  
  return performanceLevel
}

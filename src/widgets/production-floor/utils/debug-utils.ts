// Debug utilities for production floor component

let renderCount = 0;
let lastRenderTime = 0;

export const debugUtils = {
  /**
   * Track component renders to detect infinite loops
   */
  trackRender: (componentName: string) => {
    renderCount++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime;
    lastRenderTime = now;
    
    if (renderCount > 100) {
      console.warn(`⚠️ Potential infinite loop detected in ${componentName}: ${renderCount} renders`);
    }
    
    if (timeSinceLastRender < 100) {
      console.warn(`⚠️ Rapid re-renders detected in ${componentName}: ${timeSinceLastRender}ms between renders`);
    }
    
    console.log(`🔄 ${componentName} render #${renderCount} (${timeSinceLastRender}ms)`);
  },

  /**
   * Reset render counter
   */
  resetRenderCount: () => {
    renderCount = 0;
    lastRenderTime = 0;
  },

  /**
   * Check for infinite loops in useEffect
   */
  trackEffect: (effectName: string, dependencies: any[]) => {
    console.log(`🔧 Effect "${effectName}" triggered with dependencies:`, dependencies);
  },

  /**
   * Monitor state changes
   */
  trackStateChange: (stateName: string, oldValue: any, newValue: any) => {
    if (oldValue !== newValue) {
      console.log(`📊 State "${stateName}" changed:`, { old: oldValue, new: newValue });
    }
  },

  /**
   * Check for memory leaks
   */
  checkMemoryUsage: () => {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usageMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
      
      console.log(`💾 Memory usage: ${usageMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB (${limitMB.toFixed(2)}MB limit)`);
      
      if (usageMB > 100) {
        console.warn(`⚠️ High memory usage detected: ${usageMB.toFixed(2)}MB`);
      }
    }
  },

  /**
   * Performance timing utility
   */
  timeOperation: (operationName: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`⏱️ ${operationName} took ${duration.toFixed(2)}ms`);
    
    if (duration > 100) {
      console.warn(`⚠️ Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }
  }
};

// React hook for debugging
export const useDebugRender = (componentName: string) => {
  debugUtils.trackRender(componentName);
  
  return {
    trackEffect: (effectName: string, dependencies: any[]) => {
      debugUtils.trackEffect(effectName, dependencies);
    },
    trackStateChange: (stateName: string, oldValue: any, newValue: any) => {
      debugUtils.trackStateChange(stateName, oldValue, newValue);
    }
  };
};

// Development-only debug mode
if (process.env.NODE_ENV === 'development') {
  // Auto-reset render count every 5 seconds
  setInterval(() => {
    debugUtils.resetRenderCount();
  }, 5000);
  
  // Monitor memory usage
  setInterval(() => {
    debugUtils.checkMemoryUsage();
  }, 10000);
} 
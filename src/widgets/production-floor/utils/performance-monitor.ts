// Performance monitoring utility for production floor components

interface PerformanceMetrics {
  renderTime: number;
  dataSize: number;
  virtualizationEnabled: boolean;
  memoryUsage?: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start performance monitoring for a specific operation
   */
  startTimer(operation: string): () => void {
    if (!this.isEnabled) return () => {};
    
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize;
    
    return () => {
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize;
      
      this.recordMetric({
        renderTime: endTime - startTime,
        dataSize: 0, // Will be set by the calling component
        virtualizationEnabled: false, // Will be set by the calling component
        memoryUsage: endMemory - startMemory,
        timestamp: Date.now()
      });
      
      if (endTime - startTime > 100) { // Log slow operations
        console.warn(`Slow operation detected: ${operation} took ${(endTime - startTime).toFixed(2)}ms`);
      }
    };
  }

  /**
   * Record performance metrics
   */
  recordMetric(metric: Partial<PerformanceMetrics>): void {
    if (!this.isEnabled) return;
    
    this.metrics.push({
      renderTime: 0,
      dataSize: 0,
      virtualizationEnabled: false,
      timestamp: Date.now(),
      ...metric
    });
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    averageRenderTime: number;
    totalOperations: number;
    virtualizationUsage: number;
    memoryTrend: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageRenderTime: 0,
        totalOperations: 0,
        virtualizationUsage: 0,
        memoryTrend: 0
      };
    }

    const recentMetrics = this.metrics.slice(-20); // Last 20 operations
    const averageRenderTime = recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length;
    const virtualizationUsage = recentMetrics.filter(m => m.virtualizationEnabled).length / recentMetrics.length;
    
    const memoryMetrics = recentMetrics.filter(m => m.memoryUsage !== undefined);
    const memoryTrend = memoryMetrics.length > 1 
      ? (memoryMetrics[memoryMetrics.length - 1].memoryUsage! - memoryMetrics[0].memoryUsage!) / memoryMetrics.length
      : 0;

    return {
      averageRenderTime,
      totalOperations: this.metrics.length,
      virtualizationUsage,
      memoryTrend
    };
  }

  /**
   * Check if virtualization should be enabled based on data size
   */
  shouldEnableVirtualization(dataSize: number): boolean {
    return dataSize > 100; // Enable virtualization for datasets larger than 100 items
  }

  /**
   * Get recommended batch size based on performance
   */
  getRecommendedBatchSize(dataSize: number): number {
    const stats = this.getStats();
    
    if (stats.averageRenderTime > 50) {
      return Math.max(10, Math.floor(dataSize / 10)); // Smaller batches for slow rendering
    } else if (stats.averageRenderTime < 10) {
      return Math.min(100, Math.floor(dataSize / 5)); // Larger batches for fast rendering
    } else {
      return 50; // Default batch size
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Enable/disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const startTimer = (operation: string) => performanceMonitor.startTimer(operation);
  const recordMetric = (metric: Partial<PerformanceMetrics>) => performanceMonitor.recordMetric(metric);
  const getStats = () => performanceMonitor.getStats();
  const shouldEnableVirtualization = (dataSize: number) => performanceMonitor.shouldEnableVirtualization(dataSize);
  const getRecommendedBatchSize = (dataSize: number) => performanceMonitor.getRecommendedBatchSize(dataSize);

  return {
    startTimer,
    recordMetric,
    getStats,
    shouldEnableVirtualization,
    getRecommendedBatchSize
  };
};

// Performance optimization utilities
export const optimizeRendering = {
  /**
   * Debounce function calls to prevent excessive re-renders
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Throttle function calls to limit execution frequency
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Memoize expensive calculations
   */
  memoize: <T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T => {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }
};

// Memory management utilities
export const memoryOptimizer = {
  /**
   * Force garbage collection if available
   */
  forceGC: (): void => {
    if ((globalThis as any).gc) {
      (globalThis as any).gc();
    }
  },

  /**
   * Check memory usage
   */
  getMemoryUsage: (): { used: number; total: number; limit: number } | null => {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  /**
   * Check if memory usage is high
   */
  isMemoryUsageHigh: (): boolean => {
    const memory = memoryOptimizer.getMemoryUsage();
    if (!memory) return false;
    
    const usagePercentage = (memory.used / memory.limit) * 100;
    return usagePercentage > 80; // Consider high if over 80%
  }
}; 
/**
 * Chatwoot Performance Metrics Hook
 *
 * Tracks API calls, response times, cache hits/misses, and other performance metrics
 * for the Chatwoot provider. Useful for monitoring optimization impact.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { createLogger } from '@/services/frontdesk/utils/logger';

const logger = createLogger('useChatwootMetrics');

export interface APICallMetric {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: number;
  success: boolean;
  cached?: boolean;
  filters?: any;
}

export interface MetricsStats {
  totalCalls: number;
  totalDuration: number;
  avgDuration: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  callsByEndpoint: Record<string, {
    count: number;
    totalDuration: number;
    avgDuration: number;
    failures: number;
  }>;
  recentCalls: APICallMetric[];
}

const MAX_RECENT_CALLS = 50; // Keep last 50 calls in memory

export const useChatwootMetrics = (enabled: boolean = process.env.NODE_ENV === 'development') => {
  const [metrics, setMetrics] = useState<APICallMetric[]>([]);
  const metricsRef = useRef<APICallMetric[]>([]);

  // Session start time for calculating uptime
  const sessionStartRef = useRef(Date.now());

  /**
   * Track an API call
   */
  const trackAPICall = useCallback((
    endpoint: string,
    method: string,
    startTime: number,
    success: boolean = true,
    cached: boolean = false,
    filters?: any
  ) => {
    if (!enabled) return;

    const duration = Date.now() - startTime;
    const metric: APICallMetric = {
      endpoint,
      method,
      duration,
      timestamp: Date.now(),
      success,
      cached,
      filters,
    };

    // Add to metrics
    metricsRef.current = [...metricsRef.current.slice(-MAX_RECENT_CALLS + 1), metric];
    setMetrics(metricsRef.current);

    // Log slow calls (>2s)
    if (duration > 2000) {
      logger.warn(`[Slow API Call] ${method} ${endpoint} took ${duration}ms`, filters);
    }

    // Log cache hits/misses in console
    if (cached) {
      logger.debug(`✨ Cache hit: ${endpoint} (saved ${duration}ms)`);
    }
  }, [enabled]);

  /**
   * Track a cache hit (no API call made)
   */
  const trackCacheHit = useCallback((
    endpoint: string,
    estimatedDuration: number = 200 // Estimated time saved
  ) => {
    if (!enabled) return;

    const metric: APICallMetric = {
      endpoint,
      method: 'GET',
      duration: 0, // No actual call made
      timestamp: Date.now(),
      success: true,
      cached: true,
    };

    metricsRef.current = [...metricsRef.current.slice(-MAX_RECENT_CALLS + 1), metric];
    setMetrics(metricsRef.current);

    logger.debug(`✨ Cache hit: ${endpoint} (saved ~${estimatedDuration}ms)`);
  }, [enabled]);

  /**
   * Get comprehensive statistics
   */
  const getStats = useCallback((): MetricsStats => {
    const callsByEndpoint: Record<string, any> = {};
    let totalDuration = 0;
    let cacheHits = 0;
    let cacheMisses = 0;

    metrics.forEach(metric => {
      // Track cache hits/misses
      if (metric.cached) {
        cacheHits++;
      } else {
        cacheMisses++;
      }

      // Aggregate by endpoint
      if (!callsByEndpoint[metric.endpoint]) {
        callsByEndpoint[metric.endpoint] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          failures: 0,
        };
      }

      const endpointStats = callsByEndpoint[metric.endpoint];
      endpointStats.count++;
      endpointStats.totalDuration += metric.duration;

      if (!metric.success) {
        endpointStats.failures++;
      }

      totalDuration += metric.duration;
    });

    // Calculate averages
    Object.keys(callsByEndpoint).forEach(endpoint => {
      const stats = callsByEndpoint[endpoint];
      stats.avgDuration = stats.count > 0 ? stats.totalDuration / stats.count : 0;
    });

    const totalCalls = metrics.length;
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;
    const cacheHitRate = totalCalls > 0 ? (cacheHits / totalCalls) * 100 : 0;

    return {
      totalCalls,
      totalDuration,
      avgDuration,
      cacheHits,
      cacheMisses,
      cacheHitRate,
      callsByEndpoint,
      recentCalls: metrics.slice(-10), // Last 10 calls
    };
  }, [metrics]);

  /**
   * Clear all metrics
   */
  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    setMetrics([]);
    sessionStartRef.current = Date.now();
    logger.info('Metrics cleared');
  }, []);

  /**
   * Log current statistics to console
   */
  const logStats = useCallback(() => {
    const stats = getStats();

    console.group('📊 Chatwoot Performance Metrics');
    console.log('Total API Calls:', stats.totalCalls);
    console.log('Cache Hit Rate:', `${stats.cacheHitRate.toFixed(1)}%`);
    console.log('Cache Hits:', stats.cacheHits);
    console.log('Cache Misses:', stats.cacheMisses);
    console.log('Avg Call Duration:', `${stats.avgDuration.toFixed(0)}ms`);
    console.log('Total Duration:', `${(stats.totalDuration / 1000).toFixed(1)}s`);
    console.log('\nCalls by Endpoint:');
    console.table(stats.callsByEndpoint);
    console.log('\nRecent Calls:');
    console.table(stats.recentCalls.map(call => ({
      endpoint: call.endpoint,
      duration: `${call.duration}ms`,
      cached: call.cached ? '✨' : '❌',
      success: call.success ? '✅' : '❌',
      time: new Date(call.timestamp).toLocaleTimeString(),
    })));
    console.groupEnd();
  }, [getStats]);

  /**
   * Log stats periodically in development
   */
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (metrics.length > 0) {
        logStats();
      }
    }, 60000); // Log every minute

    return () => clearInterval(interval);
  }, [enabled, metrics.length, logStats]);

  return {
    trackAPICall,
    trackCacheHit,
    getStats,
    clearMetrics,
    logStats,
    metrics,
    enabled,
  };
};

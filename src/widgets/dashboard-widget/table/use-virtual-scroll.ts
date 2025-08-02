import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseVirtualScrollProps {
  data: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualScroll = ({
  data,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualScrollProps) => {
  const SCROLL_STEP = 100;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const totalHeight = useMemo(() => data.length * itemHeight, [data.length, itemHeight]);
  const visibleCount = useMemo(() => Math.ceil(containerHeight / itemHeight), [containerHeight, itemHeight]);
  
  const startIndex = useMemo(() => 
    Math.max(0, Math.floor(scrollTop / itemHeight) - overscan), 
    [scrollTop, itemHeight, overscan]
  );
  
  const endIndex = useMemo(() => 
    Math.min(data.length - 1, Math.floor(scrollTop / itemHeight) + visibleCount + overscan),
    [data.length, scrollTop, itemHeight, visibleCount, overscan]
  );

  const visibleData = useMemo(() => {
    return data.slice(startIndex, endIndex + 1);
  }, [data, startIndex, endIndex]);

  const offsetY = useMemo(() => startIndex * itemHeight, [startIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!event.currentTarget) return;
    
    // Capture the scroll position immediately
    const scrollTop = event.currentTarget.scrollTop;
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(scrollTop);
    });
  }, []);
  const scrollLeft = (direction) => {
    const {scrollLeft} = containerRef.current;
    containerRef.current.scrollTo({
        left: scrollLeft + (direction === "right" ? SCROLL_STEP : -SCROLL_STEP),
        behavior: "smooth",
    });
    //checkScrollPosition();
};
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current && containerRef.current.scrollTop !== undefined) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    totalHeight,
    visibleData,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
    scrollToIndex,
    scrollLeft
  };
}; 
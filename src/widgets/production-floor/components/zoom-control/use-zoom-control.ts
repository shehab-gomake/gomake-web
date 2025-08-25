import { useState, useCallback } from "react";

interface UseZoomControlProps {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export const useZoomControl = ({
  initialZoom = 1.0,
  minZoom = 0.5,
  maxZoom = 2.0,
  zoomStep = 0.1,
}: UseZoomControlProps = {}) => {
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  const zoomIn = useCallback(() => {
    setCurrentZoom((prev) => {
      const newZoom = Math.min(prev + zoomStep, maxZoom);
      return Math.round(newZoom * 100) / 100; // Round to 2 decimal places
    });
  }, [maxZoom, zoomStep]);

  const zoomOut = useCallback(() => {
    setCurrentZoom((prev) => {
      const newZoom = Math.max(prev - zoomStep, minZoom);
      return Math.round(newZoom * 100) / 100; // Round to 2 decimal places
    });
  }, [minZoom, zoomStep]);

  const resetZoom = useCallback(() => {
    setCurrentZoom(initialZoom);
  }, [initialZoom]);

  const setZoom = useCallback(
    (zoom: number) => {
      const clampedZoom = Math.max(minZoom, Math.min(zoom, maxZoom));
      setCurrentZoom(Math.round(clampedZoom * 100) / 100);
    },
    [minZoom, maxZoom]
  );

  return {
    currentZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    minZoom,
    maxZoom,
  };
};

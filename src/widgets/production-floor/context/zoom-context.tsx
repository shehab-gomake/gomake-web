import React, { createContext, useContext, ReactNode } from "react";
import { useZoomControl } from "@/widgets/production-floor/components/zoom-control";

interface ZoomContextType {
  currentZoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  minZoom: number;
  maxZoom: number;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

interface ZoomProviderProps {
  children: ReactNode;
}

export const ZoomProvider = ({ children }: ZoomProviderProps) => {
  const zoomControl = useZoomControl();

  return (
    <ZoomContext.Provider value={zoomControl}>{children}</ZoomContext.Provider>
  );
};

export const useZoomContext = (): ZoomContextType => {
  const context = useContext(ZoomContext);
  if (context === undefined) {
    throw new Error("useZoomContext must be used within a ZoomProvider");
  }
  return context;
};

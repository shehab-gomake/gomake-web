import React, { ReactNode } from "react";
import { useZoomContext } from "@/widgets/production-floor/context/zoom-context";

interface ZoomWrapperProps {
  children: ReactNode;
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({ children }) => {
  const { currentZoom } = useZoomContext();

  return (
    <div
      style={{
        transform: `scale(${currentZoom})`,
        transformOrigin: "top left",
        transition: "transform 0.2s ease-in-out",
        width: `${100 / currentZoom}%`,
        height: `${100 / currentZoom}%`,
      }}
    >
      {children}
    </div>
  );
};

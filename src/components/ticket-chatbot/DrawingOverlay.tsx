'use client';

import { useEffect, useRef } from 'react';

interface DrawingOverlayProps {
  isSharing: boolean;
  onDrawing?: (drawingData: DrawingData) => void;
}

interface DrawingData {
  type: 'draw' | 'erase' | 'clear';
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  color?: string;
  brushSize?: number;
}

export default function DrawingOverlay({ isSharing }: DrawingOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update canvas size to match screen resolution (not window size)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      // Use screen.width and screen.height for actual screen resolution
      // This ensures drawings match the shared screen dimensions
      canvas.width = screen.width;
      canvas.height = screen.height;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Expose canvas ref globally so it can be accessed from the parent
  useEffect(() => {
    if (canvasRef.current && typeof window !== 'undefined') {
      (window as any).__drawingCanvasRef = canvasRef.current;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__drawingCanvasRef;
      }
    };
  }, []);

  if (!isSharing) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Helper function to apply drawing to overlay
export const applyDrawingToOverlay = (drawingData: DrawingData) => {
  const canvas = (typeof window !== 'undefined' ? (window as any).__drawingCanvasRef : null) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (drawingData.type === 'clear') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (drawingData.type === 'erase') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = (drawingData.brushSize || 3) * 2;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = drawingData.color || '#FF0000';
    ctx.lineWidth = drawingData.brushSize || 3;
  }

  // Convert normalized coordinates (0-1) to actual screen coordinates
  const screenX = drawingData.x * canvas.width;
  const screenY = drawingData.y * canvas.height;
  const prevScreenX = drawingData.prevX !== undefined ? drawingData.prevX * canvas.width : undefined;
  const prevScreenY = drawingData.prevY !== undefined ? drawingData.prevY * canvas.height : undefined;

  ctx.beginPath();
  if (prevScreenX !== undefined && prevScreenY !== undefined) {
    ctx.moveTo(prevScreenX, prevScreenY);
  } else {
    ctx.moveTo(screenX, screenY);
  }
  ctx.lineTo(screenX, screenY);
  ctx.stroke();
};


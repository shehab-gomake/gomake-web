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

  // Update canvas size to match actual shared screen dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      // Check if we have stored screen share dimensions
      if (typeof (window as any).__screenShareDimensions !== 'undefined') {
        const dims = (window as any).__screenShareDimensions;
        if (dims.width && dims.height) {
          // Use actual shared screen dimensions
          canvas.width = dims.width;
          canvas.height = dims.height;
          console.log('📊 DrawingOverlay canvas size set to shared dimensions:', {
            width: dims.width,
            height: dims.height,
            displaySurface: dims.displaySurface,
          });
          return;
        }
      }
      
      // Fallback: Use screen resolution if dimensions not available
      canvas.width = screen.width;
      canvas.height = screen.height;
      console.log('📊 DrawingOverlay canvas size set to screen resolution (fallback):', {
        width: screen.width,
        height: screen.height,
      });
    };

    // Initial update
    updateCanvasSize();
    
    // Update on window resize
    window.addEventListener('resize', updateCanvasSize);
    
    // Poll for dimensions if not available yet (they're set when screen sharing starts)
    const pollInterval = setInterval(() => {
      if (typeof (window as any).__screenShareDimensions !== 'undefined') {
        const dims = (window as any).__screenShareDimensions;
        if (dims.width && dims.height && (canvas.width !== dims.width || canvas.height !== dims.height)) {
          updateCanvasSize();
        }
      }
    }, 500); // Check every 500ms

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearInterval(pollInterval);
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
    // Clear the auto-clear timer when manually clearing
    if ((window as any).__drawingClearTimeout) {
      clearTimeout((window as any).__drawingClearTimeout);
      (window as any).__drawingClearTimeout = null;
    }
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

  // Reset auto-clear timer: clear all drawings after 30 seconds of inactivity
  if ((window as any).__drawingClearTimeout) {
    clearTimeout((window as any).__drawingClearTimeout);
  }
  
  (window as any).__drawingClearTimeout = setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    (window as any).__drawingClearTimeout = null;
  }, 30000); // 30 seconds
};


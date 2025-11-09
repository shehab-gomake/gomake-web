import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import BrushIcon from '@mui/icons-material/Brush';
import { useTranslation } from 'react-i18next';

interface ScreenshotAnnotationModalProps {
  open: boolean;
  screenshotFile: File | null;
  onClose: () => void;
  onSave: (annotatedFile: File) => void;
}

export const ScreenshotAnnotationModal = ({
  open,
  screenshotFile,
  onClose,
  onSave,
}: ScreenshotAnnotationModalProps) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF0000'); // Red by default
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const colors = [
    '#FF0000', // Red
    '#0000FF', // Blue
    '#00FF00', // Green
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#000000', // Black
    '#FFFFFF', // White
  ];

  // Load image when screenshot file changes
  useEffect(() => {
    if (!open || !screenshotFile) {
      setImageLoaded(false);
      return;
    }

    let objectUrl: string | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let retryTimeoutId: NodeJS.Timeout | null = null;

    // Wait for canvas to be available
    const loadImage = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        // Retry after a short delay if canvas is not ready
        retryTimeoutId = setTimeout(loadImage, 100);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2d context from canvas');
        return;
      }

      setImageLoaded(false);
      setHistory([]);
      setHistoryStep(-1);

      const img = new Image();

      img.onload = () => {
        try {
          imageRef.current = img;
          
          // Keep canvas at full resolution for quality
          const canvasWidth = img.width;
          const canvasHeight = img.height;
          
          // Set canvas internal resolution (full size for quality)
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          // Calculate display size to fit within max dimensions while maintaining aspect ratio
          const maxDisplayWidth = 1200;
          const maxDisplayHeight = 800;
          let displayWidth = canvasWidth;
          let displayHeight = canvasHeight;
          
          if (displayWidth > maxDisplayWidth || displayHeight > maxDisplayHeight) {
            const scale = Math.min(maxDisplayWidth / displayWidth, maxDisplayHeight / displayHeight);
            displayWidth = Math.floor(displayWidth * scale);
            displayHeight = Math.floor(displayHeight * scale);
          }
          
          // Set canvas display size (CSS) - scaled for UI, but internal resolution stays full
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;
          
          // Draw image on canvas at full resolution
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          
          // Save initial state to history
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setHistory([imageData]);
          setHistoryStep(0);
          setImageLoaded(true);
        } catch (error) {
          console.error('Error processing image:', error);
          setImageLoaded(false);
        }
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        console.error('Image src:', img.src);
        setImageLoaded(false);
      };
      
      try {
        objectUrl = URL.createObjectURL(screenshotFile);
        img.src = objectUrl;
        console.log('Loading image from blob URL:', objectUrl.substring(0, 50));
      } catch (error) {
        console.error('Error creating object URL:', error);
        setImageLoaded(false);
      }
    };

    // Start loading after a small delay to ensure DOM is ready
    timeoutId = setTimeout(loadImage, 50);
    
    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [screenshotFile, open]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    // Scale coordinates from display size to internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    // Configure drawing context
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Start a new path
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);
    
    // Continue the path and draw incrementally
    // This creates smooth continuous lines
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Close the current path
    ctx.beginPath();
    
    setIsDrawing(false);
    
    // Save to history after a brief delay to ensure canvas is updated
    setTimeout(() => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(imageData);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }, 10);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newStep = historyStep - 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newStep = historyStep + 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current) return;

    // Redraw original image
    ctx.drawImage(imageRef.current, 0, 0);
    
    // Save to history
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) {
      console.error('Canvas or image not available for saving');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return;
    }

    // Ensure any pending drawing operations are complete
    if (isDrawing) {
      setIsDrawing(false);
      // Force a final stroke to ensure the last drawing is complete
      ctx.stroke();
    }

    // Save the canvas directly - it should already have all the drawings
    canvas.toBlob((blob) => {
      if (blob && screenshotFile) {
        const annotatedFile = new File([blob], screenshotFile.name, { type: 'image/png' });
        onSave(annotatedFile);
        onClose();
      }
    }, 'image/png', 1.0);
  };

  const handleClose = () => {
    // Reset state
    setIsDrawing(false);
    setHistory([]);
    setHistoryStep(-1);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {t('tickets.annotateScreenshot') || 'Annotate Screenshot'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {/* Drawing Tools */}
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            {/* Color Picker */}
            <Box display="flex" alignItems="center" gap={1}>
              <BrushIcon />
              <Typography variant="body2">
                {t('tickets.color') || 'Color'}:
              </Typography>
              {colors.map((c) => (
                <Box
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: c,
                    border: color === c ? '3px solid #1976d2' : '2px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Brush Size */}
            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 150 }}>
              <Typography variant="body2">
                {t('tickets.size') || 'Size'}:
              </Typography>
              <Slider
                value={brushSize}
                onChange={(e, value) => setBrushSize(value as number)}
                min={1}
                max={20}
                sx={{ width: 100 }}
              />
              <Typography variant="body2" sx={{ minWidth: 30 }}>
                {brushSize}px
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={1}>
              <IconButton
                onClick={undo}
                disabled={historyStep <= 0}
                size="small"
                title={t('tickets.undo') || 'Undo'}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                size="small"
                title={t('tickets.redo') || 'Redo'}
              >
                <RedoIcon />
              </IconButton>
              <IconButton
                onClick={clear}
                size="small"
                title={t('tickets.clear') || 'Clear'}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Canvas */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '60vh',
              backgroundColor: '#f5f5f5',
              minHeight: '400px',
              position: 'relative',
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                cursor: imageLoaded ? 'crosshair' : 'default',
                maxWidth: '100%',
                maxHeight: '60vh',
                display: 'block',
                border: '1px solid #ddd',
                opacity: imageLoaded ? 1 : 0,
              }}
            />
            {!imageLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(245, 245, 245, 0.9)',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Loading image...
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t('tickets.cancel') || 'Cancel'}
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t('tickets.save') || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


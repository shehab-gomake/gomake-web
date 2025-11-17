import { ControlCommand } from "./use-webrtc-sender";

/**
 * Scales normalized coordinates (0-1) to actual viewport coordinates
 * Handles both tab and browser window sharing differently
 */
const scaleCoordinates = (x: number, y: number): { x: number; y: number } => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get stored screen share dimensions and display surface type
  if (typeof (window as any).__screenShareDimensions !== 'undefined') {
    const dims = (window as any).__screenShareDimensions;
    const displaySurface = dims.displaySurface;
    
    if (dims.width && dims.height) {
      if (displaySurface === 'window') {
        // Browser window sharing: video may include browser chrome or show viewport content
        // Try direct viewport scaling first (simplest approach)
        // If video dimensions are close to viewport, assume video shows viewport content
        const videoWidth = dims.width;
        const videoHeight = dims.height;
        
        const videoToViewportDiff = Math.abs(videoWidth - viewportWidth) + Math.abs(videoHeight - viewportHeight);
        
        // If video dimensions are very close to viewport, use direct scaling
        if (videoToViewportDiff < 10) {
          // Video likely shows viewport content - scale directly
          const actualX = x * viewportWidth;
          const actualY = y * viewportHeight;
          
          console.log('🖱️ Browser window (direct viewport scaling):', {
            normalized: { x, y },
            video: { width: videoWidth, height: videoHeight },
            viewport: { width: viewportWidth, height: viewportHeight },
            viewportCoords: { x: actualX, y: actualY },
          });
          
          return { x: actualX, y: actualY };
        }
        
        // Video dimensions differ from viewport - likely includes chrome
        // Get window outer dimensions
        const windowOuterWidth = dims.windowOuterWidth || (typeof window.outerWidth !== 'undefined' ? window.outerWidth : videoWidth);
        const windowOuterHeight = dims.windowOuterHeight || (typeof window.outerHeight !== 'undefined' ? window.outerHeight : videoHeight);
        
        // Calculate chrome offsets
        const chromeTop = windowOuterHeight - viewportHeight;
        const chromeLeft = Math.max(0, (windowOuterWidth - viewportWidth) / 2);
        
        // Map normalized coordinates to video pixel coordinates
        const videoX = x * videoWidth;
        const videoY = y * videoHeight;
        
        // Scale to window coordinates if video dimensions don't match
        let windowX: number;
        let windowY: number;
        
        if (Math.abs(videoWidth - windowOuterWidth) < 2 && Math.abs(videoHeight - windowOuterHeight) < 2) {
          windowX = videoX;
          windowY = videoY;
        } else {
          // Scale proportionally
          const scaleX = windowOuterWidth / videoWidth;
          const scaleY = windowOuterHeight / videoHeight;
          windowX = videoX * scaleX;
          windowY = videoY * scaleY;
        }
        
        // Map to viewport by subtracting chrome offsets
        let actualX = windowX - chromeLeft;
        let actualY = windowY - chromeTop;
        
        // Clamp to viewport bounds
        actualX = Math.max(0, Math.min(viewportWidth, actualX));
        actualY = Math.max(0, Math.min(viewportHeight, actualY));
        
        console.log('🖱️ Browser window (with chrome offset):', {
          normalized: { x, y },
          video: { width: videoWidth, height: videoHeight },
          windowOuter: { width: windowOuterWidth, height: windowOuterHeight },
          viewport: { width: viewportWidth, height: viewportHeight },
          chrome: { top: chromeTop, left: chromeLeft },
          videoCoords: { x: videoX, y: videoY },
          windowCoords: { x: windowX, y: windowY },
          viewportCoords: { x: actualX, y: actualY },
        });
        
        return { x: actualX, y: actualY };
      } else {
        // Tab sharing: video dimensions match viewport, use aspect ratio scaling
        const videoAspect = dims.width / dims.height;
        const viewportAspect = viewportWidth / viewportHeight;
        
        let actualX: number;
        let actualY: number;
        
        // Scale maintaining video aspect ratio
        if (videoAspect > viewportAspect) {
          // Video is wider - scale to viewport width, calculate height maintaining aspect
          actualX = x * viewportWidth;
          actualY = y * (viewportWidth / videoAspect);
          // Center vertically if needed
          const scaledHeight = viewportWidth / videoAspect;
          if (scaledHeight < viewportHeight) {
            actualY += (viewportHeight - scaledHeight) / 2;
          }
        } else {
          // Video is taller - scale to viewport height, calculate width maintaining aspect
          actualX = x * (viewportHeight * videoAspect);
          actualY = y * viewportHeight;
          // Center horizontally if needed
          const scaledWidth = viewportHeight * videoAspect;
          if (scaledWidth < viewportWidth) {
            actualX += (viewportWidth - scaledWidth) / 2;
          }
        }
        
        return { x: actualX, y: actualY };
      }
    }
  }
  
  // Fallback: direct scaling
  return {
    x: x * viewportWidth,
    y: y * viewportHeight,
  };
};

/**
 * Executes a control command on the user's screen
 * This function creates and dispatches synthetic events to simulate user input
 */
export const executeControlCommand = (command: ControlCommand): boolean => {
  try {
    const { type, action, data } = command;

    switch (type) {
      case 'mouse': {
        return handleMouseCommand(action, data);
      }
      case 'keyboard': {
        return handleKeyboardCommand(action, data);
      }
      case 'scroll': {
        return handleScrollCommand(data);
      }
      case 'focus': {
        return handleFocusCommand(data);
      }
      default: {
        console.warn('⚠️ Unknown control command type:', type);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error executing control command:', error);
    return false;
  }
};

/**
 * Handles mouse commands (click, mousedown, mouseup, mousemove)
 */
const handleMouseCommand = (action: string, data: ControlCommand['data']): boolean => {
  if (data.x === undefined || data.y === undefined) {
    console.warn('⚠️ Mouse command missing coordinates');
    return false;
  }

  // Scale normalized coordinates (0-1) to actual coordinates
  const { x: actualX, y: actualY } = scaleCoordinates(data.x!, data.y!);
  
  // Log scaling details for debugging
  const dims = (window as any).__screenShareDimensions;
  if (dims) {
    console.log('🖱️ Scaling coordinates:', {
      normalized: { x: data.x, y: data.y },
      displaySurface: dims.displaySurface,
      video: dims.width && dims.height ? { width: dims.width, height: dims.height } : undefined,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scaled: { x: actualX, y: actualY },
    });
  }

  // Find element at coordinates
  // Use Math.round to ensure we're using integer pixel coordinates
  const pixelX = Math.round(actualX);
  const pixelY = Math.round(actualY);
  
  console.log('🖱️ Finding element at pixel coordinates:', { 
    x: pixelX, 
    y: pixelY,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    scroll: { x: window.scrollX || window.pageXOffset, y: window.scrollY || window.pageYOffset },
  });
  
  let element = document.elementFromPoint(pixelX, pixelY);
  if (!element) {
    console.warn('⚠️ No element found at coordinates:', pixelX, pixelY);
    // Try a few nearby pixels as fallback
    for (const offset of [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]) {
      const fallbackElement = document.elementFromPoint(pixelX + offset.x, pixelY + offset.y);
      if (fallbackElement) {
        console.log('✅ Found element at offset:', offset, fallbackElement);
        element = fallbackElement;
        break;
      }
    }
    if (!element) {
      return false;
    }
  }
  
  // Log element details for debugging
  if (element instanceof HTMLElement) {
    const rect = element.getBoundingClientRect();
    console.log('🎯 Target element found:', {
      tag: element.tagName,
      id: element.id,
      className: element.className.substring(0, 50), // Truncate long class names
      rect: {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      clickPosition: {
        relativeX: Math.round(pixelX - rect.left),
        relativeY: Math.round(pixelY - rect.top),
      },
      isClickable: element.onclick !== null || element.tagName === 'BUTTON' || element.tagName === 'A',
    });
  }

  // Create mouse event options
  // Use the same rounded pixel coordinates
  
  const eventOptions: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: pixelX,
    clientY: pixelY,
    screenX: pixelX + window.screenX,
    screenY: pixelY + window.screenY,
    button: data.button || 0,
    buttons: data.button === 0 ? 1 : data.button === 1 ? 4 : 2,
    ctrlKey: data.ctrlKey || false,
    shiftKey: data.shiftKey || false,
    altKey: data.altKey || false,
    metaKey: data.metaKey || false,
  };
  
  console.log('🖱️ Mouse event options:', {
    action,
    pixelCoords: { x: pixelX, y: pixelY },
    actualCoords: { x: actualX, y: actualY },
    button: data.button,
  });

  // For click actions, try using native .click() method first (more reliable)
  if (action === 'click' && element instanceof HTMLElement) {
    // For input/textarea elements, focus and set cursor position
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus();
      // Set cursor to end of text
      const value = element.value || '';
      element.setSelectionRange(value.length, value.length);
    } else {
      // Focus other elements
      element.focus();
    }
    
    // Try native click method - this is more reliable than synthetic events
    try {
      element.click();
      console.log(`🖱️ Native click() executed on`, element);
      return true;
    } catch (error) {
      console.warn('⚠️ Native click() failed, falling back to synthetic event:', error);
      // Fall through to synthetic event dispatch
    }
  }

  // Create and dispatch appropriate mouse event
  let event: MouseEvent;
  switch (action) {
    case 'mousedown':
      event = new MouseEvent('mousedown', eventOptions);
      break;
    case 'mouseup':
      event = new MouseEvent('mouseup', eventOptions);
      break;
    case 'click':
      // Dispatch both mousedown and mouseup, then click
      element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
      element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
      event = new MouseEvent('click', eventOptions);
      break;
    case 'mousemove':
      event = new MouseEvent('mousemove', eventOptions);
      break;
    case 'mouseenter':
      event = new MouseEvent('mouseenter', eventOptions);
      break;
    case 'mouseleave':
      event = new MouseEvent('mouseleave', eventOptions);
      break;
    case 'mouseover':
      event = new MouseEvent('mouseover', eventOptions);
      break;
    case 'mouseout':
      event = new MouseEvent('mouseout', eventOptions);
      break;
    case 'dblclick':
      event = new MouseEvent('dblclick', eventOptions);
      break;
    case 'contextmenu':
      event = new MouseEvent('contextmenu', eventOptions);
      break;
    default:
      console.warn('⚠️ Unknown mouse action:', action);
      return false;
  }

  // Focus element before dispatching (for clickable elements)
  if (action === 'click' || action === 'mousedown') {
    if (element instanceof HTMLElement) {
      // For input/textarea elements, also set cursor position
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.focus();
        const value = element.value || '';
        element.setSelectionRange(value.length, value.length);
      } else {
        element.focus();
      }
    }
  }

  const dispatched = element.dispatchEvent(event);
  console.log(`🖱️ Mouse ${action} executed at (${Math.round(actualX)}, ${Math.round(actualY)}) on`, element);
  return dispatched;
};

/**
 * Handles keyboard commands (keydown, keyup, keypress)
 * For text input elements, also handles direct value updates and InputEvent dispatch
 */
const handleKeyboardCommand = (action: string, data: ControlCommand['data']): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) {
    console.warn('⚠️ No active element for keyboard command');
    return false;
  }

  if (!data.key && !data.code) {
    console.warn('⚠️ Keyboard command missing key or code');
    return false;
  }

  const eventOptions: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    key: data.key || '',
    code: data.code || '',
    keyCode: data.keyCode,
    which: data.which,
    charCode: data.charCode,
    repeat: data.repeat || false,
    ctrlKey: data.ctrlKey || false,
    shiftKey: data.shiftKey || false,
    altKey: data.altKey || false,
    metaKey: data.metaKey || false,
  };

  // Check if active element is an input or textarea
  const isInputElement = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
  
  // Ensure input elements are focused before handling keyboard input
  if (isInputElement && (!document.activeElement || document.activeElement !== activeElement)) {
    (activeElement as HTMLElement).focus();
  }
  
  // Handle special keys that don't produce text
  const specialKeys = [
    'Backspace', 'Delete', 'Enter', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ];
  
  const isSpecialKey = specialKeys.includes(data.key || '') || 
                       (data.code && specialKeys.some(k => data.code?.includes(k)));

  // For text input elements and printable characters, handle value updates
  if (isInputElement && action === 'keypress' && !isSpecialKey && data.key && data.key.length === 1) {
    const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = input.value || '';
    const selectionStart = input.selectionStart || currentValue.length;
    const selectionEnd = input.selectionEnd || currentValue.length;
    
    let newValue = currentValue;
    let newSelectionStart = selectionStart;
    let newSelectionEnd = selectionEnd;

    // Handle the character insertion
    if (data.key === 'Enter' && input instanceof HTMLTextAreaElement) {
      // Allow Enter in textarea
      newValue = currentValue.slice(0, selectionStart) + '\n' + currentValue.slice(selectionEnd);
      newSelectionStart = newSelectionEnd = selectionStart + 1;
    } else if (data.key.length === 1) {
      // Regular character
      newValue = currentValue.slice(0, selectionStart) + data.key + currentValue.slice(selectionEnd);
      newSelectionStart = newSelectionEnd = selectionStart + 1;
    }

    // Update the input value directly
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype || window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, newValue);
    } else {
      // Fallback: use setAttribute or direct assignment
      (input as any).value = newValue;
    }

    // Set cursor position
    input.setSelectionRange(newSelectionStart, newSelectionEnd);

    // Dispatch input and change events to trigger React's onChange handlers
    // Use InputEvent for better React compatibility
    try {
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: data.key,
      });
      input.dispatchEvent(inputEvent);
    } catch (e) {
      // Fallback for browsers that don't support InputEvent constructor
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      input.dispatchEvent(inputEvent);
    }
    
    // Also dispatch change event
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    input.dispatchEvent(changeEvent);
    
    console.log(`⌨️ Text input updated: "${data.key}" -> "${newValue.substring(0, 50)}..."`);
  }

  // Handle special keys (Backspace, Delete, etc.)
  if (isInputElement && action === 'keydown' && isSpecialKey) {
    const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = input.value || '';
    const selectionStart = input.selectionStart || currentValue.length;
    const selectionEnd = input.selectionEnd || currentValue.length;
    
    let newValue = currentValue;
    let newSelectionStart = selectionStart;
    let newSelectionEnd = selectionEnd;

    if (data.key === 'Backspace' || data.code === 'Backspace') {
      if (selectionStart === selectionEnd && selectionStart > 0) {
        // Delete character before cursor
        newValue = currentValue.slice(0, selectionStart - 1) + currentValue.slice(selectionStart);
        newSelectionStart = newSelectionEnd = selectionStart - 1;
      } else if (selectionStart !== selectionEnd) {
        // Delete selected text
        newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd);
        newSelectionStart = newSelectionEnd = selectionStart;
      }
    } else if (data.key === 'Delete' || data.code === 'Delete') {
      if (selectionStart === selectionEnd && selectionEnd < currentValue.length) {
        // Delete character after cursor
        newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionStart + 1);
        newSelectionStart = newSelectionEnd = selectionStart;
      } else if (selectionStart !== selectionEnd) {
        // Delete selected text
        newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd);
        newSelectionStart = newSelectionEnd = selectionStart;
      }
    } else if (data.key === 'ArrowLeft' || data.code === 'ArrowLeft') {
      newSelectionStart = newSelectionEnd = Math.max(0, selectionStart - 1);
    } else if (data.key === 'ArrowRight' || data.code === 'ArrowRight') {
      newSelectionStart = newSelectionEnd = Math.min(currentValue.length, selectionEnd + 1);
    } else if (data.key === 'Home' || data.code === 'Home') {
      newSelectionStart = newSelectionEnd = 0;
    } else if (data.key === 'End' || data.code === 'End') {
      newSelectionStart = newSelectionEnd = currentValue.length;
    }

    if (newValue !== currentValue || newSelectionStart !== selectionStart) {
      // Update the input value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype || window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, newValue);
      } else {
        (input as any).value = newValue;
      }

      // Set cursor position
      input.setSelectionRange(newSelectionStart, newSelectionEnd);

      // Dispatch input and change events
      try {
        const inputType = data.key === 'Backspace' ? 'deleteContentBackward' : 
                         data.key === 'Delete' ? 'deleteContentForward' : 'insertText';
        const inputEvent = new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: inputType,
          data: data.key === 'Backspace' || data.key === 'Delete' ? null : data.key,
        });
        input.dispatchEvent(inputEvent);
      } catch (e) {
        // Fallback for browsers that don't support InputEvent constructor
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        input.dispatchEvent(inputEvent);
      }
      
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      input.dispatchEvent(changeEvent);
      
      console.log(`⌨️ Special key handled: ${data.key} -> "${newValue.substring(0, 50)}..."`);
    }
  }

  // Dispatch keyboard events (for event listeners that might depend on them)
  let event: KeyboardEvent;
  switch (action) {
    case 'keydown':
      event = new KeyboardEvent('keydown', eventOptions);
      break;
    case 'keyup':
      event = new KeyboardEvent('keyup', eventOptions);
      break;
    case 'keypress':
      event = new KeyboardEvent('keypress', eventOptions);
      break;
    default:
      console.warn('⚠️ Unknown keyboard action:', action);
      return false;
  }

  const dispatched = activeElement.dispatchEvent(event);
  console.log(`⌨️ Keyboard ${action} executed:`, data.key || data.code, 'on', activeElement);
  return dispatched;
};

/**
 * Handles scroll commands
 */
const handleScrollCommand = (data: ControlCommand['data']): boolean => {
  const deltaX = data.deltaX || 0;
  const deltaY = data.deltaY || 0;

  if (deltaX === 0 && deltaY === 0) {
    console.warn('⚠️ Scroll command missing delta values');
    return false;
  }

  // Find scrollable element at mouse position (if coordinates provided)
  let targetElement: Element | null = null;
  if (data.x !== undefined && data.y !== undefined) {
    // Scale normalized coordinates using the same logic as mouse commands
    const { x: actualX, y: actualY } = scaleCoordinates(data.x, data.y);
    targetElement = document.elementFromPoint(Math.round(actualX), Math.round(actualY));
  }

  // Use the scrollable element or window
  const scrollTarget = targetElement || window;

  const eventOptions: WheelEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    deltaX,
    deltaY,
    deltaZ: 0,
    deltaMode: WheelEvent.DOM_DELTA_PIXEL,
    ctrlKey: data.ctrlKey || false,
    shiftKey: data.shiftKey || false,
    altKey: data.altKey || false,
    metaKey: data.metaKey || false,
  };

  const event = new WheelEvent('wheel', eventOptions);

  if (targetElement) {
    const dispatched = targetElement.dispatchEvent(event);
    console.log(`🖱️ Scroll executed on element:`, targetElement, `delta: (${deltaX}, ${deltaY})`);
    return dispatched;
  } else {
    // Scroll window
    window.scrollBy(deltaX, deltaY);
    console.log(`🖱️ Window scroll executed:`, `delta: (${deltaX}, ${deltaY})`);
    return true;
  }
};

/**
 * Handles focus commands
 */
const handleFocusCommand = (data: ControlCommand['data']): boolean => {
  if (data.x === undefined || data.y === undefined) {
    console.warn('⚠️ Focus command missing coordinates');
    return false;
  }

  // Scale normalized coordinates using the same logic as mouse commands
  const { x: actualX, y: actualY } = scaleCoordinates(data.x, data.y);
  const element = document.elementFromPoint(Math.round(actualX), Math.round(actualY));
  if (!element) {
    console.warn('⚠️ No element found at coordinates for focus');
    return false;
  }

  if (element instanceof HTMLElement) {
    // For input/textarea elements, also set cursor position
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus();
      // Set cursor to end of text if it's an input field
      const value = element.value || '';
      element.setSelectionRange(value.length, value.length);
    } else {
      element.focus();
    }
    console.log(`👁️ Focus executed on:`, element);
    return true;
  }

  return false;
};


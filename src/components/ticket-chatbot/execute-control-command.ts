import { ControlCommand } from "./use-webrtc-sender";

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

  // Scale normalized coordinates (0-1) to actual screen size
  const actualX = data.x * window.innerWidth;
  const actualY = data.y * window.innerHeight;

  // Find element at coordinates
  const element = document.elementFromPoint(actualX, actualY);
  if (!element) {
    console.warn('⚠️ No element found at coordinates:', actualX, actualY);
    return false;
  }

  // Create mouse event options
  const eventOptions: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: actualX,
    clientY: actualY,
    screenX: actualX + window.screenX,
    screenY: actualY + window.screenY,
    button: data.button || 0,
    buttons: data.button === 0 ? 1 : data.button === 1 ? 4 : 2,
    ctrlKey: data.ctrlKey || false,
    shiftKey: data.shiftKey || false,
    altKey: data.altKey || false,
    metaKey: data.metaKey || false,
  };

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
      element.focus();
    }
  }

  const dispatched = element.dispatchEvent(event);
  console.log(`🖱️ Mouse ${action} executed at (${actualX}, ${actualY}) on`, element);
  return dispatched;
};

/**
 * Handles keyboard commands (keydown, keyup, keypress)
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
    ctrlKey: data.ctrlKey || false,
    shiftKey: data.shiftKey || false,
    altKey: data.altKey || false,
    metaKey: data.metaKey || false,
  };

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
    const actualX = data.x * window.innerWidth;
    const actualY = data.y * window.innerHeight;
    targetElement = document.elementFromPoint(actualX, actualY);
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

  const actualX = data.x * window.innerWidth;
  const actualY = data.y * window.innerHeight;

  const element = document.elementFromPoint(actualX, actualY);
  if (!element) {
    console.warn('⚠️ No element found at coordinates for focus');
    return false;
  }

  if (element instanceof HTMLElement) {
    element.focus();
    console.log(`👁️ Focus executed on:`, element);
    return true;
  }

  return false;
};


import React, { ComponentType } from 'react';
import { useTheme } from './useTheme';

/**
 * Higher-Order Component that applies theme-based page overrides
 * 
 * Usage:
 * ```tsx
 * const HomePage = () => <div>Base Home</div>;
 * export default withThemeOverride('HomePage', HomePage);
 * ```
 * 
 * @param pageName - Name of the page to check for overrides
 * @param BaseComponent - The base page component to render if no override exists
 * @returns Wrapped component that uses theme override if available
 */
export function withThemeOverride<P extends object>(
  pageName: string,
  BaseComponent: ComponentType<P>
): ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const { getPageOverride } = useTheme();
    
    // Try to get theme override for this page
    const OverrideComponent = getPageOverride<P>(pageName);
    
    // Use override if available, otherwise use base
    const ComponentToRender = OverrideComponent || BaseComponent;
    
    return <ComponentToRender {...props} />;
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withThemeOverride(${pageName})`;

  return WrappedComponent;
}


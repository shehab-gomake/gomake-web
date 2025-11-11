import { ComponentType } from "react";
import { useTheme } from "./useTheme";

/**
 * Hook to get a theme-aware component with fallback
 *
 * Usage:
 * ```tsx
 * const HomePageComponent = useThemeComponent('HomePageComponent', BaseHomePageComponent);
 * return <HomePageComponent {...props} />;
 * ```
 *
 * @param componentName - Name of the component to check for overrides
 * @param BaseComponent - The base component to use if no override exists
 * @returns The override component if available, otherwise the base component
 */
export function useThemeComponent<P = any>(
  componentName: string,
  BaseComponent: ComponentType<P>
): ComponentType<P> {
  const { getComponentOverride } = useTheme();

  // Try to get theme override for this component
  const OverrideComponent = getComponentOverride<P>(componentName);

  // Use override if available, otherwise use base
  return OverrideComponent || BaseComponent;
}

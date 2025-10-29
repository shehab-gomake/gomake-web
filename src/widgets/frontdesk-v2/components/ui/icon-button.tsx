import React from "react";
import { frontdeskV2Theme } from "../../styles/theme";

export interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "default" | "primary" | "ghost";
  disabled?: boolean;
  ariaLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  size = "medium",
  variant = "default",
  disabled = false,
  ariaLabel,
}) => {
  const sizeStyles = {
    small: {
      width: "32px",
      height: "32px",
    },
    medium: {
      width: "40px",
      height: "40px",
    },
    large: {
      width: "48px",
      height: "48px",
    },
  };

  const variantStyles = {
    default: {
      color: frontdeskV2Theme.colors.text.secondary,
      backgroundColor: "transparent",
      hover: {
        backgroundColor: frontdeskV2Theme.colors.background.hover,
        color: frontdeskV2Theme.colors.text.primary,
      },
    },
    primary: {
      color: frontdeskV2Theme.colors.brand.primary,
      backgroundColor: "transparent",
      hover: {
        backgroundColor: frontdeskV2Theme.colors.background.hover,
        color: frontdeskV2Theme.colors.brand.secondary,
      },
    },
    ghost: {
      color: frontdeskV2Theme.colors.text.tertiary,
      backgroundColor: "transparent",
      hover: {
        backgroundColor: "transparent",
        color: frontdeskV2Theme.colors.text.secondary,
      },
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: frontdeskV2Theme.spacing[2],
        cursor: disabled ? "not-allowed" : "pointer",
        transition: frontdeskV2Theme.transitions.default,
        opacity: disabled ? 0.5 : 1,
        ...currentSize,
        color: isHovered && !disabled ? currentVariant.hover.color : currentVariant.color,
        backgroundColor:
          isHovered && !disabled ? currentVariant.hover.backgroundColor : currentVariant.backgroundColor,
      }}
    >
      {children}
    </button>
  );
};

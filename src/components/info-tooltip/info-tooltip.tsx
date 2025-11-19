import React, { ReactNode, ReactElement } from "react";
import { Tooltip, TooltipProps } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";

export interface IInfoTooltipProps {
  content: string | ReactNode;
  /**
   * The element to wrap with tooltip. Must be a valid ReactElement (not a string or primitive)
   */
  children?: ReactElement;
  /**
   * Custom icon component to use instead of default InfoOutlinedIcon
   */
  icon?: ReactElement;
  tooltipProps?: Partial<TooltipProps>;
  maxWidth?: number;
  maxHeight?: number;
  iconSx?: any;
}

const InfoTooltip: React.FC<IInfoTooltipProps> = ({
  content,
  children,
  icon,
  tooltipProps,
  maxWidth = 320,
  maxHeight = 450,
  iconSx,
}) => {
  const { t } = useTranslation();

  // Determine what to display as tooltip content
  const tooltipContent =
    typeof content === "string" ? (
      <div style={{ whiteSpace: "pre-line", fontSize: "13px" }}>
        {t(content)}
      </div>
    ) : (
      content
    );

  // Default icon styling
  const defaultIconSx = {
    fontSize: "18px",
    color: "#9e9e9e",
    cursor: "pointer",
    "&:hover": {
      color: "#757575",
    },
    ...iconSx,
  };

  // Common tooltip styling props
  const commonTooltipProps = {
    title: tooltipContent,
    PopperProps: {
      sx: {
        "& .MuiTooltip-tooltip": {
          maxWidth,
          maxHeight,
          overflowY: "auto",
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "4px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.5)",
            },
          },
          // Firefox scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  // If children are provided, wrap them with tooltip
  if (children) {
    return (
      <Tooltip {...commonTooltipProps} {...tooltipProps}>
        {children}
      </Tooltip>
    );
  }

  // Otherwise, use default icon or custom icon
  const iconToRender = icon || <InfoOutlinedIcon sx={defaultIconSx} />;

  return (
    <Tooltip {...commonTooltipProps} {...tooltipProps}>
      {iconToRender}
    </Tooltip>
  );
};

export { InfoTooltip };

import React from "react";

interface HpIconProps {
  selected?: boolean;
  width?: number;
  height?: number;
}

export const HpApiTokenIcon: React.FC<HpIconProps> = ({
  selected = false,
  width = 16,
  height = 16,
}) => {
  const fillColor = selected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      stroke={fillColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8v4M12 16h.01"
      stroke={fillColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
  );
};

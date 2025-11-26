import React from "react";

interface ArrowRightIconProps {
  color?: string;
  style?: React.CSSProperties;
}

const ArrowRightIcon = ({ color = "#667085", style }: ArrowRightIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M6 12L10 8L6 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { ArrowRightIcon };

import React from "react";

interface HpIconProps {
  selected?: boolean;
  width?: number;
  height?: number;
}

export const HpMailingIcon: React.FC<HpIconProps> = ({
  selected = false,
  width = 16,
  height = 16,
}) => {
  const fillColor = selected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6673 4.66602L8.67332 8.48402C8.46991 8.60216 8.23888 8.66439 8.00365 8.66439C7.76843 8.66439 7.53739 8.60216 7.33398 8.48402L1.33398 4.66602"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.334 2.66602H2.66732C1.93094 2.66602 1.33398 3.26297 1.33398 3.99935V11.9993C1.33398 12.7357 1.93094 13.3327 2.66732 13.3327H13.334C14.0704 13.3327 14.6673 12.7357 14.6673 11.9993V3.99935C14.6673 3.26297 14.0704 2.66602 13.334 2.66602Z"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

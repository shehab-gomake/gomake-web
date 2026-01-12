import React from "react";

interface HpIconProps {
  selected?: boolean;
  width?: number;
  height?: number;
}

export const HpManageBillingIcon: React.FC<HpIconProps> = ({
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
        d="M13.334 3.33398H2.66732C1.93094 3.33398 1.33398 3.93094 1.33398 4.66732V11.334C1.33398 12.0704 1.93094 12.6673 2.66732 12.6673H13.334C14.0704 12.6673 14.6673 12.0704 14.6673 11.334V4.66732C14.6673 3.93094 14.0704 3.33398 13.334 3.33398Z"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.33398 6.66602H14.6673"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

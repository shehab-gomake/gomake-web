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
  const strokeColor = selected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
      <path d="M3 10h18" />
      <path d="M16 19h6" />
      <path d="M19 16l3 3l-3 3" />
      <path d="M7.005 15h.005" />
      <path d="M11 15h2" />
    </svg>
  );
};

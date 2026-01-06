import React from "react";

interface HpIconProps {
  selected?: boolean;
  width?: number;
  height?: number;
}

export const HpPreferencesIcon: React.FC<HpIconProps> = ({
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
        d="M2.66602 14.0007V9.33398"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.66602 6.66667V2"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 14V8"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 5.33333V2"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.334 13.9993V10.666"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.334 8V2"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.33398 9.33398H4.00065"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.66602 5.33398H9.33268"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 10.667H14.6667"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

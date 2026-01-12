import React from "react";

interface HpIconProps {
  selected?: boolean;
  width?: number;
  height?: number;
}

export const HpFileApiIcon: React.FC<HpIconProps> = ({
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
        d="M6.66732 8.33398L5.33398 10.0007L6.66732 11.6673"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.33398 8.33398L10.6673 10.0007L9.33398 11.6673"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.33398 1.33398V4.00065C9.33398 4.35427 9.47446 4.69341 9.72451 4.94346C9.97456 5.19351 10.3137 5.33398 10.6673 5.33398H13.334"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99935 1.33398H3.99935C3.64573 1.33398 3.30659 1.47446 3.05654 1.72451C2.80649 1.97456 2.66602 2.3137 2.66602 2.66732V13.334C2.66602 13.6876 2.80649 14.0267 3.05654 14.2768C3.30659 14.5268 3.64573 14.6673 3.99935 14.6673H11.9993C12.353 14.6673 12.6921 14.5268 12.9422 14.2768C13.1922 14.0267 13.3327 13.6876 13.3327 13.334V4.66732L9.99935 1.33398Z"
        stroke={fillColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

import React from "react";

interface HpUserIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const HpUserIcon: React.FC<HpUserIconProps> = ({
  width = 32,
  height = 32,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
        fill="#E0E0E0"
      />
      <path
        d="M20.6673 22V20.6667C20.6673 19.9594 20.3864 19.2811 19.8863 18.781C19.3862 18.281 18.7079 18 18.0007 18H14.0007C13.2934 18 12.6151 18.281 12.115 18.781C11.6149 19.2811 11.334 19.9594 11.334 20.6667V22"
        stroke="#A3A3A3"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0007 15.3333C17.4734 15.3333 18.6673 14.1394 18.6673 12.6667C18.6673 11.1939 17.4734 10 16.0007 10C14.5279 10 13.334 11.1939 13.334 12.6667C13.334 14.1394 14.5279 15.3333 16.0007 15.3333Z"
        stroke="#A3A3A3"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

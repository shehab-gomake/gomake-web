import React from "react";

interface OutlookIconProps {
  size?: number;
  color?: string;
}

export const OutlookIcon: React.FC<OutlookIconProps> = ({ size = 24, color = "#0078d4" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 2C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2H7ZM7 4H17V20H7V4ZM9 6V8H15V6H9ZM9 10V12H15V10H9ZM9 14V16H15V14H9Z"
        fill={color}
      />
      <path d="M11 6H13V8H11V6ZM11 10H13V12H11V10ZM11 14H13V16H11V14Z" fill="white" />
    </svg>
  );
};

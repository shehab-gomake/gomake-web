import React from "react";

interface HpNotificationsIconProps {
  width?: number;
  height?: number;
  className?: string;
  showBadge?: boolean;
}

export const HpNotificationsIcon: React.FC<HpNotificationsIconProps> = ({
  width = 24,
  height = 24,
  className,
  showBadge = true,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.55664 21.5C8.70293 21.7533 8.91332 21.9637 9.16668 22.11C9.42003 22.2563 9.70743 22.3333 9.99997 22.3333C10.2925 22.3333 10.5799 22.2563 10.8333 22.11C11.0866 21.9637 11.297 21.7533 11.4433 21.5"
        stroke="#A3A3A3"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.71772 16.7715C2.60886 16.8908 2.53702 17.0392 2.51094 17.1986C2.48486 17.358 2.50566 17.5215 2.57081 17.6693C2.63597 17.8171 2.74267 17.9428 2.87794 18.0311C3.0132 18.1193 3.17121 18.1664 3.33272 18.1665H16.6661C16.8276 18.1666 16.9856 18.1197 17.1209 18.0316C17.2563 17.9435 17.3631 17.818 17.4285 17.6703C17.4938 17.5226 17.5148 17.3591 17.4889 17.1997C17.4631 17.0402 17.3914 16.8918 17.2827 16.7723C16.1744 15.6298 14.9994 14.4157 14.9994 10.6665C14.9994 9.34042 14.4726 8.06865 13.5349 7.13097C12.5972 6.19329 11.3255 5.6665 9.99939 5.6665C8.67331 5.6665 7.40154 6.19329 6.46386 7.13097C5.52618 8.06865 4.99939 9.34042 4.99939 10.6665C4.99939 14.4157 3.82356 15.6298 2.71772 16.7715Z"
        stroke="#A3A3A3"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showBadge && (
        <path
          d="M16 4C16 1.79086 17.7909 0 20 0C22.2091 0 24 1.79086 24 4C24 6.20914 22.2091 8 20 8C17.7909 8 16 6.20914 16 4Z"
          fill="#CC2C00"
        />
      )}
    </svg>
  );
};

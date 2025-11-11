import { IIconProps } from "@/components/icons/interface";

/**
 * HP Client Theme - Approved Icon
 * Custom icon for approved card in HP client theme
 */
const ApprovedIcon = (props: IIconProps) => {
  const iconColor = props.color || "#FFFFFF"; // Default to white

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_26_10496)">
        <path
          d="M8.00065 14.6673C11.6825 14.6673 14.6673 11.6825 14.6673 8.00065C14.6673 4.31875 11.6825 1.33398 8.00065 1.33398C4.31875 1.33398 1.33398 4.31875 1.33398 8.00065C1.33398 11.6825 4.31875 14.6673 8.00065 14.6673Z"
          stroke={iconColor}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 8.00033L7.33333 9.33366L10 6.66699"
          stroke={iconColor}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_26_10496">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { ApprovedIcon };

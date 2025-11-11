import { IIconProps } from "@/components/icons/interface";

/**
 * HP Client Theme - Success Rate Icon
 * Custom icon for success rate card in HP client theme
 */
const SuccessRateIcon = (props: IIconProps) => {
  const iconColor = props.color || "#FFFFFF"; // Default to white

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.666 4.66602H14.666V8.66602"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6673 4.66602L9.00065 10.3327L5.66732 6.99935L1.33398 11.3327"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { SuccessRateIcon };


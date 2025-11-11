import { IIconProps } from "@/components/icons/interface";

/**
 * HP Client Theme - Monthly Performance Icon
 * Custom icon for monthly performance card in HP client theme
 */
const MonthlyPerformanceIcon = (props: IIconProps) => {
  const iconColor = props.color || "#024AD8"; // Default to HP client primary blue

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.3333V6"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.66602 11.334V3.33398"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33398 11.334V9.33398"
        stroke={iconColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { MonthlyPerformanceIcon };

import { IIconProps } from "@/components/icons/interface";

const ResetColorIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width={width || "14"}
      height={height || "14"}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5C1 5 2.00249 3.63411 2.81692 2.81912C3.63134 2.00413 4.7568 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.94845 10.5 2.21756 9.12714 1.67588 7.25M1 5V2M1 5H4"
        stroke={color || "var(--theme-secondary-300, #8283BE)"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ResetColorIcon };

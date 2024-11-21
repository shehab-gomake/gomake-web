import { IIconProps } from "@/components/icons/interface";
const ArrowDownNewIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width={width || "20"}
      height={height || "20"}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={color || "#252675"}
        stroke-width="1.67"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ArrowDownNewIcon };

import { IIconProps } from "@/components/icons/interface";

const HpIndigoIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3V21H21V3H3ZM5 5H19V19H5V5ZM7 7V17H9V7H7ZM11 7V17H13V7H11ZM15 7V17H17V7H15Z"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7 9H9M7 13H9M11 9H13M11 13H13M15 9H17M15 13H17"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { HpIndigoIcon };


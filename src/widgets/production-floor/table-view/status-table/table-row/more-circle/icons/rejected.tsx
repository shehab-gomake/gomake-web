import { IIconProps } from "@/components/icons/interface";

const RejectedIcon = ({ height, width }: IIconProps) => {
  return (
    <svg
      width={width || "16"}
      height={height || "16"}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3584_8497)">
        <path
          d="M3.28665 3.28536L12.7133 12.712M14.6666 7.9987C14.6666 11.6806 11.6819 14.6654 7.99998 14.6654C4.31808 14.6654 1.33331 11.6806 1.33331 7.9987C1.33331 4.3168 4.31808 1.33203 7.99998 1.33203C11.6819 1.33203 14.6666 4.3168 14.6666 7.9987Z"
          stroke="#D92D20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3584_8497">
          <rect width={width || "16"} height={height || "16"} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { RejectedIcon };

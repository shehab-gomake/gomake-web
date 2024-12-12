import { IIconProps } from "@/components/icons/interface";

const WaitingIcon = ({ height, width }: IIconProps) => {
  return (
    <svg
      width={width || "16"}
      height={height || "16"}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3585_8438)">
        <path
          d="M7.99998 3.9987V7.9987L10.6666 9.33203M14.6666 7.9987C14.6666 11.6806 11.6819 14.6654 7.99998 14.6654C4.31808 14.6654 1.33331 11.6806 1.33331 7.9987C1.33331 4.3168 4.31808 1.33203 7.99998 1.33203C11.6819 1.33203 14.6666 4.3168 14.6666 7.9987Z"
          stroke="#FAC515"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3585_8438">
          <rect width={width || "16"} height={height || "16"} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { WaitingIcon };

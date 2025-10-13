import { IIconProps } from "@/components/icons/interface";
const AIIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.5L13.09 8.26L18 9.5L13.09 10.74L12 16.5L10.91 10.74L6 9.5L10.91 8.26L12 2.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19 15.5L19.5 17.5L21.5 18L19.5 18.5L19 20.5L18.5 18.5L16.5 18L18.5 17.5L19 15.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 15.5L5.5 17.5L7.5 18L5.5 18.5L5 20.5L4.5 18.5L2.5 18L4.5 17.5L5 15.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { AIIcon };

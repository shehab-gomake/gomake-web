import { IIconProps } from "@/components/icons/interface";
const HomeIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.02 3.33999L3.63 7.53999C2.73 8.23999 2 9.72999 2 10.86V18.27C2 20.59 3.89 22.49 6.21 22.49H17.79C20.11 22.49 22 20.59 22 18.28V11C22 9.78999 21.19 8.23999 20.2 7.54999L14.02 3.21999C12.62 2.23999 10.37 2.28999 9.02 3.33999Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.5 18.5H13.5C15.15 18.5 16.5 17.15 16.5 15.5V12.5C16.5 10.85 15.15 9.5 13.5 9.5H10.5C8.85 9.5 7.5 10.85 7.5 12.5V15.5C7.5 17.15 8.85 18.5 10.5 18.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 9.5V18.5"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.5 14H16.5"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { HomeIcon };

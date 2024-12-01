import { IIconProps } from "@/components/icons/interface";
const SalesIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.88086 18.65V16.58"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M12 18.65V14.51"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M17.1191 18.65V12.43"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M17.1209 6.35001L16.6609 6.89001C14.1109 9.87001 10.6909 11.98 6.88086 12.93"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M14.1895 6.35001H17.1195V9.27001"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 22.5H15C20 22.5 22 20.5 22 15.5V9.5C22 4.5 20 2.5 15 2.5H9C4 2.5 2 4.5 2 9.5V15.5C2 20.5 4 22.5 9 22.5Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { SalesIcon };

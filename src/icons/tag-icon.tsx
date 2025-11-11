import { IIconProps } from "@/components/icons/interface";

const TagIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66671 2L5.33337 14"
        stroke={color || "#8283BE"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 2L9.33337 14"
        stroke={color || "#8283BE"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.33337 6H14.3334"
        stroke={color || "#8283BE"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66663 10H13.6666"
        stroke={color || "#8283BE"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    // <svg
    //   width="18"
    //   height="18"
    //   viewBox="0 0 18 18"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M14.8726 11.4749L11.4751 14.8724C10.0801 16.2674 7.81508 16.2674 6.41258 14.8724L3.12008 11.5799C1.72508 10.1849 1.72508 7.91985 3.12008 6.51735L6.52508 3.12735C7.23758 2.41485 8.22008 2.03235 9.22508 2.08485L12.9751 2.26485C14.4751 2.33235 15.6676 3.52485 15.7426 5.01735L15.9226 8.76735C15.9676 9.77985 15.5851 10.7624 14.8726 11.4749Z"
    //     stroke="#8283BE"
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M10.8751 9C9.83959 9 9.00012 8.16053 9.00012 7.125C9.00012 6.08947 9.83959 5.25 10.8751 5.25C11.9107 5.25 12.7501 6.08947 12.7501 7.125C12.7501 8.16053 11.9107 9 10.8751 9Z"
    //     stroke="#8283BE"
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //   />
    // </svg>
  );
};

export { TagIcon };

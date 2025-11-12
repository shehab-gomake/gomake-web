import { IIconProps } from "@/components/icons/interface";

const CartIcon = (props: IIconProps) => {
  const { color = "#ed028c" } = props;
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.83337 1.8335H3.42838C4.41838 1.8335 5.19754 2.686 5.11504 3.66683L4.35421 12.7968C4.22587 14.291 5.40837 15.5743 6.9117 15.5743H16.6742C17.9942 15.5743 19.1492 14.4927 19.25 13.1818L19.745 6.30683C19.855 4.78517 18.7 3.54766 17.1692 3.54766H5.33505"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.8958 20.1667C15.5287 20.1667 16.0417 19.6537 16.0417 19.0208C16.0417 18.388 15.5287 17.875 14.8958 17.875C14.263 17.875 13.75 18.388 13.75 19.0208C13.75 19.6537 14.263 20.1667 14.8958 20.1667Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.56246 20.1667C8.19529 20.1667 8.70829 19.6537 8.70829 19.0208C8.70829 18.388 8.19529 17.875 7.56246 17.875C6.92963 17.875 6.41663 18.388 6.41663 19.0208C6.41663 19.6537 6.92963 20.1667 7.56246 20.1667Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.25 7.3335H19.25"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
export { CartIcon };

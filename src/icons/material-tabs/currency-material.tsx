import {IIconProps} from "@/components/icons/interface";

const CurrencyMaterial = ({width, height, color}: IIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.15549 5.20938C9.98749 5.15765 10.8122 5.39324 11.495 5.87769C11.9623 6.18283 12.3649 6.57919 12.6793 7.04365C12.9938 7.50811 13.2137 8.03135 13.3264 8.58286C13.3882 8.83186 13.4161 9.08827 13.4091 9.34493C13.4091 9.46463 13.4426 9.49854 13.5529 9.48857C13.6632 9.47859 13.7262 9.48857 13.8109 9.48857C14.0078 9.47061 14.0078 9.59231 13.9428 9.70802C13.7065 10.0831 13.4544 10.4462 13.2063 10.8112C13.1157 10.9429 13.0232 10.897 12.9523 10.7893C12.7199 10.4402 12.4875 10.0891 12.261 9.73395C12.1567 9.57435 12.198 9.49854 12.3792 9.49056C12.7967 9.47261 12.7731 9.4766 12.7297 9.0417C12.6639 8.39449 12.4142 7.78051 12.0109 7.27416C11.5061 6.60847 10.7882 6.14154 9.98061 5.9535C9.19164 5.7563 8.3592 5.8489 7.63126 6.21484C7.10576 6.45862 6.64791 6.83026 6.29848 7.29666C5.94906 7.76307 5.7189 8.30977 5.62851 8.88809C5.53449 9.37769 5.54452 9.88197 5.65793 10.3673C5.77134 10.8527 5.98554 11.308 6.28625 11.703C6.57334 12.0913 6.93396 12.4178 7.34705 12.6634C7.76013 12.9089 8.21738 13.0685 8.69207 13.133C9.16677 13.1975 9.64938 13.1654 10.1117 13.0387C10.574 12.9121 11.0068 12.6933 11.3847 12.3952C11.6183 12.1999 11.8326 11.9821 12.0247 11.7449C12.0489 11.707 12.0802 11.6743 12.1168 11.6487C12.1535 11.6231 12.1947 11.605 12.2382 11.5956C12.2818 11.5861 12.3267 11.5855 12.3705 11.5936C12.4143 11.6018 12.4561 11.6186 12.4934 11.6431C12.5324 11.668 12.5654 11.7012 12.5903 11.7404C12.6152 11.7797 12.6314 11.8239 12.6375 11.8702C12.6437 11.9164 12.6399 11.9634 12.6262 12.0079C12.6125 12.0525 12.5894 12.0934 12.5584 12.1279C12.2796 12.5306 11.9257 12.8742 11.5167 13.1393C10.9689 13.5158 10.3363 13.7463 9.67735 13.8097C8.59517 13.9428 7.50389 13.6492 6.62955 12.9896C5.75521 12.3301 5.1648 11.3551 4.98061 10.2666C4.86623 9.67707 4.87733 9.06961 5.01317 8.48477C5.149 7.89993 5.40645 7.35118 5.76833 6.87517C6.35953 6.06305 7.22163 5.49593 8.19448 5.2792C8.50936 5.20597 8.83351 5.18242 9.15549 5.20938Z"
        fill= {color || "#8283BE"}
      />
      <path
        d="M9.21448 11.8047H8.98014V11.2641C8.67789 11.2742 8.37875 11.1996 8.11562 11.0486V10.6895C8.1745 10.7336 8.23711 10.7723 8.3027 10.8052C8.37314 10.8415 8.44622 10.8721 8.52129 10.897C8.5966 10.9215 8.67362 10.9401 8.7517 10.9529C8.82714 10.9662 8.90357 10.9729 8.98014 10.9728V9.52049L8.66702 9.34095C8.56653 9.2856 8.47269 9.21865 8.38738 9.14145C8.30731 9.06198 8.24077 8.96962 8.19046 8.86814C8.13608 8.74957 8.10978 8.61978 8.11365 8.4891C8.11259 8.36695 8.13465 8.24573 8.17864 8.132C8.22006 8.02511 8.28084 7.927 8.35784 7.84273C8.43768 7.76059 8.53096 7.6931 8.63354 7.64323C8.74411 7.58858 8.86235 7.55156 8.98408 7.53351V7.04874H9.21842V7.51157C9.3508 7.51323 9.4827 7.52793 9.61228 7.55546C9.71238 7.57679 9.80957 7.61029 9.90176 7.6552V7.99634C9.69585 7.86822 9.45806 7.80246 9.21645 7.80682V9.28708C9.36244 9.3595 9.50326 9.44216 9.63788 9.53446C9.74089 9.60329 9.83542 9.68433 9.91948 9.77585C9.98434 9.84955 10.0339 9.93571 10.0652 10.0292C10.0959 10.1204 10.1112 10.2162 10.1105 10.3125C10.111 10.4284 10.0903 10.5434 10.0495 10.6516C10.0095 10.7543 9.9507 10.8484 9.87616 10.9289C9.7957 11.0121 9.70093 11.0797 9.59652 11.1284C9.47885 11.1852 9.35336 11.2235 9.22433 11.2421L9.21448 11.8047ZM8.98014 7.8148C8.82886 7.83765 8.68987 7.91228 8.58628 8.02627C8.4893 8.14088 8.43865 8.28838 8.44449 8.43922C8.44404 8.50647 8.45198 8.5735 8.46812 8.63872C8.48537 8.70266 8.51407 8.76285 8.5528 8.81627C8.59925 8.87789 8.65431 8.93233 8.71625 8.97786C8.7979 9.0409 8.88414 9.09759 8.97423 9.14743L8.98014 7.8148ZM9.21448 10.9529C9.36864 10.9327 9.51228 10.8628 9.62409 10.7534C9.71789 10.6428 9.76649 10.5001 9.75997 10.3544C9.76097 10.2867 9.75099 10.2193 9.73043 10.1549C9.70953 10.0911 9.67751 10.0317 9.63591 9.97933C9.58814 9.91638 9.53178 9.86063 9.46852 9.81375C9.38713 9.75294 9.3023 9.69698 9.21448 9.64617V10.9529Z"
        fill={color || "#8283BE"}
      />
      <path
        d="M9.28476 17.7856C13.8603 17.7856 17.5695 14.028 17.5695 9.39281C17.5695 4.7576 13.8603 1.00002 9.28476 1.00002C4.70921 1.00002 1 4.7576 1 9.39281C1 14.028 4.70921 17.7856 9.28476 17.7856Z"
        stroke={color || "#8283BE"}
        stroke-miterlimit="10"
      />
    </svg>
  );
};

export { CurrencyMaterial };

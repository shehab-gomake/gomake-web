const WastebasketNew = (props : any) => {
  return (
    <svg
      width={props.width || "40"}
      height={props.height ||  "40"}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_8063_35747)">
        <rect x="2" y="1" width="36" height="36" rx="8" fill="#FEF3F2" />
        <path
          d="M12.5 13.9998H14.1667M14.1667 13.9998H27.5M14.1667 13.9998V25.6665C14.1667 26.1085 14.3423 26.5325 14.6548 26.845C14.9674 27.1576 15.3913 27.3332 15.8333 27.3332H24.1667C24.6087 27.3332 25.0326 27.1576 25.3452 26.845C25.6577 26.5325 25.8333 26.1085 25.8333 25.6665V13.9998H14.1667ZM16.6667 13.9998V12.3332C16.6667 11.8911 16.8423 11.4672 17.1548 11.1547C17.4674 10.8421 17.8913 10.6665 18.3333 10.6665H21.6667C22.1087 10.6665 22.5326 10.8421 22.8452 11.1547C23.1577 11.4672 23.3333 11.8911 23.3333 12.3332V13.9998M18.3333 18.1665V23.1665M21.6667 18.1665V23.1665"
          stroke="#B42318"
          stroke-width="1.67"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          x="2.5"
          y="1.5"
          width="35"
          height="35"
          rx="7.5"
          stroke="#FEF3F2"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_8063_35747"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_8063_35747"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_8063_35747"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export { WastebasketNew };

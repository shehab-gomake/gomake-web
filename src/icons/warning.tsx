const WarningIcon = (props: any) => {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.3">
        <rect
          x="6"
          y="6"
          width="22"
          height="22"
          rx="11"
          stroke={props.color || "var(--theme-primary-color, #2E3092)"}
          stroke-width="2"
        />
      </g>
      <g opacity="0.1">
        <rect
          x="1"
          y="1"
          width="32"
          height="32"
          rx="16"
          stroke={props.color || "var(--theme-primary-color, #2E3092)"}
          stroke-width="2"
        />
      </g>
      <g clip-path="url(#clip0_4762_93)">
        <path
          d="M17 14.3335V17.0002M17 19.6668H17.0067M23.6667 17.0002C23.6667 20.6821 20.6819 23.6668 17 23.6668C13.3181 23.6668 10.3334 20.6821 10.3334 17.0002C10.3334 13.3183 13.3181 10.3335 17 10.3335C20.6819 10.3335 23.6667 13.3183 23.6667 17.0002Z"
          stroke={props.color || "var(--theme-primary-color, #2E3092)"}
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4762_93">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(9 9)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export { WarningIcon };

const SettingsIcon = (props: any) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21Z"
        stroke={props.stroke || "white"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 18.8801V17.1201C8 16.0801 8.85 15.2201 9.9 15.2201C11.71 15.2201 12.45 13.9401 11.54 12.3701C11.02 11.4701 11.33 10.3001 12.24 9.78006L13.97 8.79006C14.76 8.32006 15.78 8.60006 16.25 9.39006L16.36 9.58006C17.26 11.1501 18.74 11.1501 19.65 9.58006L19.76 9.39006C20.23 8.60006 21.25 8.32006 22.04 8.79006L23.77 9.78006C24.68 10.3001 24.99 11.4701 24.47 12.3701C23.56 13.9401 24.3 15.2201 26.11 15.2201C27.15 15.2201 28.01 16.0701 28.01 17.1201V18.8801C28.01 19.9201 27.16 20.7801 26.11 20.7801C24.3 20.7801 23.56 22.0601 24.47 23.6301C24.99 24.5401 24.68 25.7001 23.77 26.2201L22.04 27.2101C21.25 27.6801 20.23 27.4001 19.76 26.6101L19.65 26.4201C18.75 24.8501 17.27 24.8501 16.36 26.4201L16.25 26.6101C15.78 27.4001 14.76 27.6801 13.97 27.2101L12.24 26.2201C11.33 25.7001 11.02 24.5301 11.54 23.6301C12.45 22.0601 11.71 20.7801 9.9 20.7801C8.85 20.7801 8 19.9201 8 18.8801Z"
        stroke={props.stroke || "white"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { SettingsIcon };

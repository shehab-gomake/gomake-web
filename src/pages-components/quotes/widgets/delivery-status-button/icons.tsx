const ChangeIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.16696 1.75L9.5903 3.11502L4.9528 3.10334C2.8703 3.10334 1.16113 4.81252 1.16113 6.90668C1.16113 7.95085 1.58696 8.90167 2.27529 9.59"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.83349 12.2499L4.41016 10.8849L9.04765 10.8966C11.1302 10.8966 12.8393 9.1874 12.8393 7.09323C12.8393 6.04906 12.4135 5.09825 11.7252 4.40991"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.25 7H8.75"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const NextArrowIcon = ({ color }: any) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16602 10H15.8327M15.8327 10L9.99935 4.16667M15.8327 10L9.99935 15.8333"
        stroke={color || "#344054"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const PrevArrowIcon = ({ color }: any) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8337 10H4.16699M4.16699 10L10.0003 15.8333M4.16699 10L10.0003 4.16667"
        stroke={color || "#344054"}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ChangeIcon, PrevArrowIcon, NextArrowIcon };

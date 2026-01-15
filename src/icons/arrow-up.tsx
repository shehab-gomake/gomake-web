const ArrowUpIcon = (props: any) => {
  const { stroke } = props;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="16"
        height="16"
        rx="4"
        fill={"var(--theme-secondary-100, #EAEAF4)"}
      />
      <path
        d="M11 9.5L8 6.5L5 9.5"
        stroke={stroke || "#ED028C"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ArrowUpIcon };

const PrintPdfIcon = (props: any) => {
  const color = props.color || "#8283BE";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6667 6.66683V10.0002C14.6667 13.3335 13.3334 14.6668 10 14.6668H6.00004C2.66671 14.6668 1.33337 13.3335 1.33337 10.0002V6.00016C1.33337 2.66683 2.66671 1.3335 6.00004 1.3335H9.33337"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 6.66683H12C10 6.66683 9.33337 6.00016 9.33337 4.00016V1.3335L14.6667 6.66683Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66663 8.6665H8.66663"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66663 11.3335H7.33329"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { PrintPdfIcon };

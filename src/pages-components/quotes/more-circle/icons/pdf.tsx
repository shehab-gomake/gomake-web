const PDFIcon = (props: any) => {
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
        d="M14.6668 6.66634V9.99967C14.6668 13.333 13.3335 14.6663 10.0002 14.6663H6.00016C2.66683 14.6663 1.3335 13.333 1.3335 9.99967V5.99967C1.3335 2.66634 2.66683 1.33301 6.00016 1.33301H9.3335"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6668 6.66634H12.0002C10.0002 6.66634 9.3335 5.99967 9.3335 3.99967V1.33301L14.6668 6.66634Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { PDFIcon };

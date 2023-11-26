const PlusIcon = ({ ...props }) => {
  return (
    <svg
      width={props.width || "16"}
      height={props.height || "16"}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 8.61865H12"
        stroke={props.stroke || "#ED028C"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 12.6187V4.61865"
        stroke={props.stroke || "#ED028C"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { PlusIcon };

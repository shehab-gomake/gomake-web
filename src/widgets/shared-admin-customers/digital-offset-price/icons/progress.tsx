const Progress = (props: any) => {
  return (
    <svg
      width={props.width || "297"}
      height="16"
      viewBox="0 0 100% 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="5" width="100%" height="8" rx="4" fill="#D5D6E9" />
      <rect
        x="0.140625"
        y="5"
        width={props.data || "0%"}
        height="8"
        rx="4"
        fill="#2E3092"
      />
      <ellipse
        cx={props.data || "0%"}
        cy="8"
        rx="8.37143"
        ry="8"
        fill="#2E3092"
      />
    </svg>
  );
};

export { Progress };

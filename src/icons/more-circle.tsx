const MoreCircleIcon = (props: any) => {
  const { color } = props;
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.6111 12C22.6111 6.5 18.0236 2 12.4166 2C6.80967 2 2.22217 6.5 2.22217 12C2.22217 17.5 6.80967 22 12.4166 22C18.0236 22 22.6111 17.5 22.6111 12Z"
        fill="white"
        stroke={color || "#5859A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4167 8.00354V7.99456V8.00354Z"
        fill="white"
      />
      <path
        d="M12.4167 8.00354V7.99456"
        stroke={color || "#5859A8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4167 12.0045V11.9955V12.0045Z"
        fill="white"
      />
      <path
        d="M12.4167 12.0045V11.9955"
        stroke={color || "#5859A8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4167 16.0055V15.9965V16.0055Z"
        fill="white"
      />
      <path
        d="M12.4167 16.0055V15.9965"
        stroke={color || "#5859A8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { MoreCircleIcon };

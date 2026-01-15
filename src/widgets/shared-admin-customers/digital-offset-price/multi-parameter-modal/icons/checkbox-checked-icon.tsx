const CheckboxCheckedIcon = (props: any) => {
  const { stroke } = props;
  const color = stroke || `var(--theme-secondary-color, #ED028C)`;
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" fill="#F2F6F9" />
      <path
        d="M14.6668 6.5L8.25016 12.9167L5.3335 10"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke={color} />
    </svg>
  );
};

export { CheckboxCheckedIcon };

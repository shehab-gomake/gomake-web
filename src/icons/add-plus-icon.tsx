const AddPlusIcon = (props: any) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33398 8.08716H10.6673"
        stroke={props.stroke || "#2E3092"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 10.7539V5.42053"
        stroke={props.stroke || "#2E3092"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.00065 14.7539H10.0007C13.334 14.7539 14.6673 13.4205 14.6673 10.0872V6.0872C14.6673 2.75387 13.334 1.42053 10.0007 1.42053H6.00065C2.66732 1.42053 1.33398 2.75387 1.33398 6.0872V10.0872C1.33398 13.4205 2.66732 14.7539 6.00065 14.7539Z"
        stroke={props.stroke || "#2E3092"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { AddPlusIcon };

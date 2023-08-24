const PrameterIcon = ({ ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1736 3.59997L5.96358 12.29C5.65358 12.62 5.35358 13.27 5.29358 13.72L4.92358 16.96C4.79358 18.13 5.63358 18.93 6.79358 18.73L10.0136 18.18C10.4636 18.1 11.0936 17.77 11.4036 17.43L19.6136 8.73997C21.0336 7.23997 21.6736 5.52997 19.4636 3.43997C17.2636 1.36997 15.5936 2.09997 14.1736 3.59997Z"
        stroke={props.stroke || "#1C1D58"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.8036 5.05005C13.2336 7.81005 15.4736 9.92005 18.2536 10.2"
        stroke={props.stroke || "#1C1D58"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.91357 22H21.9136"
        stroke={props.stroke || "#1C1D58"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { PrameterIcon };

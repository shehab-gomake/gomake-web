const ErrorIcon = (props: any) => {
    return (
        <svg width={props.width || "14"} height={props.height || "14"} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1.3125C5.87512 1.3125 4.7755 1.64607 3.8402 2.27102C2.90489 2.89597 2.17591 3.78423 1.74544 4.82349C1.31496 5.86274 1.20233 7.00631 1.42179 8.10958C1.64124 9.21284 2.18292 10.2263 2.97833 11.0217C3.77374 11.8171 4.78716 12.3588 5.89043 12.5782C6.99369 12.7977 8.13726 12.685 9.17651 12.2546C10.2158 11.8241 11.104 11.0951 11.729 10.1598C12.3539 9.2245 12.6875 8.12488 12.6875 7C12.6859 5.49207 12.0862 4.04636 11.0199 2.98009C9.95365 1.91382 8.50793 1.31409 7 1.3125ZM6.5625 4.375C6.5625 4.25897 6.6086 4.14769 6.69064 4.06564C6.77269 3.98359 6.88397 3.9375 7 3.9375C7.11603 3.9375 7.22731 3.98359 7.30936 4.06564C7.39141 4.14769 7.4375 4.25897 7.4375 4.375V7.4375C7.4375 7.55353 7.39141 7.66481 7.30936 7.74686C7.22731 7.82891 7.11603 7.875 7 7.875C6.88397 7.875 6.77269 7.82891 6.69064 7.74686C6.6086 7.66481 6.5625 7.55353 6.5625 7.4375V4.375ZM7 10.0625C6.87021 10.0625 6.74333 10.024 6.63541 9.9519C6.52749 9.87979 6.44338 9.7773 6.39371 9.65739C6.34404 9.53747 6.33104 9.40552 6.35636 9.27822C6.38168 9.15092 6.44419 9.03399 6.53596 8.94221C6.62774 8.85043 6.74467 8.78793 6.87197 8.76261C6.99927 8.73729 7.13122 8.75028 7.25114 8.79995C7.37105 8.84962 7.47354 8.93374 7.54565 9.04166C7.61776 9.14958 7.65625 9.27646 7.65625 9.40625C7.65625 9.5803 7.58711 9.74722 7.46404 9.87029C7.34097 9.99336 7.17405 10.0625 7 10.0625Z" fill="#F04349" />
        </svg>
    );
};

export { ErrorIcon };